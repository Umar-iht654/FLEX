from flask import Flask
from flask_cors import CORS
from app.config.settings import get_settings
from app.config.database import db
from app.api.router import register_blueprints
from app.api.endpoints import activities

# Load settings
settings = get_settings()

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, 
     resources={r"/*": {
         "origins": settings.CORS_ORIGINS,
         "supports_credentials": settings.CORS_CREDENTIALS,
         "methods": settings.CORS_METHODS,
         "allow_headers": settings.CORS_HEADERS
     }})

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register blueprints
register_blueprints(app)
app.register_blueprint(activities.bp, url_prefix='/activities')

@app.route('/')
def root():
    return {"message": "Welcome to FLEX API"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True) 