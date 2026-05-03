from pydantic import BaseModel, ConfigDict


class TrackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    artist: str
    audio_url: str
    duration: float

    emotion: str | None = None
    emotion_label_vi: str | None = None
    cover_image: str | None = None
    emotion_scores: dict[str, float] | None = None