from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserOut(BaseModel):
    id: int
    email: str
    name: str