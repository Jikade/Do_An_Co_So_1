from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.interaction import Interaction
from app.models.track import Track
from app.models.user import User
from app.schemas.feedback import FeedbackRequest, FeedbackResponse

router = APIRouter()


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def feedback(
    payload: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    track = db.query(Track).filter(Track.id == payload.track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    interaction = Interaction(
        user_id=current_user.id,
        track_id=payload.track_id,
        action=payload.action,
        listen_ms=payload.listen_ms,
        emotion_state_at_time=payload.emotion_state_at_time,
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return FeedbackResponse(status="ok", interaction_id=interaction.id)