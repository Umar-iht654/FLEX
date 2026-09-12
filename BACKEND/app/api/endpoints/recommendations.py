from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.recommender import Recommender
from app.core.auth import get_current_user
from app.models.user import User

bp = Blueprint('recommendations', __name__)
recommender = Recommender()

@bp.route("/", methods=['GET'])
def get_recommendations():
    current_user = get_current_user()
    db = next(get_db())
    radius_km = request.args.get('radius_km', 5.0, type=float)
    days_ahead = request.args.get('days_ahead', 7, type=int)
    
    try:
        recommendations = recommender.get_recommendations(
            user_id=current_user.id,
            db=db,
            num_recommendations=5
        )
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": f"Error getting recommendations: {str(e)}"}), 500

@bp.route("/update-location", methods=['POST'])
def update_user_location():
    current_user = get_current_user()
    db = next(get_db())
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    try:
        user_location = db.query(UserLocation).filter(
            UserLocation.user_id == current_user.id
        ).first()

        if user_location:
            user_location.latitude = latitude
            user_location.longitude = longitude
        else:
            user_location = UserLocation(
                user_id=current_user.id,
                latitude=latitude,
                longitude=longitude
            )
            db.add(user_location)

        db.commit()
        return jsonify({"message": "Location updated successfully"})
    except Exception as e:
        return jsonify({"error": f"Error updating location: {str(e)}"}), 500 