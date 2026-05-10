from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.models.track import Track
from app.schemas.emotion_detection import EmotionDetectResponse
from app.services.ml_gateway import TARGET_EMOTIONS, predict_emotion
from app.services.music_enrichment import EMOTION_LABELS_VI

# Cảm xúc từ NLP -> các mood đang lưu trong DB tracks.emotion.
# DB hiện dùng field "emotion" như mood, ví dụ: happy/sad/focus/healing/relax/lonely/energetic/sleep.
EMOTION_TO_MOOD_WEIGHTS: dict[str, dict[str, float]] = {
    "happy": {
        "happy": 1.00,
        "energetic": 0.82,
        "romantic": 0.55,
        "relax": 0.35,
        "calm": 0.35,
    },
    "sad": {
        "sad": 1.00,
        "lonely": 0.92,
        "healing": 0.76,
        "relax": 0.55,
        "calm": 0.55,
        "sleep": 0.42,
    },
    "angry": {
        "angry": 1.00,
        "energetic": 0.78,
        "focus": 0.62,
        "relax": 0.50,
        "calm": 0.50,
        "healing": 0.42,
    },
    "relaxed": {
        "relax": 1.00,
        "calm": 1.00,
        "healing": 0.82,
        "sleep": 0.78,
        "focus": 0.62,
        "happy": 0.30,
    },
}

MOOD_ALIASES = {
    "relaxed": "relax",
    "relaxing": "relax",
    "calm": "calm",
    "vui": "happy",
    "buon": "sad",
    "buồn": "sad",
    "thu gian": "relax",
    "thư giãn": "relax",
    "co don": "lonely",
    "cô đơn": "lonely",
    "nang dong": "energetic",
    "năng động": "energetic",
}


def _normalize_mood(value: str | None) -> str:
    if not value:
        return "relax"
    raw = value.strip().lower()
    return MOOD_ALIASES.get(raw, raw)


def _normalize_probabilities(result: dict[str, Any]) -> dict[str, float]:
    raw = result.get("probabilities") or {}
    probabilities = {emotion: 0.0 for emotion in TARGET_EMOTIONS}
    for emotion in TARGET_EMOTIONS:
        try:
            probabilities[emotion] = max(0.0, float(raw.get(emotion, 0.0)))
        except (TypeError, ValueError):
            probabilities[emotion] = 0.0

    if sum(probabilities.values()) <= 0:
        label = str(result.get("label") or "relaxed").lower()
        confidence = max(0.0, min(float(result.get("confidence") or 0.55), 1.0))
        if label not in probabilities:
            label = "relaxed"
        for emotion in TARGET_EMOTIONS:
            probabilities[emotion] = (1.0 - confidence) / 3.0
        probabilities[label] = confidence

    total = sum(probabilities.values()) or 1.0
    return {emotion: round(probabilities[emotion] / total, 4) for emotion in TARGET_EMOTIONS}


def _best_audio_score(track: Track, target_emotion: str) -> float:
    scores = track.emotion_scores or {}
    if not isinstance(scores, dict) or not scores:
        return 0.0

    mood_weights = EMOTION_TO_MOOD_WEIGHTS[target_emotion]
    best = 0.0
    for mood, weight in mood_weights.items():
        try:
            best = max(best, float(scores.get(mood, 0.0)) * weight)
        except (TypeError, ValueError):
            continue
    return max(0.0, min(best, 1.0))


def _rank_track(track: Track, target_emotion: str, confidence: float) -> tuple[float, str | None]:
    mood = _normalize_mood(track.emotion)
    mood_weights = EMOTION_TO_MOOD_WEIGHTS[target_emotion]
    mood_match = mood_weights.get(mood, 0.0)
    audio_match = _best_audio_score(track, target_emotion)

    if mood_match <= 0 and audio_match <= 0:
        # Không loại bỏ hoàn toàn để vẫn có fallback nếu DB chưa gán mood đúng.
        score = 0.08 + confidence * 0.04
        return round(score * 100, 2), None

    score = 0.68 * mood_match + 0.22 * audio_match + 0.10 * confidence
    return round(max(0.0, min(score, 1.0)) * 100, 2), mood if mood_match > 0 else None


def _track_to_recommendation(track: Track, score: float, matched_mood: str | None) -> dict[str, Any]:
    emotion = _normalize_mood(track.emotion)
    return {
        "id": track.id,
        "title": track.title,
        "artist": track.artist,
        "audio_url": track.audio_url,
        "duration": track.duration or 0,
        "emotion": emotion,
        "mood": emotion,
        "emotion_label_vi": EMOTION_LABELS_VI.get(emotion, emotion),
        "cover_image": track.cover_image,
        "lyrics": track.lyrics,
        "emotion_scores": track.emotion_scores or {},
        "recommendation_score": score,
        "matched_mood": matched_mood,
    }


def detect_emotion_and_recommend(text: str, limit: int, db: Session) -> EmotionDetectResponse:
    ml_result = predict_emotion({"text": text})
    probabilities = _normalize_probabilities(ml_result)
    emotion = max(probabilities, key=probabilities.get)
    confidence = float(probabilities[emotion])

    tracks = db.query(Track).order_by(Track.id.asc()).all()
    ranked: list[dict[str, Any]] = []

    for track in tracks:
        score, matched_mood = _rank_track(track, emotion, confidence)
        ranked.append(_track_to_recommendation(track, score, matched_mood))

    ranked.sort(key=lambda item: item["recommendation_score"], reverse=True)
    recommended = ranked[:limit]

    return EmotionDetectResponse(
        emotion=emotion,
        confidence=round(confidence, 4),
        confidencePercent=round(confidence * 100),
        probabilities=probabilities,
        recommendedSongs=recommended,
        autoPlaySong=recommended[0] if recommended else None,
        rationale=(
            f"NLP dự đoán cảm xúc '{emotion}' với độ tin cậy {round(confidence * 100)}%. "
            "Bài hát được xếp hạng theo mức khớp mood trong DB, emotion_scores audio nếu có, "
            "và confidence của kết quả NLP."
        ),
    )
