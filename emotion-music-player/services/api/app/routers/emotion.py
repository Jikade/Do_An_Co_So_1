from fastapi import APIRouter
from app.schemas.emotion import EmotionRequest
from app.services.ml_gateway import predict_emotion

router = APIRouter()

@router.post("/predict")
def predict(req: EmotionRequest):

    result = predict_emotion(req.dict())

    return result