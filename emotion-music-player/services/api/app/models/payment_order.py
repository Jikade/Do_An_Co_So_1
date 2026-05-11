from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Theo yêu cầu: mã đơn hàng chính là email user
    order_code: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    package_name: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        default="VIP PRO",
        server_default="VIP PRO",
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=1000)

    qr_url: Mapped[str] = mapped_column(Text, nullable=False)

    # pending = chờ xử lý, approved = đã duyệt, rejected = từ chối
    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="payment_orders")