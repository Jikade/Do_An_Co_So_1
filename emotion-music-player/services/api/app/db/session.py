<<<<<<< HEAD
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:postgres@db:5432/emotion_music"

engine = create_engine(DATABASE_URL)
=======
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
<<<<<<< HEAD
    bind=engine
)
=======
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
