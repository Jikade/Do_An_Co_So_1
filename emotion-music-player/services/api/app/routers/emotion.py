from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.emotion_event import EmotionEvent
from app.models.user import User
from app.schemas.emotion import EmotionEventOut, EmotionRequest, EmotionResponse
from app.services.ml_gateway import predict_emotion

router = APIRouter()


def _predict_and_save_emotion(
    payload: EmotionRequest,
    db: Session,
    current_user: User,
) -> EmotionResponse:
    if not payload.face_frame and not payload.voice_clip and not payload.text:
        raise HTTPException(
            status_code=400,
            detail="At least one modality is required",
        )

    result = predict_emotion(payload.model_dump())

    event = EmotionEvent(
        user_id=current_user.id,
        label=result["label"],
        valence=result["valence"],
        arousal=result["arousal"],
        confidence=result["confidence"],
        source_text=payload.text,
        per_modality=result.get("per_modality"),
    )

    db.add(event)
    db.commit()

    return EmotionResponse(**result)


@router.post("/predict", response_model=EmotionResponse)
def predict(
    payload: EmotionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _predict_and_save_emotion(payload, db, current_user)


# Alias để giữ tương thích với frontend cũ đang gọi /api/emotion/detect
@router.post("/detect", response_model=EmotionResponse)
def detect(
    payload: EmotionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _predict_and_save_emotion(payload, db, current_user)


@router.get("/events/me", response_model=list[EmotionEventOut])
def my_emotion_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(EmotionEvent)
        .filter(EmotionEvent.user_id == current_user.id)
        .order_by(EmotionEvent.created_at.desc())
        .all()
    )