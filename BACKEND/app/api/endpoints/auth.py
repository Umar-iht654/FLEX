from datetime import timedelta
from flask import Blueprint, request, jsonify, abort
from werkzeug.exceptions import Unauthorized, BadRequest
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.config.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.auth import AuthService

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    form_data = request.form
    db = next(get_db())
    auth_service = AuthService(db)
    
    try:
        user = auth_service.authenticate_user(form_data.get('username'), form_data.get('password'))
        return jsonify(auth_service.create_access_token_for_user(user))
    except Exception as e:
        abort(401, description="Incorrect email or password")

@bp.route('/register', methods=['POST'])
def register():
    """
    Register new user.
    """
    data = request.get_json()
    db = next(get_db())
    auth_service = AuthService(db)
    
    try:
        user_create = UserCreate(**data)
        user = auth_service.create_user(user_create)
        return jsonify(UserResponse.from_orm(user).dict())
    except ValueError as e:
        abort(400, description=str(e))

@bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout user (invalidate token).
    """
    return jsonify({"message": "Successfully logged out"})
