from flask import Blueprint, request, jsonify, abort
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.services.user import UserService

bp = Blueprint('users', __name__)

@bp.route("/me", methods=['GET'])
def read_current_user():
    current_user = get_current_user()  # Implement this
    return jsonify(UserResponse.from_orm(current_user).dict())

@bp.route("/me", methods=['PUT'])
def update_current_user():
    db = next(get_db())
    current_user = get_current_user()  # Implement this
    data = request.get_json()
    user_update = UserUpdate(**data)
    
    user_service = UserService(db)
    try:
        updated_user = user_service.update_user(current_user.id, user_update)
        return jsonify(UserResponse.from_orm(updated_user).dict())
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@bp.route("/<int:user_id>", methods=['GET'])
def read_user(user_id):
    db = next(get_db())
    current_user = get_current_user()  # Implement this
    
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(UserResponse.from_orm(user).dict())

@bp.route("/", methods=['GET'])
def list_users():
    db = next(get_db())
    current_user = get_current_user()  # Implement this
    skip = request.args.get('skip', 0, type=int)
    limit = request.args.get('limit', 100, type=int)
    
    user_service = UserService(db)
    users = user_service.list_users(skip=skip, limit=limit)
    return jsonify([UserResponse.from_orm(u).dict() for u in users])
