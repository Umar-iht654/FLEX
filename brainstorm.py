from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os


# User registration (simplified, no hashing for demo)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username, email, password = data['username'], data['email'], data['password']
    name, address = data.get('name'), data.get('address')
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO users (username, email, password, name, address) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (username, email, password, name, address))
        conn.commit()
        return jsonify({"message": "User registered", "userId": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Log an activity
@app.route('/api/activities', methods=['POST'])
def log_activity():
    data = request.json
    user_id, sport, score = data['user_id'], data['sport'], data['score']
    privacy = data.get('privacy', 'public')
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO activities (user_id, sport, score, privacy) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (user_id, sport, score, privacy))
        conn.commit()
        return jsonify({"message": "Activity logged", "activityId": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Get user activities (for progress tracking)
@app.route('/api/activities/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "SELECT * FROM activities WHERE user_id = %s AND privacy = 'public'"
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        activities = [{"id": row[0], "sport": row[2], "score": row[3], "logged_at": row[4]} for row in rows]
        return jsonify(activities), 200
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Create a group
@app.route('/api/groups', methods=['POST'])
def create_group():
    data = request.json
    name, creator_id = data['name'], data['creator_id']
    is_private, password = data.get('is_private', False), data.get('password')
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO groups (name, creator_id, is_private, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, creator_id, is_private, password))
        group_id = cursor.lastrowid
        conn.commit()
        
        # Creator joins the group
        cursor.execute("INSERT INTO group_members (group_id, user_id) VALUES (%s, %s)", (group_id, creator_id))
        conn.commit()
        return jsonify({"message": "Group created", "groupId": group_id}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Send a message
@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.json
    sender_id, content = data['sender_id'], data['content']
    group_id, receiver_id = data.get('group_id'), data.get('receiver_id')
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO messages (sender_id, group_id, receiver_id, content) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (sender_id, group_id, receiver_id, content))
        conn.commit()
        return jsonify({"message": "Message sent", "messageId": cursor.lastrowid}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()