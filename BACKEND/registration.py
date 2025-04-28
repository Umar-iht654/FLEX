from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, EmailStr, validator
import mysql.connector
import re
import requests
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

    #osa's part in flask
    




@app.route('/info', methods=['GET'])
def info():
    # get address from query string
    address = request.args.get('address')
    if not address:
        return jsonify({'error': 'please provide an address'}), 400

    #----------------------------------------- opencage: convert address to coordinates -----------------------------------------
    apiKey = "5177f41a694a4a10bd7db683866c7640" # group email key
    url = f"https://api.opencagedata.com/geocode/v1/json?q={address}&key={apiKey}"

    response1 = requests.get(url)

    if response1.status_code == 200:
        data = response1.json()
        lat = data['results'][0]['geometry']['lat']
        lon = data['results'][0]['geometry']['lng']
    else:
        return jsonify({'error': 'failed to fetch location'}), 500

    #------------------------------------ find local parks nearby ---------------------------------------------------------

    url2 = "https://api.foursquare.com/v3/places/search"
    apiKey2 = "fsq3Xp9MV8U6C4teXNl4xgCQIOlMgoYBXECyr3WYxCihwsI=" # foursquare key
    params2 = {
        'query': 'parks',
        'll': f'{lat},{lon}',
        'radius': '10000',
        'limit': '15'
    }
    headers = {
        'Authorization': apiKey2
    }

    response2 = requests.get(url2, params=params2, headers=headers)

    parks = []
    if response2.status_code == 200:
        data2 = response2.json()
        for place in data2['results']:
            if place['categories'][0]['name'] == 'Park':
                parks.append(place['name'])
    else:
        parks = [] # just leave empty if it fails

    #--------------------------------------- get weather forecast -------------------------------------------------------------

    apiKey3 = '21e0e952188c9da791bc5a2ce37c1b83' # openweathermap key
    url3 = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey3}'

    response3 = requests.get(url3)

    weather = []
    if response3.status_code == 200:
        data3 = response3.json()
        weather_list = data3['list']
        count = 0
        for item in weather_list:
            count += 1
            temp = item['main']['temp'] - 273.15 # kelvin to celsius
            temp = round(temp)
            desc = item['weather'][0]['main']
            time = item['dt_txt']
            weather.append({
                'time': time,
                'temp': temp,
                'description': desc
            })
            if count == 7: # show next 21 hours
                break
    else:
        weather = []

    # final response
    return jsonify({
        'lat': lat,
        'lon': lon,
        'parks': parks,
        'weather': weather
    })




if __name__ == '__main__':
    app.run(debug=True)
