from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HistoryCreate(BaseModel):
    track_id: int
    listen_ms: float = Field(default=0, ge=0)
    emotion_state_at_time: dict | None = None


class HistoryTrackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    artist: str
    audio_url: str
    duration: float = 0
    emotion: str | None = None
    mood: str | None = None
    cover_image: str | None = None
    lyrics: str | None = None
    emotion_scores: dict | None = None


class ListeningHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    track_id: int
    action: str
    listen_ms: float = 0
    emotion_state_at_time: dict | None = None
    created_at: datetime
    track: HistoryTrackOut