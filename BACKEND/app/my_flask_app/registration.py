from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, EmailStr, validator
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
class EmailRequest(BaseModel):
    email: EmailStr

class UsernameRequest(BaseModel):
    username: str

class PasswordRequest(BaseModel):
    password: str

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

@app.route('/')
def home():
    return 'Welcome to the Flask app!'

@app.route('/checkEmail', methods=['POST'])
def checkEmail():
    data = EmailRequest(**request.json)
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM userDetails WHERE email = %s", (data.email,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if result:
        return jsonify({"detail": "Email already registered"}), 400
    return jsonify({"message": "email is available"})

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

if __name__ == '__main__':
    app.run(debug=True)