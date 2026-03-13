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