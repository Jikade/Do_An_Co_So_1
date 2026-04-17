<<<<<<< HEAD
from fastapi import APIRouter
from app.schemas.emotion import EmotionRequest
=======
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.emotion_event import EmotionEvent
from app.models.user import User
from app.schemas.emotion import EmotionEventOut, EmotionRequest, EmotionResponse
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
from app.services.ml_gateway import predict_emotion

router = APIRouter()

<<<<<<< HEAD
@router.post("/predict")
def predict(req: EmotionRequest):

    result = predict_emotion(req.dict())

    return result
=======

@router.post("/predict", response_model=EmotionResponse)
def predict(
    payload: EmotionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.face_frame and not payload.voice_clip and not payload.text:
        raise HTTPException(status_code=400, detail="At least one modality is required")

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
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
