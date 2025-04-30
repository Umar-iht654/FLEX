from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, EmailStr, validator
from typing import List
import mysql.connector
import re

app = Flask(__name__)

CORS(app)

db_config = {
    'host': 'studdb.csc.liv.ac.uk',
    'user': 'sgbadede',
    'password': 'TempasBas',
    'database': 'sgbadede'
}

class searchReq(BaseModel):                       
    search: str

class ActivitiesReq(BaseModel):
    activities: List[str]
    email: str

class ProfileSet(BaseModel):
    username: str
    bio: str
    profile: str

class EmailRequest(BaseModel):
    email: EmailStr

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class UsernameRequest(BaseModel):
    username: str

class PasswordRequest(BaseModel):
    password: str

class IsFriendReq(BaseModel):
    user_usn: str
    user2_usn: str

class AddMemberRequest(BaseModel):
    username: str
    groupname: str
    
@validator("password")
def strong_password(cls, value):
    pattern = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(pattern, value):
        raise ValueError("Password must contain 1 uppercase, 1 digit, 1 special char, and be 8+ chars.")
    return value

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    postcode: str
    address: str
    DOB: str
    full_name: str

class GroupRegisterRequest(BaseModel):
    user: str
    name: str
    description: str
    activity_type: str

class ProfileRequest(BaseModel):
    username: str

@app.route('/')
def home():
    return 'Welcome to the Flask app!'

@app.route('/activityLog', methods=['POST'])
def activityLog():
    data = ActivitiesReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userDetails WHERE email = %s", (data.email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"detail": "User not found"}), 404
        
        for activity_name in data.activities:
            cursor.execute("""
                INSERT INTO activities (name, user_id)
                VALUES (%s, %s)
            """, (activity_name, user['id']))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Activities logged successfully", "user": user}), 201
    
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

@app.route('/Login', methods=['POST'])
def Login():
    data = LoginReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userDetails WHERE email = %s", (data.email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if not user:
            return jsonify({"detail": "Incorrect email or password"}), 401  # Email not found
        
        if data.password != user['password']:
            return jsonify({"detail": "Incorrect email or password"}), 401
        
        user.pop('password', None)
        return jsonify({
            "message": "Login successful",
            "user": user
        }), 200
    except mysql.connector.Error:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/checkEmail', methods=['POST'])
def checkEmail():
    data = EmailRequest(**request.json)

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userDetails WHERE email = %s", (data.email,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify({"detail": "Email already registered"}), 400
        return jsonify({"message": "email is available"})
    except mysql.connector.Error:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/register', methods=['POST'])
