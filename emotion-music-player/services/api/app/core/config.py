from pydantic import BaseSettings

class Settings(BaseSettings):

    DATABASE_URL: str
    JWT_SECRET: str = "secret"
    JWT_ALGORITHM: str = "HS256"

settings = Settings()