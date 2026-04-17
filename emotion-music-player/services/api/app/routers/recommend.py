<<<<<<< HEAD
from fastapi import APIRouter
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommend import RecommendationRequest, RecommendationResponse
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
from app.services.rec_service import get_recommendations

router = APIRouter()

<<<<<<< HEAD
@router.post("/")
def recommend(user_id: int, emotion: dict):

    tracks = get_recommendations(user_id, emotion)

    return tracks
=======

@router.post("/", response_model=RecommendationResponse)
def recommend(
    payload: RecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = db
    result = get_recommendations(
        user_id=current_user.id,
        emotion_state=payload.emotion_state,
        limit=payload.limit,
    )
    return RecommendationResponse(**result)
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
