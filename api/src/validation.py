from fastapi import UploadFile
from src.models.carrier import Carrier
import json


def is_json_file(file: UploadFile):
    """
    This function retrieves if the file is JSON type
    """
    return file.filename.endswith(".json")


def every_input_is_valid_carrier(content: bytes):
    """
    This function checks if every input is valid for the Carrier model
    """
    try:

        data = json.loads(content)

    except json.JSONDecodeError:
        return False

    if not isinstance(data, list):
        data = [data]

    for item in data:
        try:
            Carrier(**item)
        except Exception as e:
            print(f"Validation error for item {item}: {e}")
            return False

    return True


def are_hashes_equal(hash1: str, hash2: str) -> bool:
    """
    This function compares two hashes and returns True if they are equal, False otherwise.
    """
    return hash1 == hash2
