from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.base import Base
from app.db.session import engine
from app.models import user, track, emotion_event, interaction, playlist
from app.routers import (
    auth,
    users,
    emotion,
    recommend,
    feedback,
    tracks,
    playlists,
    lyrics_mood,
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

print("BASE_DIR =", BASE_DIR)
print("MP3_DIR =", MP3_DIR)
print("IMAGES_DIR =", IMAGES_DIR)

app.mount("/media", StaticFiles(directory=str(MP3_DIR)), name="media")
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tracks.router, prefix="/tracks", tags=["tracks"])
app.include_router(playlists.router, prefix="/playlists", tags=["playlists"])
app.include_router(emotion.router, prefix="/emotion", tags=["emotion"])
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