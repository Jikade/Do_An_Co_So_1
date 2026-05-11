from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.interaction import Interaction
from app.models.track import Track
from app.models.user import User
from app.schemas.history import HistoryCreate, HistoryTrackOut, ListeningHistoryOut

router = APIRouter()


def to_track_out(track: Track) -> HistoryTrackOut:
    emotion = track.emotion or "relax"

    return HistoryTrackOut(
        id=track.id,
        title=track.title,
        artist=track.artist,
        audio_url=track.audio_url,
        duration=track.duration or 0,
        emotion=emotion,
        mood=emotion,
        cover_image=track.cover_image,
        lyrics=track.lyrics,
        emotion_scores=track.emotion_scores or {},
    )


def to_history_out(item: Interaction) -> ListeningHistoryOut:
    return ListeningHistoryOut(
        id=item.id,
        user_id=item.user_id,
        track_id=item.track_id,
        action=item.action,
        listen_ms=item.listen_ms or 0,
        emotion_state_at_time=item.emotion_state_at_time,
        created_at=item.created_at,
        track=to_track_out(item.track),
    )


@router.get("/", response_model=list[ListeningHistoryOut])
def list_my_history(
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(Interaction)
        .options(joinedload(Interaction.track))
        .filter(
            Interaction.user_id == current_user.id,
            Interaction.action == "played",
        )
        .order_by(Interaction.created_at.desc(), Interaction.id.desc())
        .limit(limit)
        .all()
    )

    return [to_history_out(item) for item in items]


@router.post(
    "/",
    response_model=ListeningHistoryOut,
    status_code=status.HTTP_201_CREATED,
)
def create_history_item(
    payload: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    track = db.query(Track).filter(Track.id == payload.track_id).first()

    if track is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found",
        )

    item = Interaction(
        user_id=current_user.id,
        track_id=track.id,
        action="played",
        listen_ms=payload.listen_ms,
        emotion_state_at_time=payload.emotion_state_at_time,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    item.track = track
    return to_history_out(item)


@router.delete("/")
def clear_my_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted_count = (
        db.query(Interaction)
        .filter(
            Interaction.user_id == current_user.id,
            Interaction.action == "played",
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return {
        "message": "Cleared listening history successfully",
        "deleted": deleted_count,
    }


@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(Interaction)
        .filter(
            Interaction.id == history_id,
            Interaction.user_id == current_user.id,
            Interaction.action == "played",
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Deleted history item successfully",
        "id": history_id,
    }