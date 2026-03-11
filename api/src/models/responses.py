from pydantic import BaseModel
from enum import Enum

from .carrier import CarrierHistoryItem


class HealthStatus(str, Enum):
    ok = "ok"


class Health(BaseModel):
    status: HealthStatus
    uptime: float


class Upload(BaseModel):
    total: int
    unchanged: int
    updated: int
    new: int


class Pagination(BaseModel):
    total: int
    current_page: int
    page_size: int


class CarriersResponse(BaseModel):
    data: list[CarrierHistoryItem]
    pagination: Pagination
