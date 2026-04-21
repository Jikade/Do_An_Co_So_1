from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommend import RecommendationRequest, RecommendationResponse
from app.services.rec_service import get_recommendations

router = APIRouter()


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