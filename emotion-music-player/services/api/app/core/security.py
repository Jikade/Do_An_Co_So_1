from datetime import datetime, timedelta
from jose import jwt

SECRET = "secret"

def create_access_token(data: dict):

    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=12)

    return jwt.encode(payload, SECRET, algorithm="HS256")