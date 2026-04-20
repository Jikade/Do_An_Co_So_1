from sqlalchemy import Column, Integer, String, ForeignKey, Float
from app.db.base import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(Integer, ForeignKey("tracks.id"))

    action = Column(String)   # like / skip
    listen_ms = Column(Float)