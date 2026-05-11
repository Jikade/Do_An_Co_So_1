from pydantic import BaseModel, Field
from app.schemas.track import TrackOut


class RecommendationRequest(BaseModel):
    emotion_state: dict | None = None
    limit: int = Field(default=12, ge=1, le=50)


class RecommendationResponse(BaseModel):
    tracks: list[TrackOut]
    rationale: str | None = None