from pydantic import BaseModel, ConfigDict


class TrackCreate(BaseModel):
    title: str
    artist: str

    # Khi tạo bằng form upload file thì router không dùng audio_url trực tiếp,
    # nhưng vẫn để optional để schema không bị thiếu nếu chỗ khác cần dùng.
    audio_url: str | None = None
    duration: float = 0

    # Project dùng emotion trong DB, frontend có thể gọi là mood.
    emotion: str | None = None
    emotion_label_vi: str | None = None
    mood: str | None = None

    cover_image: str | None = None
    lyrics: str | None = None

    emotion_scores: dict[str, float] | None = None


class TrackUpdate(BaseModel):
    # Cho phép update từng field riêng lẻ.
    title: str | None = None
    artist: str | None = None

    audio_url: str | None = None
    duration: float | None = None

    # emotion là field thật trong DB.
    emotion: str | None = None

    # emotion_label_vi chỉ là field response, không lưu DB.
    emotion_label_vi: str | None = None

    # mood là alias frontend, router sẽ map mood -> emotion.
    mood: str | None = None

    cover_image: str | None = None
    lyrics: str | None = None

    emotion_scores: dict[str, float] | None = None


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

    # Raw lyric text, nullable
    lyrics: str | None = None

    emotion_scores: dict[str, float] | None = None