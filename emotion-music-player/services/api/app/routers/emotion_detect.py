from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.emotion_detection import EmotionDetectRequest, EmotionDetectResponse
from app.services.emotion_detection_service import detect_emotion_and_recommend

router = APIRouter()


@router.post("/detect", response_model=EmotionDetectResponse)
def detect_text_emotion(payload: EmotionDetectRequest, db: Session = Depends(get_db)):
    text = payload.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng nhập nội dung cần phân tích cảm xúc.",
        )

    return detect_emotion_and_recommend(text=text, limit=payload.limit, db=db)
