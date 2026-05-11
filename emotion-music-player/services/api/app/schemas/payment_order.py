from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


PaymentOrderStatus = Literal["pending", "approved", "rejected"]


class PaymentOrderCreate(BaseModel):
    amount: int = Field(default=1000, gt=0)
    package_name: str = "VIP PRO"


class PaymentOrderOut(BaseModel):
    id: int
    order_code: str
    user_id: int
    user_email: str
    package_name: str
    amount: int
    qr_url: str
    status: PaymentOrderStatus
    created_at: datetime
    updated_at: datetime
    approved_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)