def register():
    data = RegisterRequest(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO userDetails (username, email, password, postcode, address, dob, name)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.username,
            data.email,
            data.password,  # You should hash this in production!
            data.postcode,
            data.address,
            data.DOB,
            data.full_name
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Registration successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500
    
@app.route('/registerGroup', methods=['POST'])
def registerGroup():
    data = GroupRegisterRequest(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO group_members (group_name, user_username, role)
            Values(%s, %s, 'Admin')
        """, (
            data.name,
            data.user
        ))
        cursor.execute("""
            INSERT INTO group_profile (group_name, bio, activity)
            VALUES (%s, %s, %s)
        """, (
            data.name,
            data.description,
            data.activity_type,  
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Registration successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500
    
@app.route('/addMember', methods=['POST'])
def addMember():
    data = AddMemberRequest(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO group_members (group_name, user_username)
            VALUES (%s, %s)
        """, (
            data.groupname,
            data.username,
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Registration successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/removeMember', methods=['POST'])
def removeMember():
    data = AddMemberRequest(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM group_members
            WHERE group_name = %s AND user_username = %s
        """, (
            data.groupname,
            data.username,
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Registration successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500
    
@app.route('/addFriend', methods=['POST'])
def addFriend():
    data = IsFriendReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO friends (user_username, friend_username)
            VALUES (%s, %s), (%s, %s)
        """, (
            data.user_usn,
            data.user2_usn,
            data.user2_usn,
            data.user_usn
        ))


        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Registration successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/removeFriend', methods=['POST'])
def removeFriend():
    data = IsFriendReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM friends
            WHERE (user_username = %s AND friend_username = %s)
        """, (
            data.user_usn,
            data.user2_usn,
        ))

        cursor.execute("""
            DELETE FROM friends
            WHERE (user_username = %s AND friend_username = %s)
        """, (
            data.user2_usn,
            data.user_usn
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"data": "Friend removed successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/getProfile', methods=['POST'])
def get_profile():
    data = ProfileRequest(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        
        cursor.execute("SELECT * FROM userProfile WHERE username = %s", (data.username,))
        userP = cursor.fetchone()

        cursor.execute("""
            SELECT COUNT(*) AS activityCount
            FROM activities
            JOIN userDetails ON userDetails.id = activities.user_id
            WHERE userDetails.username = %s
        """, (data.username,))
        activityCount = cursor.fetchone()
        if activityCount is None:
            activityCount = {'activityCount': 0}

        cursor.execute("""
            SELECT activities.name FROM activities
            JOIN userDetails ON userDetails.id = activities.user_id
            WHERE userDetails.username = %s
        """, (data.username,))
        activities = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM friends
            WHERE user_username = %s
        """, (data.username,))
        friends = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM group_members
            WHERE user_username = %s
        """, (data.username,))
        groups = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify({
            "message": "Profile data retrieved successfully",
            "userP": userP,
            "activityCount": activityCount['activityCount'],
            "activities": activities,
            "friends": friends,
            "groups": groups
        }), 200
    
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

@app.route('/getUserProf', methods=['POST'])
def getUserprof():
    data = IsFriendReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Get user profile
        cursor.execute("SELECT * FROM userProfile WHERE username = %s", (data.user2_usn,))
        userP = cursor.fetchone()

        cursor.execute("""
            SELECT COUNT(*) AS activityCount
            FROM activities
            JOIN userDetails ON userDetails.id = activities.user_id
            WHERE userDetails.username = %s
        """, (data.user2_usn,))
        activityCount = cursor.fetchone()
        if activityCount is None:
            activityCount = {'activityCount': 0}

        cursor.execute("""
            SELECT activities.name FROM activities
            JOIN userDetails ON userDetails.id = activities.user_id
            WHERE userDetails.username = %s
        """, (data.user2_usn,))
        activities = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM friends
            WHERE user_username = %s
        """, (data.user2_usn,))
        friends = cursor.fetchall()

        cursor.execute("""
            SELECT * FROM friends
            WHERE user_username = %s and friend_username = %s
        """, (data.user_usn, data.user2_usn))
        friend = cursor.fetchone()

        isFriend = bool(friend)

        cursor.execute("""
            SELECT * FROM group_members
            WHERE user_username = %s
        """, (data.user2_usn,))
        groups = cursor.fetchall()

        cursor.close()
        conn.close()

        # Return the user profile and related data
        return jsonify({
            "message": "Profile data retrieved successfully",
            "userP": userP,
            "activityCount": activityCount['activityCount'],
            "activities": activities,
            "isFriend": isFriend,
            "friends": friends,
            "groups": groups
        }), 200

    except mysql.connector.Error as err:
        # Handle database connection or query errors
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"detail": f"Unexpected error occurred: {e}"}), 500

@app.route('/setProfile', methods=['POST'])
def setProfile():
    data = ProfileSet(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            INSERT INTO userProfile (username, bio, profile_picture)
            VALUES (%s, %s, %s)
        """, (
            data.username,
            data.bio,
            data.profile
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Profile data stored successfully"}), 200
    except mysql.connector.Error as err:
        # Handle database connection or query errors
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"detail": f"Unexpected error occurred: {e}"}), 500
    
@app.route('/search', methods=['POST'])
def search():
    data = searchReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userProfile WHERE username = %s", (data.search,))
        user = cursor.fetchone()
        
        cursor.execute("SELECT * FROM group_profile WHERE group_name = %s", (data.search,))
        group = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) AS Member_count FROM group_members WHERE group_name = %s", (data.search,))
        memberCount = cursor.fetchone()
        if memberCount is None:
            memberCount = {'Member_count': 0}

        cursor.close()
        conn.close()
        if user:
            return jsonify({
                "message": "data retrieved successfully",
                "user": user
            }), 200
        if group:
            return jsonify({
                "message": "data retrieved successfully",
                "group": group,
                'memberCount': memberCount
            }), 200
    except mysql.connector.Error as err:
        # Handle database connection or query errors
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"detail": f"Unexpected error occurred: {e}"}), 500

@app.route('/groupProfile', methods=['POST'])
def groupProfile():
    data = IsFriendReq(**request.json)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM group_profile WHERE group_name = %s", (data.user2_usn,))
        group = cursor.fetchone()

        cursor.execute("""
            SELECT * FROM group_members
            WHERE user_username = %s and group_name = %s
        """, (data.user_usn, data.user2_usn))
        member = cursor.fetchone()
        isMember = bool(member)

        cursor.execute("""
            SELECT * FROM group_members
            WHERE group_name = %s
        """, (data.user2_usn,))
        members = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify({
            "message": "group data retrieved successfully",
            "isMember": isMember,
            "members": members,
            "group": group
        }), 200
    
    except mysql.connector.Error as err:
        # Handle database connection or query errors
        return jsonify({"detail": f"Database error occurred: {err}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"detail": f"Unexpected error occurred: {e}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)