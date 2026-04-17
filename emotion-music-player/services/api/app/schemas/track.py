from pydantic import BaseModel, ConfigDict


class TrackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    artist: str
    audio_url: str
    duration: float