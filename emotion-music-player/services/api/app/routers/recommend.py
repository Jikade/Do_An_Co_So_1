from fastapi import APIRouter
from app.services.rec_service import get_recommendations

router = APIRouter()

@router.post("/")
def recommend(user_id: int, emotion: dict):

    tracks = get_recommendations(user_id, emotion)

    return tracks