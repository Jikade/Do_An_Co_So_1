from typing import Literal

from pydantic import BaseModel, Field, field_validator


LanguageCode = Literal["auto", "en", "vi"]


class LyricsMoodRequest(BaseModel):
    lyrics: str = Field(..., min_length=10, max_length=20000)
    language: LanguageCode = "en"
    top_k: int = Field(default=3, ge=1, le=6)

    @field_validator("lyrics")
    @classmethod
    def validate_lyrics(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Lyrics không được để trống")
        return cleaned


class LyricsMoodResult(BaseModel):
    mood: str
    confidence: int = Field(..., ge=0, le=100)
    matched_keywords: list[str] = Field(default_factory=list)
    sentiment: float = Field(..., ge=-1, le=1)


class LyricsMoodResponse(BaseModel):
    moods: list[LyricsMoodResult]
    language: LanguageCode
    algorithm: str = "vader-lexicon-v1"