<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from app.db.base import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(Integer, ForeignKey("tracks.id"))

    action = Column(String)   # like / skip
    listen_ms = Column(Float)
=======
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), nullable=False)

    action: Mapped[str] = mapped_column(String(50), nullable=False)
    listen_ms: Mapped[float] = mapped_column(Float, default=0)
    emotion_state_at_time: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="interactions")
    track = relationship("Track", back_populates="interactions")
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
