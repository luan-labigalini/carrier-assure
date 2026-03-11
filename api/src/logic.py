import json
import hashlib
import pymongo
from pymongo.collection import Collection
from datetime import datetime
from src.models.carrier import Carrier, CarrierHistoryItem, ScoreBreakdown
from src.validation import are_hashes_equal


def process_file(content: bytes):
    from src.db.mongo import get_carriers_collection

    """
    This function processes the uploaded CCF JSON file and returns a dictionary with the results.
    """
    data = json.loads(content)

    if not isinstance(data, list):
        data = [data]

    carriers = list(map(lambda x: convert_item_to_carrier(x), data))

    scored_carriers = list(
        map(lambda x: convert_carrier_to_scored_carrier(x), carriers)
    )

    collection = get_carriers_collection()

    unchanged, updated, new = 0, 0, 0

    for scored_carrier in scored_carriers:

        curr_carrier = carrier(scored_carrier.id, collection)

        if curr_carrier is not None:

            curr_hash = curr_carrier["hash"]
            new_hash = scored_carrier.hash

            if are_hashes_equal(curr_hash, new_hash):
                unchanged += 1
                continue
            else:
                updated += 1

        else:
            new += 1
        collection.insert_one(scored_carrier.model_dump())

    total = collection.count_documents({})

    ids_in_file = set([carrier.id for carrier in scored_carriers])

    unchanged_not_in_file = collection.count_documents(
        {"id": {"$nin": list(ids_in_file)}}
    )

    return {
        "total": total,
        "unchanged": unchanged + unchanged_not_in_file,
        "updated": updated,
        "new": new,
    }


def convert_item_to_carrier(item: dict) -> Carrier:
    """
    This function converts a dictionary item to a Carrier model instance.
    """
    return Carrier(**item)


def convert_carrier_to_scored_carrier(carrier: Carrier) -> CarrierHistoryItem:
    """
    This function converts a Carrier instance to a ScoredCarrier instance by generating a score and adding metadata.
    """
    score_breakdown = generate_score_breakdown(carrier)

    return CarrierHistoryItem(
        id=carrier.carrier_id,
        hash=generate_hash(carrier),
        score=generate_score(carrier),
        computed_at=datetime.now().isoformat(),
        score_breakdown=ScoreBreakdown(**score_breakdown),
        authority_status=carrier.authority_status,
        dot_number=carrier.dot_number,
        legal_name=carrier.legal_name,
    )


def generate_hash(carrier: Carrier) -> str:
    """
    Create a SHA256 hash from a Carrier.
    """
    data = carrier.model_dump()
    json_str = json.dumps(data, sort_keys=True, separators=(",", ":"))
    hash_obj = hashlib.sha256(json_str.encode("utf-8"))
    return hash_obj.hexdigest()


def generate_score(carrier: Carrier) -> float:
    """
    This function generates a score for a given Carrier instance based on its fields.
    """

    scores = generate_score_breakdown(carrier)

    return round(sum(scores.values()), 2)


def generate_score_breakdown(carrier: Carrier) -> dict:
    """
    This function generates a score breakdown for a given Carrier instance, showing the contribution of each field to the total score.
    """

    safety = 0.25 * safety_rating_to_score(carrier.safety_rating)
    out_of_service = 0.2 * (1 - carrier.out_of_service_pct / 100)
    normalized_crash = max(10 - carrier.crash_total, 0)
    crash = 0.2 * (normalized_crash / 10)
    driver_oos = 0.15 * (1 - carrier.driver_oos_pct / 100)
    insurance = 0.1 * insurance_to_score(carrier.insurance_on_file)
    authority = 0.1 * authority_status_to_score(carrier.authority_status)

    return {
        "safety": 100 * safety,
        "out_of_service": 100 * out_of_service,
        "crash": 100 * crash,
        "driver_oos": 100 * driver_oos,
        "insurance": 100 * insurance,
        "authority_status": 100 * authority,
    }


def safety_rating_to_score(safety_rating: str) -> float:
    """
    This function converts a safety rating string to a numerical score.
    """
    if safety_rating == "Satisfactory":
        return 1.0
    elif safety_rating == "Conditional":
        return 0.5
    return 0.0


def authority_status_to_score(authority_status: str) -> float:
    """
    This function converts an authority status string to a numerical score.
    """
    if authority_status == "Active":
        return 1.0
    elif authority_status == "Inactive":
        return 0.5
    return 0.0


def insurance_to_score(insurance_on_file: bool) -> float:
    """
    This function converts the insurance_on_file boolean to a numerical score.
    """
    return 1 if insurance_on_file else 0


def carriers(page: int, limit: int, min_score: float):
    from src.db.mongo import get_carriers_collection

    """
    This function retrieves a list of scored carriers based on pagination and minimum score criteria.
    """
    offset = (page - 1) * limit

    collection = get_carriers_collection()

    pipeline = [
        {"$match": {"score": {"$gte": min_score}}},
        {"$sort": {"score": pymongo.DESCENDING, "computed_at": pymongo.DESCENDING}},
        {"$group": {"_id": "$id", "doc": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$doc"}},
        {"$sort": {"score": pymongo.DESCENDING, "computed_at": pymongo.DESCENDING}},
        {"$skip": offset},
        {"$limit": limit},
    ]

    result = list(collection.aggregate(pipeline))

    total = collection.count_documents({"score": {"$gte": min_score}})

    return {
        "data": result,
        "pagination": {"total": total, "current_page": page, "page_size": limit},
    }


def carrier(carrier_id: str, collection: Collection = None):
    from src.db.mongo import get_carriers_collection

    """
    This function retrieves a specific scored carrier by its ID.
    """

    if collection is None:
        collection = get_carriers_collection()

    carrier = collection.find_one(
        {"id": carrier_id}, sort=["computed_at", pymongo.DESCENDING]
    )

    return carrier


def carrier_history(carrier_id: str):
    from src.db.mongo import get_carriers_collection

    """
    This function retrieves the history of a specific scored carrier by its ID.
    """
    collection = get_carriers_collection()

    result = collection.find({"id": carrier_id})
    return result.to_list()
