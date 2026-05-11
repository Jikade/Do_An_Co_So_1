from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    auth_provider: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="email",
        server_default="email",
        index=True,
    )
    google_sub: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True,
    )
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    role: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="user",
        server_default="user",
        index=True,
    )
    is_vip: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    emotion_events = relationship(
        "EmotionEvent",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    interactions = relationship(
        "Interaction",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    playlists = relationship(
        "Playlist",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    payment_orders = relationship(
        "PaymentOrder",
        back_populates="user",
        cascade="all, delete-orphan",
    )