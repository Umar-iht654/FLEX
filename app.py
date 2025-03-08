from flask import Flask, request, jsonify
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# MySQL connection configuration
def get_db_connection():
    """Create a connection to the university MySQL database."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_DATABASE'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Test database connection on startup
conn = get_db_connection()
if conn:
    print("Connected to MySQL successfully")
    conn.close()
else:
    print("Failed to connect to MySQL")

# Helper function for API responses
def api_response(data=None, error=None, status=200):
    """Standardize API responses for frontend compatibility."""
    response = {}
    if data is not None:
        response['data'] = data
    if error is not None:
        response['error'] = error
    return jsonify(response), status

# Root endpoint for testing
@app.route('/', methods=['GET'])
def home():
    return api_response(data={"message": "Welcome to the FLEX Fitness Platform API"})

# User registration
@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json(force=True, silent=True)
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return api_response(error="Missing required fields (username, email, password)", status=400)
    
    username, email, password = data['username'], data['email'], data['password']
    name, address = data.get('name'), data.get('address')  # Optional fields

    conn = get_db_connection()
    if not conn:
        return api_response(error="Database connection failed", status=500)

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO users (username, email, password, name, address)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, email, password, name, address))
        conn.commit()
        user_id = cursor.lastrowid
        return api_response(data={"message": "User registered", "user_id": user_id}, status=201)
    except Error as e:
        return api_response(error=f"Database error: {str(e)}", status=400)
    finally:
        cursor.close()
        conn.close()

# Log an activity
@app.route('/api/activities', methods=['POST'])
def log_activity():
    """Log a user's fitness activity."""
    data = request.get_json(force=True, silent=True)
    if not data or not all(k in data for k in ('user_id', 'sport', 'score')):
        return api_response(error="Missing required fields (user_id, sport, score)", status=400)
    
    user_id, sport, score = data['user_id'], data['sport'], data['score']
    privacy = data.get('privacy', 'public')  # Default to public

    conn = get_db_connection()
    if not conn:
        return api_response(error="Database connection failed", status=500)

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO activities (user_id, sport, score, privacy)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, sport, score, privacy))
        conn.commit()
        activity_id = cursor.lastrowid
        return api_response(data={"message": "Activity logged", "activity_id": activity_id}, status=201)
    except Error as e:
        return api_response(error=f"Database error: {str(e)}", status=400)
    finally:
        cursor.close()
        conn.close()

# Get user activities (for progress tracking)
@app.route('/api/activities/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """Retrieve a user's public activities."""
    conn = get_db_connection()
    if not conn:
        return api_response(error="Database connection failed", status=500)

    try:
        cursor = conn.cursor()
        query = """
            SELECT id, sport, score, logged_at
            FROM activities
            WHERE user_id = %s AND privacy = 'public'
        """
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        activities = [
            {"id": row[0], "sport": row[1], "score": row[2], "logged_at": str(row[3])}
            for row in rows
        ]
        return api_response(data={"activities": activities})
    except Error as e:
        return api_response(error=f"Database error: {str(e)}", status=400)
    finally:
        cursor.close()
        conn.close()

# Placeholder for external API integration (e.g., OpenCage for geolocation)
@app.route('/api/geolocation', methods=['POST'])
def get_geolocation():
    """Placeholder for converting address to lat/long using OpenCage API."""
    data = request.get_json(force=True, silent=True)
    if not data or 'address' not in data:
        return api_response(error="Missing address field", status=400)
    
    # Placeholder: Add OpenCage API call here when ready
    # Example: Use `requests` library to call OpenCage
    # For now, return mock data
    mock_result = {"latitude": 51.5074, "longitude": -0.1278}  # London coordinates
    return api_response(data={"message": "Geolocation fetched", "coords": mock_result})


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)