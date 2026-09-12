from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, validator
import mysql.connector
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'studdb.csc.liv.ac.uk',
    'user': 'sgbadede',
    'password': 'TempasBas',
    'database': 'sgbadede'
}

class ActivityRequest(BaseModel):
    name: str
    description: str
    activity_type: str
    location: str
    latitude: float
    longitude: float
    start_time: str
    end_time: str
    max_participants: int
    username: str

class ActivityUpdateRequest(BaseModel):
    name: str = None
    description: str = None
    activity_type: str = None
    location: str = None
    latitude: float = None
    longitude: float = None
    start_time: str = None
    end_time: str = None
    max_participants: int = None
    username: str

@app.route('/activity/create', methods=['POST'])
def create_activity():
    try:
        data = ActivityRequest(**request.json)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO activities (name, description, activity_type, location, 
                                  latitude, longitude, start_time, end_time, 
                                  max_participants, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.name,
            data.description,
            data.activity_type,
            data.location,
            data.latitude,
            data.longitude,
            data.start_time,
            data.end_time,
            data.max_participants,
            data.username
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Activity created successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/activity/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM activities WHERE id = %s
        """, (activity_id,))
        activity = cursor.fetchone()
        cursor.close()
        conn.close()

        if not activity:
            return jsonify({"detail": "Activity not found"}), 404

        return jsonify(activity), 200
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/activity/update/<int:activity_id>', methods=['PUT'])
def update_activity(activity_id):
    try:
        data = ActivityUpdateRequest(**request.json)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Verify activity exists and user is creator
        cursor.execute("""
            SELECT created_by FROM activities WHERE id = %s
        """, (activity_id,))
        result = cursor.fetchone()

        if not result:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Activity not found"}), 404

        if result['created_by'] != data.username:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Not authorized to update this activity"}), 403

        # Build update query
        update_fields = []
        update_values = []
        
        if data.name:
            update_fields.append("name = %s")
            update_values.append(data.name)
        if data.description:
            update_fields.append("description = %s")
            update_values.append(data.description)
        if data.activity_type:
            update_fields.append("activity_type = %s")
            update_values.append(data.activity_type)
        if data.location:
            update_fields.append("location = %s")
            update_values.append(data.location)
        if data.latitude:
            update_fields.append("latitude = %s")
            update_values.append(data.latitude)
        if data.longitude:
            update_fields.append("longitude = %s")
            update_values.append(data.longitude)
        if data.start_time:
            update_fields.append("start_time = %s")
            update_values.append(data.start_time)
        if data.end_time:
            update_fields.append("end_time = %s")
            update_values.append(data.end_time)
        if data.max_participants:
            update_fields.append("max_participants = %s")
            update_values.append(data.max_participants)

        if update_fields:
            update_query = f"""
                UPDATE activities 
                SET {', '.join(update_fields)}
                WHERE id = %s
            """
            update_values.append(activity_id)
            
            cursor.execute(update_query, tuple(update_values))
            conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": "Activity updated successfully"}), 200

    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500
    except Exception as e:
        return jsonify({"detail": str(e)}), 400

@app.route('/activity/delete/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"detail": "Username is required"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT created_by FROM activities WHERE id = %s
        """, (activity_id,))
        result = cursor.fetchone()

        if not result:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Activity not found"}), 404

        if result['created_by'] != username:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Not authorized to delete this activity"}), 403

        cursor.execute("DELETE FROM activities WHERE id = %s", (activity_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Activity deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/activity/join/<int:activity_id>', methods=['POST'])
def join_activity(activity_id):
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"detail": "Username is required"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Check if activity exists and has space
        cursor.execute("""
            SELECT max_participants FROM activities WHERE id = %s
        """, (activity_id,))
        activity = cursor.fetchone()

        if not activity:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Activity not found"}), 404

        cursor.execute("""
            SELECT COUNT(*) as count FROM activity_participants 
            WHERE activity_id = %s
        """, (activity_id,))
        result = cursor.fetchone()

        if result['count'] >= activity['max_participants']:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Activity is full"}), 400

        # Check if already joined
        cursor.execute("""
            SELECT * FROM activity_participants 
            WHERE activity_id = %s AND username = %s
        """, (activity_id, username))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Already joined this activity"}), 400

        # Add participant
        cursor.execute("""
            INSERT INTO activity_participants (activity_id, username)
            VALUES (%s, %s)
        """, (activity_id, username))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Successfully joined activity"}), 200
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/activity/leave/<int:activity_id>', methods=['POST'])
def leave_activity(activity_id):
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"detail": "Username is required"}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM activity_participants 
            WHERE activity_id = %s AND username = %s
        """, (activity_id, username))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Not a participant of this activity"}), 400

        cursor.execute("""
            DELETE FROM activity_participants 
            WHERE activity_id = %s AND username = %s
        """, (activity_id, username))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Successfully left activity"}), 200
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)