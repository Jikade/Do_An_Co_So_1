from typing import Any

import requests

from app.core.config import settings


def _fallback_emotion(data: dict[str, Any]) -> dict[str, Any]:
    text = (data.get("text") or "").lower()

    if any(word in text for word in ["sad", "buồn", "stress", "mệt", "tệ"]):
        label = "sad"
        valence = 0.25
        arousal = 0.40
    elif any(word in text for word in ["happy", "vui", "chill", "good", "ổn"]):
        label = "happy"
        valence = 0.82
        arousal = 0.60
    else:
        label = "neutral"
        valence = 0.50
        arousal = 0.50

    return {
        "label": label,
        "valence": valence,
        "arousal": arousal,
        "confidence": 0.55,
        "per_modality": {
            "text": {
                "label": label,
                "valence": valence,
                "arousal": arousal,
                "confidence": 0.55,
            }
        },
    }


def predict_emotion(data: dict[str, Any]) -> dict[str, Any]:
    try:
        response = requests.post(
            f"{settings.ML_SERVICE_URL}/predict",
            json=data,
            timeout=settings.REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except Exception:
        return _fallback_emotion(data)