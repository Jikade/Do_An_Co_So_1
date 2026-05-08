import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.track import Track
from app.schemas.track import TrackOut, TrackUpdate
from app.services.music_enrichment import EMOTION_LABELS_VI


try:
    from mutagen.mp3 import MP3
except Exception:
    MP3 = None


router = APIRouter()

# File này nằm ở:
# emotion-music-player/services/api/app/routers/tracks.py
# parents[4] -> emotion-music-player
BASE_DIR = Path("/app")
MP3_DIR = BASE_DIR / "data" / "mp3"
IMAGES_DIR = BASE_DIR / "data" / "images"

MP3_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

AUDIO_EXTENSIONS = {".mp3"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def normalize_lyrics(value: str | None) -> str | None:
    """
    Chuẩn hoá lyrics trước khi lưu DB.

    - Không gửi lyrics => None
    - Gửi chuỗi rỗng hoặc toàn khoảng trắng => None
    - Có nội dung thật => giữ nguyên nội dung sau khi strip 2 đầu
    """
    if value is None:
        return None

    stripped = value.strip()
    return stripped or None


def normalize_text(value: str | None) -> str | None:
    """
    Chuẩn hoá text thường như title, artist, mood.
    Không biến chuỗi rỗng thành None ở mọi nơi, chỉ dùng khi cần.
    """
    if value is None:
        return None

    return value.strip()


def to_track_out(track: Track) -> TrackOut:
    emotion = track.emotion or "relax"

    return TrackOut(
        id=track.id,
        title=track.title,
        artist=track.artist,
        audio_url=track.audio_url,
        duration=track.duration or 0,
        emotion=emotion,
        mood=emotion,
        emotion_label_vi=EMOTION_LABELS_VI.get(emotion, emotion),
        cover_image=track.cover_image,
        lyrics=track.lyrics,
        emotion_scores=track.emotion_scores or {},
    )


def save_upload_file(
    upload_file: UploadFile,
    target_dir: Path,
    allowed_extensions: set[str],
) -> str:
    original_name = upload_file.filename or ""
    extension = Path(original_name).suffix.lower()

    if extension not in allowed_extensions:
        allowed = ", ".join(sorted(allowed_extensions))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File không hợp lệ. Chỉ chấp nhận: {allowed}",
        )

    safe_name = f"{uuid4().hex}{extension}"
    file_path = target_dir / safe_name

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return safe_name


def delete_file_by_url(url: str | None) -> None:
    if not url:
        return

    try:
        filename = Path(url).name

        if url.startswith("/media/"):
            path = MP3_DIR / filename
        elif url.startswith("/images/"):
            path = IMAGES_DIR / filename
        else:
            return

        if path.exists() and path.is_file():
            path.unlink()
    except Exception:
        # Không chặn thao tác DB nếu xoá file vật lý lỗi
        pass


def get_mp3_duration(file_path: Path) -> float:
    if MP3 is None:
        return 0

    try:
        audio = MP3(str(file_path))
        return float(audio.info.length or 0)
    except Exception:
        return 0


@router.get("/", response_model=list[TrackOut])
def list_tracks(db: Session = Depends(get_db)):
    tracks = db.query(Track).order_by(Track.id.asc()).all()
    return [to_track_out(track) for track in tracks]


@router.get("/{track_id}", response_model=TrackOut)
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).filter(Track.id == track_id).first()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    return to_track_out(track)


@router.post("/", response_model=TrackOut, status_code=status.HTTP_201_CREATED)
def create_track(
    title: str = Form(...),
    artist: str = Form(...),
    mood: str = Form("relax"),
    lyrics: str | None = Form(None),
    file_mp3: UploadFile = File(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    mp3_filename = save_upload_file(file_mp3, MP3_DIR, AUDIO_EXTENSIONS)
    image_filename = save_upload_file(image, IMAGES_DIR, IMAGE_EXTENSIONS)

    mp3_path = MP3_DIR / mp3_filename

    clean_title = title.strip()
    clean_artist = artist.strip()
    clean_mood = mood.strip() or "relax"

    if not clean_title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên bài hát không được để trống",
        )

    if not clean_artist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên ca sĩ không được để trống",
        )

    track = Track(
        title=clean_title,
        artist=clean_artist,
        audio_url=f"/media/{mp3_filename}",
        duration=get_mp3_duration(mp3_path),
        emotion=clean_mood,
        cover_image=f"/images/{image_filename}",
        lyrics=normalize_lyrics(lyrics),
        emotion_scores={},
    )

    db.add(track)
    db.commit()
    db.refresh(track)

    return to_track_out(track)


@router.put("/{track_id}", response_model=TrackOut)
def update_track(
    track_id: int,
    payload: TrackUpdate,
    db: Session = Depends(get_db),
):
    track = db.query(Track).filter(Track.id == track_id).first()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    update_data = payload.model_dump(exclude_unset=True)

    # lyrics rỗng thì lưu NULL
    if "lyrics" in update_data:
        update_data["lyrics"] = normalize_lyrics(update_data["lyrics"])

    # frontend có thể gửi mood, nhưng DB đang dùng emotion
    if "mood" in update_data:
        mood_value = normalize_text(update_data.pop("mood"))
        update_data["emotion"] = mood_value or "relax"

    # Không lưu emotion_label_vi vì đây là field response, không phải cột DB
    update_data.pop("emotion_label_vi", None)

    # Chuẩn hoá title/artist nếu có gửi lên
    if "title" in update_data and update_data["title"] is not None:
        update_data["title"] = update_data["title"].strip()

        if not update_data["title"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên bài hát không được để trống",
            )

    if "artist" in update_data and update_data["artist"] is not None:
        update_data["artist"] = update_data["artist"].strip()

        if not update_data["artist"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên ca sĩ không được để trống",
            )

    if "emotion" in update_data and update_data["emotion"] is not None:
        update_data["emotion"] = update_data["emotion"].strip() or "relax"

    allowed_fields = {
        "title",
        "artist",
        "audio_url",
        "duration",
        "emotion",
        "cover_image",
        "lyrics",
        "emotion_scores",
    }

    for key, value in update_data.items():
        if key in allowed_fields:
            setattr(track, key, value)

    db.commit()
    db.refresh(track)

    return to_track_out(track)


@router.delete("/{track_id}")
def delete_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).filter(Track.id == track_id).first()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    delete_file_by_url(track.audio_url)
    delete_file_by_url(track.cover_image)

    db.delete(track)
    db.commit()

    return {"message": "Deleted track successfully", "id": track_id}