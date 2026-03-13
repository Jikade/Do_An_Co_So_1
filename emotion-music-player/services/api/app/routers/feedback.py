from fastapi import APIRouter
from app.db.session import SessionLocal
from app.models.interaction import Interaction

router = APIRouter()

@router.post("/")
def feedback(data: dict):

    db = SessionLocal()

    interaction = Interaction(
        user_id=data["user_id"],
        track_id=data["track_id"],
        action=data["action"],
        listen_ms=data["listen_ms"]
    )

    db.add(interaction)
    db.commit()

    return {"status": "ok"}