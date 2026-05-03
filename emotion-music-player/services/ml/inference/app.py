from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Mock ML Service", version="1.0.0")


class PredictRequest(BaseModel):
    user_id: int | None = None
    face_frame: str | None = None
    voice_clip: str | None = None
    text: str | None = None


class RecommendRequest(BaseModel):
    user_id: int
    emotion_state: dict
    limit: int = 10


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(payload: PredictRequest):
    text = (payload.text or "").lower()

    if any(word in text for word in ["sad", "buồn", "stress", "mệt", "tệ"]):
        label = "sad"
        valence = 0.25
        arousal = 0.4
    elif any(word in text for word in ["happy", "vui", "good", "chill", "ổn"]):
        label = "happy"
        valence = 0.82
        arousal = 0.6
    else:
        label = "neutral"
        valence = 0.5
        arousal = 0.5

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


@app.post("/recommend")
def recommend(payload: RecommendRequest):
    tracks = [
        {
            "id": 1,
            "title": "Happy Song",
            "artist": "Artist A",
            "audio_url": "https://example.com/song1.mp3",
            "duration": 210000,
        },
        {
            "id": 2,
            "title": "Sad Song",
            "artist": "Artist B",
            "audio_url": "https://example.com/song2.mp3",
            "duration": 180000,
        },
        {
            "id": 3,
            "title": "Chill Song",
            "artist": "Artist C",
            "audio_url": "https://example.com/song3.mp3",
            "duration": 220000,
        },
    ]

    return {
        "tracks": tracks[: payload.limit],
        "rationale": f"Mock recommendations for emotion={payload.emotion_state.get('label', 'neutral')}",
    }