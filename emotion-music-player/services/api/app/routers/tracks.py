from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.track import Track
from app.models.user import User
from app.schemas.track import TrackOut

router = APIRouter()


@router.get("/", response_model=list[TrackOut])
def list_tracks(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Track).order_by(Track.id.asc()).all()


@router.get("/{track_id}", response_model=TrackOut)
def get_track(
    track_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return track