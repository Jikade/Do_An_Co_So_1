from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommend import RecommendationRequest, RecommendationResponse
from app.services.rec_service import get_recommendations

router = APIRouter()

optional_bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    if not credentials:
        return None

    try:
        payload = decode_token(credentials.credentials)
        user_id = int(payload["sub"])
    except Exception:
        return None

    return db.query(User).filter(User.id == user_id).first()


@router.post("", response_model=RecommendationResponse)
@router.post("/", response_model=RecommendationResponse)
def recommend(
    payload: RecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    # Nếu có token hợp lệ: cá nhân hóa theo user đang đăng nhập.
    # Nếu không có token: vẫn trả gợi ý cold-start để trang /goiY không bị lỗi.
    user_id = current_user.id if current_user else payload.user_id or 0

    result = get_recommendations(
        db=db,
        user_id=user_id,
        emotion_state=payload.emotion_state or {},
        limit=payload.limit,
    )

    if current_user:
        rationale = result.get("rationale")
    else:
        rationale = (
            result.get("rationale")
            or "Đang hiển thị gợi ý theo mood hiện tại vì chưa xác thực được tài khoản."
        )

    return RecommendationResponse(
        tracks=result.get("tracks", []),
        rationale=rationale,
    )