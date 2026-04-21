from typing import Any

from pydantic import BaseModel, ConfigDict


class EmotionRequest(BaseModel):
    user_id: int | None = None
    face_frame: str | None = None
    voice_clip: str | None = None
    text: str | None = None


class EmotionResponse(BaseModel):
    label: str
    valence: float
    arousal: float
    confidence: float
    per_modality: dict[str, Any] | None = None


class EmotionEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    label: str
    valence: float
    arousal: float
    confidence: float
    source_text: str | None = None
    per_modality: dict[str, Any] | None = None