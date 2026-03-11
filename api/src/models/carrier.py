from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class SafetyRating(str, Enum):
    Satisfactory = "Satisfactory"
    Conditional = "Conditional"
    Unsatisfactory = "Unsatisfactory"


class AuthorityStatus(str, Enum):
    Active = "Active"
    Inactive = "Inactive"
    Revoked = "Revoked"


class Carrier(BaseModel):
    carrier_id: str
    dot_number: str
    legal_name: str
    safety_rating: SafetyRating
    out_of_service_pct: float = Field(ge=0.0, le=100.0)
    crash_total: int
    driver_oos_pct: float = Field(ge=0.0, le=100.0)
    insurance_on_file: bool
    authority_status: AuthorityStatus
    last_inspection_date: str
    fleet_size: Optional[int] = 1


class ScoreBreakdown(BaseModel):
    safety: float
    out_of_service: float
    crash: float
    driver_oos: float
    insurance: float
    authority_status: float


class ScoredCarrier(BaseModel):
    id: str
    hash: str
    score: float
    last_update: str
    legal_name: str
    score_breakdown: ScoreBreakdown


class CarrierHistoryItem(BaseModel):
    id: str
    hash: str
    score: float
    computed_at: str
    score_breakdown: ScoreBreakdown
    legal_name: str
    dot_number: str
    authority_status: AuthorityStatus
