from fastapi import APIRouter, HTTPException, status

from app.schemas.lyrics_mood import LyricsMoodRequest, LyricsMoodResponse
from app.services.lyrics_mood_service import analyze_lyrics_mood


router = APIRouter()


@router.post("/analyze", response_model=LyricsMoodResponse)
def analyze(payload: LyricsMoodRequest) -> LyricsMoodResponse:
    try:
        return analyze_lyrics_mood(
            lyrics=payload.lyrics,
            language=payload.language,
            top_k=payload.top_k,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc