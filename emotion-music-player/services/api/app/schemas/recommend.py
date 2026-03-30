from pydantic import BaseModel

from app.schemas.track import TrackOut


class RecommendationRequest(BaseModel):
    user_id: int
    emotion_state: dict
    limit: int = 10


class RecommendationResponse(BaseModel):
    tracks: list[TrackOut]
    rationale: str | None = None