from pydantic import BaseModel, ConfigDict


class TrackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    artist: str

    # URL file mp3
    audio_url: str

    duration: float = 0

    # field cũ của project
    emotion: str | None = None
    emotion_label_vi: str | None = None

    # field mới cho đúng yêu cầu CRUD bài hát
    mood: str | None = None

    # URL ảnh cover
    cover_image: str | None = None

    emotion_scores: dict[str, float] | None = None