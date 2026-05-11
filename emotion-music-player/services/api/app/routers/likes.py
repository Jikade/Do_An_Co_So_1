from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.interaction import Interaction
from app.models.track import Track
from app.models.user import User
from app.routers.tracks import to_track_out
from app.schemas.like import LikeListOut, LikeStateOut, LikeToggleOut

router = APIRouter()


def get_track_or_404(track_id: int, db: Session) -> Track:
    track = db.query(Track).filter(Track.id == track_id).first()
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")
    return track


def find_like(db: Session, user_id: int, track_id: int) -> Interaction | None:
    return (
        db.query(Interaction)
        .filter(
            Interaction.user_id == user_id,
            Interaction.track_id == track_id,
            Interaction.action == "like",
        )
        .order_by(desc(Interaction.created_at))
        .first()
    )


@router.get("", response_model=LikeListOut)
def list_likes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(Interaction)
        .options(joinedload(Interaction.track))
        .filter(
            Interaction.user_id == current_user.id,
            Interaction.action == "like",
        )
        .order_by(desc(Interaction.created_at))
        .all()
    )

    seen: set[int] = set()
    tracks = []

    for row in rows:
        if row.track_id in seen or row.track is None:
            continue

        seen.add(row.track_id)
        tracks.append(to_track_out(row.track))

    return LikeListOut(
        track_ids=[track.id for track in tracks],
        tracks=tracks,
    )


@router.get("/{track_id}", response_model=LikeStateOut)
def get_like_state(
    track_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_track_or_404(track_id, db)

    return LikeStateOut(
        track_id=track_id,
        liked=find_like(db, current_user.id, track_id) is not None,
    )


@router.post(
    "/{track_id}",
    response_model=LikeToggleOut,
    status_code=status.HTTP_201_CREATED,
)
def like_track(
    track_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_track_or_404(track_id, db)

    existing_like = find_like(db, current_user.id, track_id)
    if existing_like is not None:
        return LikeToggleOut(
            track_id=track_id,
            liked=True,
            interaction_id=existing_like.id,
        )

    interaction = Interaction(
        user_id=current_user.id,
        track_id=track_id,
        action="like",
        listen_ms=0,
        emotion_state_at_time={"source": "bottom_player"},
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return LikeToggleOut(
        track_id=track_id,
        liked=True,
        interaction_id=interaction.id,
    )


@router.delete("/{track_id}", response_model=LikeToggleOut)
def unlike_track(
    track_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_track_or_404(track_id, db)

    (
        db.query(Interaction)
        .filter(
            Interaction.user_id == current_user.id,
            Interaction.track_id == track_id,
            Interaction.action == "like",
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return LikeToggleOut(
        track_id=track_id,
        liked=False,
        interaction_id=None,
    )