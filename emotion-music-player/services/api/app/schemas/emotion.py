<<<<<<< HEAD
from pydantic import BaseModel
from typing import Optional

class EmotionRequest(BaseModel):

    face_frame: Optional[str]
    voice_clip: Optional[str]
    text: Optional[str]


class EmotionResponse(BaseModel):

    label: str
    valence: float
    arousal: float
    confidence: float
=======
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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
