from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from math import sqrt
from typing import Any

from sqlalchemy import desc, func
from sqlalchemy.orm import Session, joinedload

from app.models.interaction import Interaction
from app.models.track import Track
from app.services.music_enrichment import EMOTION_LABELS_VI


ACTION_WEIGHTS = {
    "like": 5.0,
    "listen": 1.4,
    "played": 1.4,
    "skip": -4.0,
}


def _normalize_mood(value: str | None) -> str:
    mood = (value or "relax").strip().lower()
    if mood == "focus":
        return "calm"
    if mood == "relax":
        return "calm"
    return mood or "calm"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _recency_weight(created_at: datetime | None) -> float:
    if created_at is None:
        return 1.0

    dt = created_at
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    days = max((_now_utc() - dt).total_seconds() / 86400, 0)

    # Gần đây mạnh hơn, nhưng lịch sử cũ vẫn còn tác dụng.
    return 1 / (1 + days / 14)


def _completion_ratio(row: Interaction, track: Track | None) -> float:
    if not track or not track.duration:
        return 0.5

    duration_ms = max(float(track.duration) * 1000, 1)
    ratio = float(row.listen_ms or 0) / duration_ms

    return max(0.1, min(ratio, 1.0))


def _cosine_similarity(a: dict[str, float], b: dict[str, float] | None) -> float:
    if not a or not b:
        return 0.0

    keys = set(a) | set(b)
    dot = sum(float(a.get(k, 0)) * float(b.get(k, 0)) for k in keys)
    norm_a = sqrt(sum(float(a.get(k, 0)) ** 2 for k in keys))
    norm_b = sqrt(sum(float(b.get(k, 0)) ** 2 for k in keys))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot / (norm_a * norm_b)


def _track_to_dict(track: Track) -> dict[str, Any]:
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
    }


def _get_popularity(db: Session) -> tuple[dict[int, int], int]:
    rows = (
        db.query(Interaction.track_id, func.count(Interaction.id))
        .group_by(Interaction.track_id)
        .all()
    )

    counts = {int(track_id): int(total) for track_id, total in rows}
    max_count = max(counts.values(), default=1)

    return counts, max_count


def _cold_start_recommendations(
    tracks: list[Track],
    popularity: dict[int, int],
    max_popularity: int,
    current_mood: str | None,
    limit: int,
) -> list[Track]:
    def score(track: Track) -> tuple[float, int]:
        mood = _normalize_mood(track.emotion)
        mood_score = 3.0 if current_mood and mood == current_mood else 0.0
        popularity_score = popularity.get(track.id, 0) / max_popularity
        return (mood_score + popularity_score, track.id)

    return sorted(tracks, key=score, reverse=True)[:limit]


def get_recommendations(
    db: Session,
    user_id: int,
    emotion_state: dict[str, Any] | None = None,
    limit: int = 10,
) -> dict[str, Any]:
    limit = max(1, min(int(limit or 10), 50))
    emotion_state = emotion_state or {}

    tracks = db.query(Track).order_by(Track.id.asc()).all()
    if not tracks:
        return {
            "tracks": [],
            "rationale": "Chưa có bài hát nào trong thư viện.",
        }

    current_mood = _normalize_mood(
        str(
            emotion_state.get("emotion")
            or emotion_state.get("mood")
            or emotion_state.get("label")
            or ""
        )
        or None
    )

    interactions = (
        db.query(Interaction)
        .options(joinedload(Interaction.track))
        .filter(Interaction.user_id == user_id)
        .order_by(desc(Interaction.created_at))
        .limit(300)
        .all()
    )

    popularity, max_popularity = _get_popularity(db)

    if not interactions:
        ranked = _cold_start_recommendations(
            tracks=tracks,
            popularity=popularity,
            max_popularity=max_popularity,
            current_mood=current_mood,
            limit=limit,
        )

        return {
            "tracks": [_track_to_dict(track) for track in ranked],
            "rationale": "User chưa có lịch sử nghe, hệ thống ưu tiên mood hiện tại và độ phổ biến.",
        }

    mood_scores: dict[str, float] = defaultdict(float)
    artist_scores: dict[str, float] = defaultdict(float)
    emotion_vector: dict[str, float] = defaultdict(float)
    track_preference: dict[int, float] = defaultdict(float)

    recent_track_ids = {
        row.track_id
        for row in interactions[:20]
        if (row.action or "").lower() in {"listen", "played"}
    }

    for row in interactions:
        track = row.track
        if track is None:
            continue

        action = (row.action or "listen").lower()
        base_weight = ACTION_WEIGHTS.get(action, 0.5)
        recency = _recency_weight(row.created_at)

        if action in {"listen", "played"}:
            base_weight *= 0.6 + _completion_ratio(row, track)

        weight = base_weight * recency

        mood = _normalize_mood(track.emotion)
        artist_key = (track.artist or "").strip().lower()

        mood_scores[mood] += weight
        artist_scores[artist_key] += weight
        track_preference[track.id] += weight

        # Chỉ dùng vector cảm xúc của những tương tác tích cực.
        if weight > 0 and track.emotion_scores:
            for key, value in track.emotion_scores.items():
                try:
                    emotion_vector[str(key)] += float(value) * weight
                except (TypeError, ValueError):
                    continue

    # Mood hiện tại từ nhận diện cảm xúc vẫn có ảnh hưởng, nhưng không lấn át lịch sử.
    if current_mood:
        mood_scores[current_mood] += 2.0

    def score_track(track: Track) -> float:
        mood = _normalize_mood(track.emotion)
        artist_key = (track.artist or "").strip().lower()
        popularity_score = popularity.get(track.id, 0) / max_popularity

        score = 0.0
        score += mood_scores.get(mood, 0.0) * 2.2
        score += artist_scores.get(artist_key, 0.0) * 1.3
        score += track_preference.get(track.id, 0.0) * 0.8
        score += _cosine_similarity(emotion_vector, track.emotion_scores) * 1.5
        score += popularity_score * 0.35

        # Tránh lặp lại quá nhiều bài vừa nghe, trừ khi bài đó được like/nghe nhiều.
        if track.id in recent_track_ids and track_preference.get(track.id, 0.0) < 4:
            score -= 1.2

        return score

    ranked_tracks = sorted(
        tracks,
        key=lambda item: (score_track(item), item.id),
        reverse=True,
    )[:limit]

    return {
        "tracks": [_track_to_dict(track) for track in ranked_tracks],
        "rationale": "Gợi ý dựa trên lịch sử nghe, like/skip, thời lượng nghe, mood hiện tại và độ tương đồng cảm xúc.",
    }