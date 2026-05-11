from datetime import datetime
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.payment_order import PaymentOrder
from app.models.user import User
from app.schemas.payment_order import PaymentOrderCreate, PaymentOrderOut


router = APIRouter()

ADMIN_EMAIL = "admin@gmail.com"
VIP_PRICE = 1000
QR_BASE_URL = "https://img.vietqr.io/image/momo-0983947901-qr_only.png"


def build_qr_url(email: str, amount: int) -> str:
    return f"{QR_BASE_URL}?amount={amount}&addInfo={quote(email)}"


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.email != ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập trang quản lý đơn hàng.",
        )
    return current_user


@router.post("", response_model=PaymentOrderOut)
def create_payment_order(
    payload: PaymentOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    amount = payload.amount or VIP_PRICE
    qr_url = build_qr_url(current_user.email, amount)

    # Nếu user đã có đơn đang chờ, cập nhật lại QR/giá thay vì tạo trùng nhiều đơn pending
    existing_order = (
        db.query(PaymentOrder)
        .filter(
            PaymentOrder.user_id == current_user.id,
            PaymentOrder.status == "pending",
        )
        .order_by(PaymentOrder.created_at.desc())
        .first()
    )

    if existing_order:
        existing_order.order_code = current_user.email
        existing_order.user_email = current_user.email
        existing_order.amount = amount
        existing_order.package_name = payload.package_name
        existing_order.qr_url = qr_url
        db.commit()
        db.refresh(existing_order)
        return existing_order

    order = PaymentOrder(
        order_code=current_user.email,
        user_id=current_user.id,
        user_email=current_user.email,
        package_name=payload.package_name,
        amount=amount,
        qr_url=qr_url,
        status="pending",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


@router.get("/me", response_model=list[PaymentOrderOut])
def list_my_payment_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(PaymentOrder)
        .filter(PaymentOrder.user_id == current_user.id)
        .order_by(PaymentOrder.created_at.desc())
        .all()
    )


@router.get("/admin", response_model=list[PaymentOrderOut])
def list_payment_orders_for_admin(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(PaymentOrder)

    if search:
        keyword = f"%{search.strip()}%"
        query = query.filter(
            or_(
                PaymentOrder.order_code.ilike(keyword),
                PaymentOrder.user_email.ilike(keyword),
            )
        )

    return query.order_by(PaymentOrder.created_at.desc()).all()


@router.patch("/admin/{order_id}/approve", response_model=PaymentOrderOut)
def approve_payment_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = db.query(PaymentOrder).filter(PaymentOrder.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")

    order.status = "approved"
    order.approved_at = datetime.utcnow()

    user = db.query(User).filter(User.id == order.user_id).first()
    if user:
        user.is_vip = True

    db.commit()
    db.refresh(order)

    return order