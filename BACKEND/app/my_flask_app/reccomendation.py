from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timedelta, timezone
import mysql.connector
import numpy as np
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'studdb.csc.liv.ac.uk',
    'user': 'sgbadede',
    'password': 'TempasBas',
    'database': 'sgbadede'
}

class RecommendationBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: str
    reason: str
    priority: int = 1

class RecommendationResponse(RecommendationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_completed: bool = False

    class Config:
        from_attributes = True

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    # Radius of earth in kilometers
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)
    
    # Differences in coordinates
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    
    # Haversine formula
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    
    return distance

@app.route('/recommendations/mutual_friends/<int:user_id>', methods=['GET'])
def get_mutual_friends(user_id):
    """Get mutuals - friends that are connected to user's friends"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's friends
        cursor.execute("""
            SELECT friend_id 
            FROM friends 
            WHERE user_id = %s AND status = 'accepted'
        """, (user_id,))
        user_friends = [friend['friend_id'] for friend in cursor.fetchall()]
        
        if not user_friends:
            cursor.close()
            conn.close()
            return jsonify({"recommendations": [], "total": 0})
        
        # Get friends of friends that are not already user's friends
        placeholders = ','.join(['%s'] * len(user_friends))
        query = f"""
            SELECT DISTINCT f.friend_id, u.username
            FROM friends f
            JOIN users u ON f.friend_id = u.id
            WHERE f.user_id IN ({placeholders})
            AND f.status = 'accepted'
            AND f.friend_id != %s
            AND f.friend_id NOT IN ({placeholders})
        """
        # Parameters: first for user's friends, then user_id, then user's friends again
        params = user_friends + [user_id] + user_friends
        
        cursor.execute(query, params)
        mutuals = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format the response
        result = []
        for mutual in mutuals:
            result.append({
                "user_id": mutual['friend_id'],
                "username": mutual['username'],
                "type": "mutual_friend"
            })
        
        return jsonify({
            "recommendations": result,
            "total": len(result)
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/recommendations/local_activities/<int:user_id>', methods=['GET'])
def get_local_activities(user_id):
    """Get activities happening near the user"""
    radius_km = float(request.args.get('radius', 5.0))
    days_ahead = int(request.args.get('days', 7))
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's location
        cursor.execute("""
            SELECT latitude, longitude 
            FROM user_locations 
            WHERE user_id = %s
        """, (user_id,))
        location = cursor.fetchone()
        
        if not location:
            cursor.close()
            conn.close()
            return jsonify({"detail": "User location not found"}), 404
        
        # Get future activities
        future_date = (datetime.now() + timedelta(days=days_ahead)).strftime('%Y-%m-%d %H:%M:%S')
        current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.execute("""
            SELECT a.id, a.name, a.activity_type, a.location, a.latitude, a.longitude, a.start_time
            FROM activities a
            WHERE a.start_time >= %s AND a.start_time <= %s
        """, (current_date, future_date))
        
        activities = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Filter by distance
        nearby_activities = []
        for activity in activities:
            if activity['latitude'] and activity['longitude']:
                distance = calculate_distance(
                    location['latitude'], 
                    location['longitude'],
                    activity['latitude'], 
                    activity['longitude']
                )
                
                if distance <= radius_km:
                    nearby_activities.append({
                        "id": activity['id'],
                        "name": activity['name'],
                        "activity_type": activity['activity_type'],
                        "location": activity['location'],
                        "start_time": activity['start_time'],
                        "distance": round(distance, 2),
                        "type": "local_activity"
                    })
        
        # Sort by distance
        nearby_activities.sort(key=lambda x: x['distance'])
        
        return jsonify({
            "recommendations": nearby_activities,
            "total": len(nearby_activities)
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/recommendations/possible_interests/<int:user_id>', methods=['GET'])
def get_possible_interests(user_id):
    """Get activities that the user hasn't done but most of their friends are doing"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's friends
        cursor.execute("""
            SELECT friend_id 
            FROM friends 
            WHERE user_id = %s AND status = 'accepted'
        """, (user_id,))
        user_friends = [friend['friend_id'] for friend in cursor.fetchall()]
        
        if not user_friends:
            cursor.close()
            conn.close()
            return jsonify({"recommendations": [], "total": 0})
        
        # Get activities the user has done
        cursor.execute("""
            SELECT DISTINCT activity_type
            FROM activity_participants
            JOIN activities ON activity_participants.activity_id = activities.id
            WHERE activity_participants.user_id = %s
        """, (user_id,))
        user_activities = [activity['activity_type'] for activity in cursor.fetchall()]
        
        # Get activities that friends are doing but user hasn't done
        placeholders = ','.join(['%s'] * len(user_friends))
        query = f"""
            SELECT a.activity_type, COUNT(DISTINCT ap.user_id) as friend_count
            FROM activity_participants ap
            JOIN activities a ON ap.activity_id = a.id
            WHERE ap.user_id IN ({placeholders})
            GROUP BY a.activity_type
            ORDER BY friend_count DESC
        """
        
        cursor.execute(query, user_friends)
        friend_activities = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Filter for activities user hasn't done
        possible_interests = []
        for activity in friend_activities:
            if activity['activity_type'] not in user_activities:
                possible_interests.append({
                    "activity_type": activity['activity_type'],
                    "friend_count": activity['friend_count'],
                    "type": "possible_interest"
                })
        
        return jsonify({
            "recommendations": possible_interests,
            "total": len(possible_interests)
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/recommendations/nearby_users/<int:user_id>', methods=['GET'])
def get_nearby_users(user_id):
    """Get users that are near the user's current location"""
    radius_km = float(request.args.get('radius', 5.0))
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's location
        cursor.execute("""
            SELECT latitude, longitude 
            FROM user_locations 
            WHERE user_id = %s
        """, (user_id,))
        location = cursor.fetchone()
        
        if not location:
            cursor.close()
            conn.close()
            return jsonify({"detail": "User location not found"}), 404
        
        # Get other users' locations
        cursor.execute("""
            SELECT ul.user_id, u.username, ul.latitude, ul.longitude
            FROM user_locations ul
            JOIN users u ON ul.user_id = u.id
            WHERE ul.user_id != %s
        """, (user_id,))
        
        user_locations = cursor.fetchall()
        
        # Get user's friends to exclude
        cursor.execute("""
            SELECT friend_id 
            FROM friends 
            WHERE user_id = %s AND status = 'accepted'
        """, (user_id,))
        user_friends = [friend['friend_id'] for friend in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        # Filter by distance and exclude friends
        nearby_users = []
        for ul in user_locations:
            if ul['user_id'] not in user_friends:
                distance = calculate_distance(
                    location['latitude'], 
                    location['longitude'],
                    ul['latitude'], 
                    ul['longitude']
                )
                
                if distance <= radius_km:
                    nearby_users.append({
                        "user_id": ul['user_id'],
                        "username": ul['username'],
                        "distance": round(distance, 2),
                        "type": "nearby_user"
                    })
        
        # Sort by distance
        nearby_users.sort(key=lambda x: x['distance'])
        
        return jsonify({
            "recommendations": nearby_users,
            "total": len(nearby_users)
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/recommendations/<int:user_id>', methods=['GET'])
def get_all_recommendations(user_id):
    """Get all types of recommendations for a user"""
    try:
        # Get mutuals
        mutuals_response = get_mutual_friends(user_id)
        mutuals = mutuals_response.json['recommendations'] if hasattr(mutuals_response, 'json') else []
        
        # Get local activities
        activities_response = get_local_activities(user_id)
        activities = activities_response.json['recommendations'] if hasattr(activities_response, 'json') and 'recommendations' in activities_response.json else []
        
        # Get possible interests
        interests_response = get_possible_interests(user_id)
        interests = interests_response.json['recommendations'] if hasattr(interests_response, 'json') else []
        
        # Get nearby users
        nearby_response = get_nearby_users(user_id)
        nearby = nearby_response.json['recommendations'] if hasattr(nearby_response, 'json') and 'recommendations' in nearby_response.json else []
        
        # Combine all recommendations
        all_recommendations = {
            "mutual_friends": mutuals,
            "local_activities": activities,
            "possible_interests": interests,
            "nearby_users": nearby
        }
        
        return jsonify({
            "recommendations": all_recommendations,
            "total_recommendations": len(mutuals) + len(activities) + len(interests) + len(nearby)
        })
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
