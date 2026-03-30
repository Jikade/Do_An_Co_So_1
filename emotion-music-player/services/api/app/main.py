from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.base import Base
from app.db.session import engine
from app.models import user, track, emotion_event, interaction, playlist
from app.routers import auth, users, emotion, recommend, feedback, tracks, playlists

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Emotion Music Player API",
    version="1.0.0",
    description="Backend service for emotion-aware music recommendation",
)

app.mount("/media", StaticFiles(directory="/data/mp3"), name="media")

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


@app.get("/")
def root():
    return {"service": "emotion-music-player-api", "status": "ok", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}