from typing import Literal
from pydantic import BaseModel


class FeedbackRequest(BaseModel):
    track_id: int
    action: Literal["like", "skip", "listen", "played"] = "listen"
    listen_ms: float = 0
    emotion_state_at_time: dict | None = None


class FeedbackResponse(BaseModel):
    status: str
    interaction_id: int