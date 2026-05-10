from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.track import TrackOut

EmotionName = Literal["happy", "sad", "angry", "relaxed"]


class EmotionDetectRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=3000)
    limit: int = Field(default=10, ge=1, le=30)


class EmotionProbabilities(BaseModel):
    happy: float = Field(ge=0, le=1)
    sad: float = Field(ge=0, le=1)
    angry: float = Field(ge=0, le=1)
    relaxed: float = Field(ge=0, le=1)


class TrackRecommendation(TrackOut):
    recommendation_score: float = Field(ge=0, le=100)
    matched_mood: str | None = None


class EmotionDetectResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    emotion: EmotionName
    confidence: float = Field(ge=0, le=1)
    confidencePercent: int = Field(ge=0, le=100)
    probabilities: EmotionProbabilities
    recommendedSongs: list[TrackRecommendation]
    autoPlaySong: TrackRecommendation | None = None
    rationale: str | None = None
