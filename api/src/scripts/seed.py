from src.db.mongo import get_database


def seed_database():
    database = get_database()

    if "carriers" not in database.list_collection_names():
        database.create_collection("carriers")
