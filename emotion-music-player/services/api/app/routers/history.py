from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.interaction import Interaction
from app.models.track import Track
from app.models.user import User
from app.routers.tracks import to_track_out
from app.schemas.history import HistoryCreate, HistoryOut

router = APIRouter()


def to_history_out(row: Interaction) -> dict:
    return {
        "id": row.id,
        "user_id": row.user_id,
        "track_id": row.track_id,
        "action": row.action,
        "listen_ms": row.listen_ms or 0,
        "emotion_state_at_time": row.emotion_state_at_time,
        "created_at": row.created_at,
        "track": to_track_out(row.track),
    }


@router.get("", response_model=list[HistoryOut])
def list_history(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(Interaction)
        .options(joinedload(Interaction.track))
        .filter(Interaction.user_id == current_user.id)
        .order_by(desc(Interaction.created_at))
        .limit(limit)
        .all()
    )

    return [to_history_out(row) for row in rows if row.track is not None]


@router.post("", response_model=HistoryOut, status_code=status.HTTP_201_CREATED)
def create_history(
    payload: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    track = db.query(Track).filter(Track.id == payload.track_id).first()
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    row = Interaction(
        user_id=current_user.id,
        track_id=payload.track_id,
        action="listen",
        listen_ms=payload.listen_ms or 0,
        emotion_state_at_time=payload.emotion_state_at_time,
    )

    db.add(row)
    db.commit()
    db.refresh(row)
    row.track = track

    return to_history_out(row)


@router.delete("")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = (
        db.query(Interaction)
        .filter(Interaction.user_id == current_user.id)
        .delete(synchronize_session=False)
    )
    db.commit()

    return {"message": "Deleted listening history", "deleted": deleted}


@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = (
        db.query(Interaction)
        .filter(
            Interaction.id == history_id,
            Interaction.user_id == current_user.id,
        )
        .first()
    )

    if row is None:
        raise HTTPException(status_code=404, detail="History item not found")

    db.delete(row)
    db.commit()

    return {"message": "Deleted history item", "id": history_id}