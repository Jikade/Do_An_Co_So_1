from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.track import TrackOut


class HistoryCreate(BaseModel):
    track_id: int
    listen_ms: float = 0
    emotion_state_at_time: dict | None = None


class HistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    track_id: int
    action: str
    listen_ms: float = 0
    emotion_state_at_time: dict | None = None
    created_at: datetime
    track: TrackOut