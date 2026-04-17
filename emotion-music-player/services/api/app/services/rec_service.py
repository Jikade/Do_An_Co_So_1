<<<<<<< HEAD
import requests

ML_SERVICE = "http://ml:8001"

def get_recommendations(user_id, emotion):

    res = requests.post(
        f"{ML_SERVICE}/recommend",
        json={
            "user_id": user_id,
            "emotion": emotion
        }
    )

    return res.json()
=======
from typing import Any

import requests
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.track import Track


def _fallback_tracks(limit: int = 10) -> list[dict[str, Any]]:
    db: Session = SessionLocal()
    try:
        tracks = db.query(Track).order_by(Track.id.asc()).limit(limit).all()
        return [
            {
                "id": track.id,
                "title": track.title,
                "artist": track.artist,
                "audio_url": track.audio_url,
                "duration": track.duration,
            }
            for track in tracks
        ]
    finally:
        db.close()


def get_recommendations(user_id: int, emotion_state: dict, limit: int = 10) -> dict[str, Any]:
    try:
        response = requests.post(
            f"{settings.ML_SERVICE_URL}/recommend",
            json={
                "user_id": user_id,
                "emotion_state": emotion_state,
                "limit": limit,
            },
            timeout=settings.REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except Exception:
        tracks = _fallback_tracks(limit=limit)
        return {
            "tracks": tracks,
            "rationale": "Fallback recommendation from local database because ML service is unavailable.",
        }
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
