from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import emotion_event, interaction, playlist, track, user
from app.routers import (
    auth,
    emotion,
    feedback,
    lyrics_mood,
    likes,
    playlists,
    recommend,
    tracks,
    users,
    history,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Emotion Music Player API",
    version="1.0.0",
    description="Backend service for emotion-aware music recommendation",
)

BASE_DIR = Path("/app")
MP3_DIR = BASE_DIR / "data" / "mp3"
IMAGES_DIR = BASE_DIR / "data" / "images"
MP3_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/media", StaticFiles(directory=str(MP3_DIR)), name="media")
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth/User APIs
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])

# Music APIs
app.include_router(tracks.router, prefix="/tracks", tags=["tracks"])
app.include_router(history.router, prefix="/history", tags=["history"])
app.include_router(likes.router, prefix="/likes", tags=["likes"])
app.include_router(playlists.router, prefix="/playlists", tags=["playlists"])

# Emotion APIs
# Route chuẩn hiện tại.
app.include_router(emotion.router, prefix="/emotion", tags=["emotion"])

# Route alias để giữ tương thích với frontend cũ đang gọi /api/emotion/detect.
app.include_router(emotion.router, prefix="/api/emotion", tags=["emotion"])

# Recommendation/feedback APIs
app.include_router(recommend.router, prefix="/recommend", tags=["recommend"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(lyrics_mood.router, prefix="/lyrics-mood", tags=["lyrics-mood"])


@app.get("/")
def root():
    return {
        "service": "emotion-music-player-api",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}