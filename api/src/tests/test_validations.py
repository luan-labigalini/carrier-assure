import io
from src.logic import generate_hash
from src.models.carrier import AuthorityStatus, Carrier, SafetyRating


def test_json_file():
    from src.validation import is_json_file
    from fastapi import UploadFile

    file = UploadFile(filename="test.json", file=io.BytesIO(b'{"test": "data"}'))
    assert is_json_file(file)


def test_not_json_file():
    from src.validation import is_json_file
    from fastapi import UploadFile

    file = UploadFile(filename="test.txt", file=io.BytesIO(b"test data"))
    assert not is_json_file(file)


def test_valid_carrier_content():
    from src.validation import every_input_is_valid_carrier

    content = b'[{"carrier_id": "CARRIER001", "dot_number": "123456", "legal_name": "Example Carrier Inc.", "safety_rating": "Satisfactory", "out_of_service_pct": 5.5, "crash_total": 2, "driver_oos_pct": 3.2, "insurance_on_file": true, "authority_status": "Active", "last_inspection_date": "2023-10-15", "fleet_size": 50}, {"carrier_id": "CARRIER002", "dot_number": "789012", "legal_name": "Another Carrier LLC", "safety_rating": "Conditional", "out_of_service_pct": 12.0, "crash_total": 5, "driver_oos_pct": 8.5, "insurance_on_file": false, "authority_status": "Inactive", "last_inspection_date": "2023-09-20", "fleet_size": 25}]'
    assert every_input_is_valid_carrier(content)


def test_invalid_carrier_content():
    from src.validation import every_input_is_valid_carrier

    content = b'[{"safety_rating": "high", "out_of_service_pct": 5.0, "crash_total": 2, "driver_oos_pct": 3.0, "insurance_on_file": true, "authority_status": 1}]'
    assert not every_input_is_valid_carrier(content)


def test_hashes_equal():
    from src.validation import are_hashes_equal

    carrier = Carrier(
        carrier_id="CARRIER001",
        dot_number="123456",
        legal_name="Example Carrier Inc.",
        safety_rating=SafetyRating.Satisfactory,
        out_of_service_pct=5.5,
        crash_total=2,
        driver_oos_pct=3.2,
        insurance_on_file=True,
        authority_status=AuthorityStatus.Active,
        last_inspection_date="2023-10-15",
        fleet_size=50,
    )
    hash1 = generate_hash(carrier)
    hash2 = generate_hash(carrier)
    assert are_hashes_equal(hash1, hash2)


def test_hashes_not_equal():
    from src.validation import are_hashes_equal

    carrier1 = Carrier(
        carrier_id="CARRIER001",
        dot_number="123456",
        legal_name="Example Carrier Inc.",
        safety_rating=SafetyRating.Satisfactory,
        out_of_service_pct=5.5,
        crash_total=2,
        driver_oos_pct=3.2,
        insurance_on_file=True,
        authority_status=AuthorityStatus.Active,
        last_inspection_date="2023-10-15",
        fleet_size=50,
    )
    carrier2 = Carrier(
        carrier_id="CARRIER002",
        dot_number="789012",
        legal_name="Another Carrier LLC",
        safety_rating=SafetyRating.Conditional,
        out_of_service_pct=12.0,
        crash_total=5,
        driver_oos_pct=8.5,
        insurance_on_file=False,
        authority_status=AuthorityStatus.Inactive,
        last_inspection_date="2023-09-20",
        fleet_size=25,
    )
    hash1 = generate_hash(carrier1)
    hash2 = generate_hash(carrier2)
    assert not are_hashes_equal(hash1, hash2)
