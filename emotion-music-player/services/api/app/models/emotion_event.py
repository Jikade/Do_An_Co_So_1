from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class EmotionEvent(Base):
    __tablename__ = "emotion_events"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    label = Column(String)
    valence = Column(Float)
    arousal = Column(Float)
    confidence = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())