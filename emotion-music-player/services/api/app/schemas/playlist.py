from pydantic import BaseModel, ConfigDict

from app.schemas.track import TrackOut


class PlaylistCreate(BaseModel):
    name: str


class PlaylistOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str


class PlaylistTrackAdd(BaseModel):
    track_id: int


class PlaylistDetail(BaseModel):
    id: int
    user_id: int
    name: str
    tracks: list[TrackOut]