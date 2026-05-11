from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    GoogleLoginRequest,
    LogoutResponse,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserOut,
)

router = APIRouter()


def build_token_response(user: User) -> TokenResponse:
    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    )
    return TokenResponse(access_token=token, user=user)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email này đã được đăng ký.",
        )

    try:
        password_hash = hash_password(payload.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    user = User(
        email=payload.email,
        password_hash=password_hash,
        name=payload.name,
        auth_provider="email",
    )
    db.add(user)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email này đã được đăng ký.",
        ) from exc

    db.refresh(user)
    return build_token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng.",
        )

    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tài khoản này đang đăng nhập bằng Google. Vui lòng dùng nút Google.",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng.",
        )

    return build_token_response(user)


@router.post("/google", response_model=TokenResponse)
def login_with_google(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Backend chưa cấu hình GOOGLE_CLIENT_ID.",
        )

    try:
        google_user = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token không hợp lệ hoặc đã hết hạn.",
        ) from exc

    email = str(google_user.get("email", "")).strip().lower()
    email_verified = bool(google_user.get("email_verified"))
    google_sub = str(google_user.get("sub", "")).strip()
    name = str(google_user.get("name") or email.split("@")[0]).strip()
    avatar_url = google_user.get("picture")

    if not email or not google_sub:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google không trả về đủ email/sub để đăng nhập.",
        )

    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email Google chưa được xác minh.",
        )

    user = db.query(User).filter(User.google_sub == google_sub).first()

    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Liên kết Google vào tài khoản email/password đã tồn tại.
            user.google_sub = google_sub
            user.avatar_url = avatar_url
            user.auth_provider = "email_google" if user.password_hash else "google"
        else:
            user = User(
                email=email,
                name=name,
                password_hash=None,
                auth_provider="google",
                google_sub=google_sub,
                avatar_url=avatar_url,
            )
            db.add(user)
    else:
        user.email = email
        user.name = name or user.name
        user.avatar_url = avatar_url or user.avatar_url

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tài khoản Google này đã được liên kết với người dùng khác.",
        ) from exc

    db.refresh(user)
    return build_token_response(user)


@router.post("/logout", response_model=LogoutResponse)
def logout(_: User = Depends(get_current_user)):
    # JWT đang dùng stateless nên backend không cần xóa session.
    # Frontend sẽ xóa token khỏi localStorage.
    return LogoutResponse(message="Đăng xuất thành công.")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
