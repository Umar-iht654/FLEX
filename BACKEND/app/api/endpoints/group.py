from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.core.auth import get_current_user
from app.models.group import Group, group_members
from app.models.user import User
from app.schemas.group import GroupCreate, GroupUpdate, GroupResponse

bp = Blueprint('groups', __name__)

@bp.route("/", methods=['POST'])
def create_group():
    db = next(get_db())
    current_user = get_current_user()
    data = request.get_json()
    group = GroupCreate(**data)
    
    db_group = Group(
        **group.dict(),
        created_by=current_user.id
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return jsonify(GroupResponse.from_orm(db_group).dict())

@bp.route("/", methods=['GET'])
def list_groups():
    db = next(get_db())
    current_user = get_current_user()
    groups = db.query(Group).all()
    return jsonify([GroupResponse.from_orm(g).dict() for g in groups])

@bp.route("/<int:group_id>", methods=['PUT'])
def update_group(group_id):
    db = next(get_db())
    current_user = get_current_user()
    data = request.get_json()
    group_update = GroupUpdate(**data)
    
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return jsonify({"error": "Group not found"}), 404
    if group.created_by != current_user.id:
        return jsonify({"error": "Not authorized"}), 403

    for field, value in group_update.dict(exclude_unset=True).items():
        setattr(group, field, value)

    db.commit()
    db.refresh(group)
    return jsonify(GroupResponse.from_orm(group).dict())

@bp.route("/<int:group_id>/join", methods=['POST'])
def join_group(group_id):
    db = next(get_db())
    current_user = get_current_user()
    
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return jsonify({"error": "Group not found"}), 404

    exists = db.query(group_members).filter(
        group_members.c.group_id == group_id,
        group_members.c.user_id == current_user.id
    ).first()
    if exists:
        return jsonify({"error": "Already a member"}), 400

    db.execute(
        group_members.insert().values(group_id=group_id, user_id=current_user.id, role="member")
    )
    db.commit()
    return jsonify({"message": "Joined group successfully"})

@bp.route("/<int:group_id>/leave", methods=['POST'])
def leave_group(group_id):
    db = next(get_db())
    current_user = get_current_user()
    
    db.execute(
        group_members.delete().where(
            group_members.c.group_id == group_id,
            group_members.c.user_id == current_user.id
        )
    )
    db.commit()
    return jsonify({"message": "Left group successfully"}) 