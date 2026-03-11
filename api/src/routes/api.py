from fastapi import APIRouter, UploadFile, File
from src.models.errors import FileNotValid, ContentNotValid
from src.models.carrier import CarrierHistoryItem, ScoreBreakdown, ScoredCarrier
from src.models.responses import CarriersResponse, Health, Upload
import src.validation as validation
from src.logic import process_file, carriers, carrier, carrier_history
from typing import List, Union

router = APIRouter(prefix="/api")


@router.get("/health", response_model=Health)
def health_check():
    return Health(status="ok", uptime=123456.78)


@router.post("/ccf/upload", response_model=Upload)
async def upload_ccf(
    file: UploadFile = File(
        ..., description="CCF JSON file", media_type="application/json"
    )
):

    if not validation.is_json_file(file):
        raise FileNotValid()

    content = await file.read()

    if not validation.every_input_is_valid_carrier(content):
        raise ContentNotValid()

    res = process_file(content)

    return Upload(**res)


@router.get("/carriers", response_model=CarriersResponse)
def get_carriers(page: int = 1, limit: int = 100, min_score: float = 0.0):
    return carriers(page, limit, min_score)


@router.get("/carriers/{carrier_id}", response_model=Union[ScoredCarrier, None])
def get_carrier(carrier_id: str):

    carrier_id_data = carrier(carrier_id)
    if carrier_id_data is None:
        return None

    return ScoredCarrier(
        hash=carrier_id_data["hash"],
        id=carrier_id_data["id"],
        last_update=carrier_id_data["computed_at"],
        score_breakdown=ScoreBreakdown(carrier_id_data["score_breakdown"]),
        legal_name=carrier_id_data["legal_name"],
    )


@router.get("/carriers/{carrier_id}/history", response_model=List[CarrierHistoryItem])
def get_carrier_history(carrier_id: str):
    return carrier_history(carrier_id)
