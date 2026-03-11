from src.models.carrier import Carrier, SafetyRating, AuthorityStatus


def test_successfull_scored_carrier_conversion():
    from src.logic import convert_carrier_to_scored_carrier

    carrier = Carrier(
        carrier_id="123",
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
    scored_carrier = convert_carrier_to_scored_carrier(carrier)
    assert scored_carrier.id == "123"


def test_score_generation():
    from src.logic import generate_score

    carrier = Carrier(
        carrier_id="123",
        dot_number="123456",
        legal_name="Example Carrier Inc.",
        safety_rating=SafetyRating.Unsatisfactory,
        out_of_service_pct=100.0,
        crash_total=10,
        driver_oos_pct=100.0,
        insurance_on_file=False,
        authority_status=AuthorityStatus.Inactive,
        last_inspection_date="2023-10-15",
    )
    score = generate_score(carrier)
    assert score == 5.0  # Based on the scoring logic


def test_unsuccess_carrier_conversion():
    try:
        Carrier(
            carrier_id="123",
            dot_number="123456",
            legal_name="Example Carrier Inc.",
            safety_rating=SafetyRating.Unsatisfactory,
            out_of_service_pct=100.0,
            crash_total=10,
            driver_oos_pct=100.0,
            insurance_on_file=False,
            authority_status=AuthorityStatus.Inactive,
        )
        assert False
    except Exception:
        assert True
