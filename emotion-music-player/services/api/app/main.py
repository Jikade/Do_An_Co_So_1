from fastapi import FastAPI

from app.routers import auth
from app.routers import emotion
from app.routers import recommend
from app.routers import feedback

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(emotion.router, prefix="/emotion")
app.include_router(recommend.router, prefix="/recommend")
app.include_router(feedback.router, prefix="/feedback")