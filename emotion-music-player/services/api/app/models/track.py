from sqlalchemy import Column, Integer, String, Float
from app.db.base import Base

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    artist = Column(String)
    audio_url = Column(String)
    duration = Column(Float)