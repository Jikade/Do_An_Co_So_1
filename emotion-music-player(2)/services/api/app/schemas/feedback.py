from pydantic import BaseModel, Field


class FeedbackRequest(BaseModel):
    user_id: int
    track_id: int
    action: str = Field(..., pattern="^(like|skip|listen)$")
    listen_ms: float = 0
    emotion_state_at_time: dict | None = None


class FeedbackResponse(BaseModel):
    status: str
    interaction_id: int