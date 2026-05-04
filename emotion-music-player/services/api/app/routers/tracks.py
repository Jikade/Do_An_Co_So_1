from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.track import Track
from app.schemas.track import TrackOut
from app.services.music_enrichment import EMOTION_LABELS_VI

router = APIRouter()


def to_track_out(track: Track) -> TrackOut:
    return TrackOut(
        id=track.id,
        title=track.title,
        artist=track.artist,
        audio_url=track.audio_url,
        duration=track.duration,
        emotion=track.emotion,
        emotion_label_vi=EMOTION_LABELS_VI.get(track.emotion, track.emotion),
        cover_image=track.cover_image,
        emotion_scores=track.emotion_scores,
    )


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