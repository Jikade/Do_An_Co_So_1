import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.track import Track
from app.schemas.track import TrackOut
from app.services.music_enrichment import EMOTION_LABELS_VI

try:
    from mutagen.mp3 import MP3
except Exception:
    MP3 = None


router = APIRouter()

# File này nằm ở:
# emotion-music-player/services/api/app/routers/tracks.py
# parents[4] -> emotion-music-player
BASE_DIR = Path(__file__).resolve().parents[4]
MP3_DIR = BASE_DIR / "data" / "mp3"
IMAGES_DIR = BASE_DIR / "data" / "images"

MP3_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

AUDIO_EXTENSIONS = {".mp3"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def to_track_out(track: Track) -> TrackOut:
    return TrackOut(
        id=track.id,
        title=track.title,
        artist=track.artist,
        audio_url=track.audio_url,
        duration=track.duration or 0,
        emotion=track.emotion,
        mood=track.emotion,
        emotion_label_vi=EMOTION_LABELS_VI.get(track.emotion, track.emotion),
        cover_image=track.cover_image,
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
    file_mp3: UploadFile = File(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    mp3_filename = save_upload_file(file_mp3, MP3_DIR, AUDIO_EXTENSIONS)
    image_filename = save_upload_file(image, IMAGES_DIR, IMAGE_EXTENSIONS)

    mp3_path = MP3_DIR / mp3_filename

    track = Track(
        title=title.strip(),
        artist=artist.strip(),
        audio_url=f"/media/{mp3_filename}",
        duration=get_mp3_duration(mp3_path),
        emotion=mood.strip() or "relax",
        cover_image=f"/images/{image_filename}",
        emotion_scores={},
    )

    db.add(track)
    db.commit()
    db.refresh(track)

    return to_track_out(track)


@router.put("/{track_id}", response_model=TrackOut)
def update_track(
    track_id: int,
    title: str | None = Form(None),
    artist: str | None = Form(None),
    mood: str | None = Form(None),
    file_mp3: UploadFile | None = File(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    track = db.query(Track).filter(Track.id == track_id).first()

    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    if title is not None:
        track.title = title.strip()

    if artist is not None:
        track.artist = artist.strip()

    if mood is not None:
        track.emotion = mood.strip() or "relax"

    if file_mp3 is not None and file_mp3.filename:
        old_audio_url = track.audio_url

        mp3_filename = save_upload_file(file_mp3, MP3_DIR, AUDIO_EXTENSIONS)
        mp3_path = MP3_DIR / mp3_filename

        track.audio_url = f"/media/{mp3_filename}"
        track.duration = get_mp3_duration(mp3_path)

        delete_file_by_url(old_audio_url)

    if image is not None and image.filename:
        old_cover_image = track.cover_image

        image_filename = save_upload_file(image, IMAGES_DIR, IMAGE_EXTENSIONS)
        track.cover_image = f"/images/{image_filename}"

        delete_file_by_url(old_cover_image)

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