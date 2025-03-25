from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from database import housing_collection, predictions_collection, feedback_collection, contact_collection
import logging
from datetime import datetime
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load the trained model
try:
    model = joblib.load("models/house_price_model.pkl")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    model = None

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Server is running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        logger.debug(f"Received prediction request with data: {data}")
        
        if not data or 'features' not in data:
            return jsonify({"error": "Invalid input data"}), 400
        
        features = np.array(data["features"], dtype=float).reshape(1, -1)
        area = float(features[0][0])
        bedrooms = int(features[0][1])
        bathrooms = int(features[0][2])
        
        # Calculate base price in USD
        if model is not None:
            price_usd = float(model.predict(features)[0])
        else:
            base_price = area * 100
            bedroom_factor = bedrooms * 5000
            bathroom_factor = bathrooms * 3000
            price_usd = float(base_price + bedroom_factor + bathroom_factor)
        
        # Convert to INR
        usd_to_inr_rate = 83  # Fixed conversion rate
        price_inr = round(price_usd * usd_to_inr_rate, 2)
        
        # Store INR price in database
        prediction_data = {
            "area": area,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "price_usd": price_usd,
            "price_inr": price_inr,
            "timestamp": datetime.utcnow()
        }
        
        predictions_collection.insert_one(prediction_data)
        logger.info(f"Prediction stored in database: {prediction_data}")
        
        return jsonify({
            "price_usd": price_usd,
            "price_inr": price_inr,
            "features": {
                "area": area,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms
            }
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/get_houses", methods=["GET"])
def get_houses():
    try:
        houses = list(housing_collection.find({}, {"_id": 0}))
        processed_houses = []
        
        for house in houses:
            processed_house = {}
            for key, value in house.items():
                if isinstance(value, (np.int64, np.int32)):
                    processed_house[key] = int(value)
                elif isinstance(value, (np.float64, np.float32)):
                    processed_house[key] = float(value)
                else:
                    processed_house[key] = value
            processed_houses.append(processed_house)
            
        logger.debug(f"Successfully fetched {len(processed_houses)} houses")
        return jsonify(processed_houses)
    except Exception as e:
        logger.error(f"Error fetching houses: {str(e)}")
        return jsonify({"error": f"Failed to fetch houses: {str(e)}"}), 500

@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    try:
        data = request.json
        feedback_data = {
            "rating": data.get("rating"),
            "comment": data.get("comment"),
            "timestamp": datetime.utcnow()
        }
        feedback_collection.insert_one(feedback_data)
        return jsonify({"message": "Feedback submitted successfully"})
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    try:
        data = request.json
        contact_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "message": data.get("message"),
            "timestamp": datetime.utcnow()
        }
        contact_collection.insert_one(contact_data)
        return jsonify({"message": "Message sent successfully"})
    except Exception as e:
        logger.error(f"Error submitting contact: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/delete_prediction/<prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    try:
        result = predictions_collection.delete_one({"_id": ObjectId(prediction_id)})
        if result.deleted_count:
            return jsonify({"message": "Prediction deleted successfully"})
        return jsonify({"error": "Prediction not found"}), 404
    except Exception as e:
        logger.error(f"Error deleting prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/get_analytics", methods=["GET"])
def get_analytics():
    try:
        predictions = list(predictions_collection.find().sort("timestamp", -1))
        
        # Process predictions for frontend
        processed_predictions = []
        total_price = 0
        
        for pred in predictions:
            processed_pred = {
                "id": str(pred["_id"]),
                "area": pred["area"],
                "bedrooms": pred["bedrooms"],
                "bathrooms": pred["bathrooms"],
                "price_inr": pred["price_inr"],
                "timestamp": pred["timestamp"].isoformat()
            }
            processed_predictions.append(processed_pred)
            total_price += pred["price_inr"]
        
        # Calculate analytics
        total_predictions = len(processed_predictions)
        average_price = total_price / total_predictions if total_predictions > 0 else 0
        
        # Create price ranges for distribution chart
        ranges = [
            (0, 2000000, "0-20L"),
            (2000000, 5000000, "20L-50L"),
            (5000000, 10000000, "50L-1Cr"),
            (10000000, float('inf'), "1Cr+")
        ]
        
        price_ranges = []
        for min_price, max_price, label in ranges:
            count = sum(1 for p in processed_predictions 
                       if min_price <= p["price_inr"] < max_price)
            price_ranges.append({
                "range": label,
                "count": count
            })
        
        return jsonify({
            "history": processed_predictions,
            "averagePrice": average_price,
            "totalPredictions": total_predictions,
            "priceRanges": price_ranges
        })
        
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)