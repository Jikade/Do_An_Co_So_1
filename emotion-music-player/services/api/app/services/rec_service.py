from typing import Any

import requests
from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.track import Track


EMOTION_ALIASES: dict[str, set[str]] = {
    "happy": {
        "happy",
        "joy",
        "enjoyment",
        "positive",
        "vui",
        "vui vẻ",
        "green",
        "energetic",
    },
    "sad": {
        "sad",
        "sadness",
        "negative",
        "lonely",
        "buon",
        "buồn",
        "blue",
        "nostalgic",
    },
    "angry": {
        "angry",
        "anger",
        "disgust",
        "fear",
        "stressed",
        "stress",
        "căng thẳng",
        "tức giận",
        "red",
    },
    "relaxed": {
        "relaxed",
        "relax",
        "calm",
        "chill",
        "healing",
        "sleep",
        "thư giãn",
        "bình yên",
        "cyan",
    },
}


def _normalize_emotion(value: Any) -> str:
    raw = str(value or "relaxed").lower().strip()

    for canonical, aliases in EMOTION_ALIASES.items():
        if raw in aliases:
            return canonical

    if "happy" in raw or "vui" in raw or "joy" in raw:
        return "happy"

    if "sad" in raw or "buồn" in raw or "lonely" in raw:
        return "sad"

    if "angry" in raw or "stress" in raw or "căng" in raw:
        return "angry"

    return "relaxed"


def _extract_emotion_label(emotion_state: dict[str, Any] | None) -> str:
    emotion_state = emotion_state or {}

    return _normalize_emotion(
        emotion_state.get("label")
        or emotion_state.get("emotion")
        or emotion_state.get("mood")
        or emotion_state.get("name")
    )


def _track_to_dict(track: Track, score: float, matched_mood: str | None = None) -> dict[str, Any]:
    emotion = track.emotion or "relax"

    return {
        "id": track.id,
        "title": track.title,
        "artist": track.artist,
        "audio_url": track.audio_url,
        "duration": track.duration or 0,
        "emotion": emotion,
        "mood": emotion,
        "emotion_label_vi": None,
        "cover_image": track.cover_image,
        "lyrics": track.lyrics,
        "emotion_scores": track.emotion_scores or {},
        "recommendation_score": score,
        "matched_mood": matched_mood or emotion,
    }


def _fallback_tracks_by_emotion(
    emotion_state: dict[str, Any] | None,
    limit: int = 10,
) -> list[dict[str, Any]]:
    emotion = _extract_emotion_label(emotion_state)
    aliases = EMOTION_ALIASES.get(emotion, {emotion})

    db: Session = SessionLocal()

    try:
        lowered_emotion = func.lower(Track.emotion)

        exact_match_conditions = [
            lowered_emotion == alias.lower()
            for alias in aliases
        ]

        partial_match_conditions = [
            lowered_emotion.ilike(f"%{alias.lower()}%")
            for alias in aliases
        ]

        matched_tracks = (
            db.query(Track)
            .filter(or_(*exact_match_conditions, *partial_match_conditions))
            .order_by(
                case(
                    *[
                        (lowered_emotion == alias.lower(), 0)
                        for alias in aliases
                    ],
                    else_=1,
                ),
                Track.id.desc(),
            )
            .limit(limit)
            .all()
        )

        results = [
            _track_to_dict(
                track,
                score=max(60, 100 - index * 5),
                matched_mood=emotion,
            )
            for index, track in enumerate(matched_tracks)
        ]

        if len(results) >= limit:
            return results

        used_ids = {track["id"] for track in results}

        fill_tracks_query = db.query(Track)

        if used_ids:
            fill_tracks_query = fill_tracks_query.filter(~Track.id.in_(used_ids))

        fill_tracks = (
            fill_tracks_query
            .order_by(Track.id.desc())
            .limit(limit - len(results))
            .all()
        )

        results.extend(
            _track_to_dict(
                track,
                score=max(20, 55 - index * 3),
                matched_mood=track.emotion,
            )
            for index, track in enumerate(fill_tracks)
        )

        return results

    finally:
        db.close()


def get_recommendations(
    user_id: int,
    emotion_state: dict[str, Any],
    limit: int = 10,
) -> dict[str, Any]:
    emotion = _extract_emotion_label(emotion_state)

    try:
        response = requests.post(
            f"{settings.ML_SERVICE_URL}/recommend",
            json={
                "user_id": user_id,
                "emotion_state": {
                    **(emotion_state or {}),
                    "label": emotion,
                    "emotion": emotion,
                    "mood": emotion,
                },
                "limit": limit,
            },
            timeout=settings.REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()

        result = response.json()

        tracks = result.get("tracks")
        if isinstance(tracks, list) and tracks:
            return result

    except Exception:
        pass

    tracks = _fallback_tracks_by_emotion(
        emotion_state={
            **(emotion_state or {}),
            "label": emotion,
            "emotion": emotion,
            "mood": emotion,
        },
        limit=limit,
    )

    return {
        "tracks": tracks,
        "rationale": (
            f"Đề xuất local theo cảm xúc '{emotion}' vì ML service không khả dụng "
            "hoặc không trả về danh sách bài hát."
        ),
    }