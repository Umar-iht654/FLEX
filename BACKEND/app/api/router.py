from flask import Blueprint
from app.api.endpoints import auth, users, activities, recommendations, messaging, group, progress, registration

def register_blueprints(app):
    # Create blueprints
    api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
    
    # Register blueprints
    api_bp.register_blueprint(auth.bp, url_prefix='/auth')
    api_bp.register_blueprint(users.bp, url_prefix='/users')
    api_bp.register_blueprint(activities.bp, url_prefix='/activities')
    api_bp.register_blueprint(recommendations.bp, url_prefix='/recommendations')
    api_bp.register_blueprint(messaging.bp, url_prefix='/messaging')
    api_bp.register_blueprint(group.bp, url_prefix='/groups')
    api_bp.register_blueprint(progress.bp, url_prefix='/progress')
    api_bp.register_blueprint(registration.bp, url_prefix='/register')
    
    # Register the main API blueprint
    app.register_blueprint(api_bp) 
    