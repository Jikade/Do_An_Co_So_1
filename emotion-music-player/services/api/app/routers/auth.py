from fastapi import APIRouter
from app.schemas.user import UserCreate
from app.core.security import create_access_token

router = APIRouter()

@router.post("/login")
def login():

    token = create_access_token({"user": 1})

    return {
        "access_token": token
    }