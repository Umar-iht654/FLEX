import joblib
import numpy as np
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.activity import Activity, UserLocation, user_interests
from app.models.group import Group
from app.models.progress import Progress
from datetime import datetime, timedelta, timezone

class Recommender:
    def __init__(self, model_path: str = None):
        # Optional: Load ML model for activity recommendations
        self.model = joblib.load(model_path) if model_path else None
        self.EARTH_RADIUS_KM = 6371
#calculate the distance between 2 points using a formula
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points using Haversine formula"""
        lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
        c = 2 * np.arcsin(np.sqrt(a))
        return self.EARTH_RADIUS_KM * c

    def get_nearby_users(
        self,
        user_id: int,
        db: Session,
        radius_km: float = 5.0
    ) -> List[Dict]:
        """Get users within specified radius"""
        user_location = db.query(UserLocation).filter(
            UserLocation.user_id == user_id
        ).first()
        
        if not user_location:
            return []

        nearby_users = []
        all_locations = db.query(UserLocation).filter(
            UserLocation.user_id != user_id
        ).all()

        for location in all_locations:
            distance = self.calculate_distance(
                user_location.latitude,
                user_location.longitude,
                location.latitude,
                location.longitude
            )
            if distance <= radius_km:
                user = db.query(User).filter(User.id == location.user_id).first()
                if user:
                    nearby_users.append({
                        "user": user,
                        "distance": distance
                    })

        return nearby_users

    def get_similar_interests_users(
        self,
        user_id: int,
        db: Session
    ) -> List[Dict]:
        """Get users with similar interests"""
        user_interests_list = db.query(user_interests).filter(
            user_interests.c.user_id == user_id
        ).all()
        
        if not user_interests_list:
            return []

        interest_types = [interest[1] for interest in user_interests_list]
        
        similar_users = []
        for interest in interest_types:
            users = db.query(User).join(
                user_interests,
                User.id == user_interests.c.user_id
            ).filter(
                user_interests.c.activity_type == interest,
                User.id != user_id
            ).all()
            
            for user in users:
                if user not in [u["user"] for u in similar_users]:
                    similar_users.append({
                        "user": user,
                        "common_interests": [interest]
                    })

        return similar_users

    def get_mutual_connections(
        self,
        user_id: int,
        db: Session
    ) -> List[Dict]:
        """Get users with mutual group memberships"""
        user_groups = db.query(Group).join(
            Group.members
        ).filter(User.id == user_id).all()
        
        mutual_connections = []
        for group in user_groups:
            for member in group.members:
                if member.id != user_id:
                    mutual_connections.append({
                        "user": member,
                        "common_groups": [group.name]
                    })

        return mutual_connections

    def get_local_activities(
        self,
        user_id: int,
        db: Session,
        radius_km: float = 5.0,
        days_ahead: int = 7
    ) -> List[Dict]:
        """Get activities happening nearby"""
        user_location = db.query(UserLocation).filter(
            UserLocation.user_id == user_id
        ).first()
        
        if not user_location:
            return []

        future_date = datetime.now(timezone.utc) + timedelta(days=days_ahead)
        activities = db.query(Activity).filter(
            Activity.start_time >= datetime.now(timezone.utc),
            Activity.start_time <= future_date
        ).all()

        nearby_activities = []
        for activity in activities:
            distance = self.calculate_distance(
                user_location.latitude,
                user_location.longitude,
                activity.latitude,
                activity.longitude
            )
            if distance <= radius_km:
                nearby_activities.append({
                    "activity": activity,
                    "distance": distance
                })

        return nearby_activities

    def get_recommendations(
        self,
        user_id: int,
        db: Session,
        num_recommendations: int = 5
    ) -> Dict:
        """Get comprehensive recommendations"""
        recommendations = {
            "nearby_users": self.get_nearby_users(user_id, db),
            "similar_interests": self.get_similar_interests_users(user_id, db),
            "mutual_connections": self.get_mutual_connections(user_id, db),
            "local_activities": self.get_local_activities(user_id, db)
        }

        # Sort and limit recommendations
        for key in recommendations:
            if key == "local_activities":
                recommendations[key].sort(key=lambda x: (x["distance"], x["activity"].start_time))
            else:
                recommendations[key].sort(key=lambda x: x.get("distance", 0) if "distance" in x else 0)
            recommendations[key] = recommendations[key][:num_recommendations]

        return recommendations

    def update_model(self, new_data: List[Progress]):
        """Update the model with new training data"""
        # This would be implemented based on your specific ML model
        # and retraining strategy
        pass 
