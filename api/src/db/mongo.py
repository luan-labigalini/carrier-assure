from pymongo import MongoClient
from pymongo.database import Database
import os

#  --- AI-ASSISTED ---
#  Tool: Copilot
#  Prompt: "What`s the best practice for connecting to a MongoDB database in Python?"
#  Modifications: Converted the client to a function.
#  --- END AI-ASSISTED ---


def get_client() -> MongoClient:
    return MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))


def get_database() -> Database:
    client = get_client()
    return client["carrier_assure"]


def get_carriers_collection():
    return get_database()["carriers"]
