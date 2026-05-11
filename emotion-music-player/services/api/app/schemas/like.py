from pydantic import BaseModel
from app.schemas.track import TrackOut


class LikeStateOut(BaseModel):
    track_id: int
    liked: bool


class LikeToggleOut(BaseModel):
    track_id: int
    liked: bool
    interaction_id: int | None = None


class LikeListOut(BaseModel):
    track_ids: list[int]
    tracks: list[TrackOut]