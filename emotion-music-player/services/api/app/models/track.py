<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Float
from app.db.base import Base

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    artist = Column(String)
    audio_url = Column(String)
    duration = Column(Float)
=======
from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[str] = mapped_column(String(255), nullable=False)
    audio_url: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[float] = mapped_column(Float, default=0)

    interactions = relationship("Interaction", back_populates="track", cascade="all, delete-orphan")
    playlist_items = relationship("PlaylistTrack", back_populates="track", cascade="all, delete-orphan")
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
