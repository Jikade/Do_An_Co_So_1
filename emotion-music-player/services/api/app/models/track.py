from sqlalchemy import Float, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[str] = mapped_column(String(255), nullable=False)
    audio_url: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[float] = mapped_column(Float, default=0)

    emotion: Mapped[str] = mapped_column(String(20), nullable=False, default="relax")
    cover_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    emotion_scores: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    interactions = relationship("Interaction", back_populates="track", cascade="all, delete-orphan")
    playlist_items = relationship("PlaylistTrack", back_populates="track", cascade="all, delete-orphan")