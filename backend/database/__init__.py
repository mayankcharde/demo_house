import os
import logging
import json
from bson import ObjectId
from pymongo import MongoClient

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    logger.warning("python-dotenv not installed. Using environment variables directly.")

def process_mongodb_doc(doc):
    if isinstance(doc, dict) and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

try:
    MONGODB_URI = os.getenv('MONGODB_URI')
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.server_info()
    
    db = client["housing_db"]
    housing_collection = db["housing_data"]
    predictions_collection = db["predictions"]
    feedback_collection = db["feedback"]
    contact_collection = db["contact"]
    logger.info("Successfully connected to MongoDB")
    
    def find_with_processed_ids(collection, *args, **kwargs):
        docs = list(collection.find(*args, **kwargs))
        return [process_mongodb_doc(doc) for doc in docs]

except Exception as e:
    logger.error(f"MongoDB Connection Error: {str(e)}")
    # Fallback to mock data if database connection fails
    class MockCollection:
        def find(self, *args, **kwargs):
            return [
                {"area": 1000, "bedrooms": 2, "bathrooms": 1, "price": 100000},
                {"area": 1500, "bedrooms": 3, "bathrooms": 2, "price": 150000}
            ]
        def insert_one(self, *args, **kwargs):
            pass
    housing_collection = MockCollection()
    predictions_collection = MockCollection()
    feedback_collection = MockCollection()
    contact_collection = MockCollection()
    logger.warning("Using mock data due to database connection failure")
