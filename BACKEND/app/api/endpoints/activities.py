from datetime import datetime, timezone
from typing import List
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.core.auth import get_current_user
from app.models.activity import Activity, activity_participants
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from app.models.user import User

bp = Blueprint('activities', __name__)

@bp.route('/', methods=['POST'])
def create_activity():
    """
    Create a new activity.
    
    Args:
        activity: ActivityCreate schema containing activity details
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        ActivityResponse: The created activity object
    
    Raises:
        HTTPException: If there's an error creating the activity
    """
    db = next(get_db())
    data = request.get_json()
    activity = ActivityCreate(**data)
    db_activity = Activity(
        name=activity.name,
        description=activity.description,
        activity_type=activity.activity_type,
        location=activity.location,
        latitude=activity.latitude,
        longitude=activity.longitude,
        start_time=activity.start_time,
        end_time=activity.end_time,
        max_participants=activity.max_participants,
        created_by=current_user.id
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return jsonify(ActivityResponse.from_orm(db_activity).dict()), 201

@bp.route('/', methods=['GET'])
def get_activities():
    """
    Get a list of all activities with pagination support.
    
    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        List[ActivityResponse]: List of activity objects
    """
    db = next(get_db())
    skip = request.args.get('skip', 0, type=int)
    limit = request.args.get('limit', 100, type=int)
    activities = db.query(Activity).offset(skip).limit(limit).all()
    return jsonify([ActivityResponse.from_orm(a).dict() for a in activities])

@bp.route('/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    """
    Get a specific activity by its ID.
    
    Args:
        activity_id: ID of the activity to retrieve
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        ActivityResponse: The requested activity object
    
    Raises:
        HTTPException: If activity is not found
    """
    db = next(get_db())
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        return jsonify({"detail": "Activity not found"}), 404
    return jsonify(ActivityResponse.from_orm(activity).dict())

@bp.route('/<int:activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """
    Update an existing activity.
    
    Args:
        activity_id: ID of the activity to update
        activity_update: ActivityUpdate schema containing fields to update
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        ActivityResponse: The updated activity object
    
    Raises:
        HTTPException: If activity is not found or user is not authorized
    """
    db = next(get_db())
    activity_update = request.get_json()
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        return jsonify({"detail": "Activity not found"}), 404
    
    if activity.created_by != current_user.id:
        return jsonify({"detail": "Not authorized to update this activity"}), 403
    
    for field, value in activity_update.items():
        setattr(activity, field, value)
    
    activity.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(activity)
    return jsonify(ActivityResponse.from_orm(activity).dict())

@bp.route('/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    """
    Delete an activity.
    
    Args:
        activity_id: ID of the activity to delete
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        dict: Success message
    
    Raises:
        HTTPException: If activity is not found or user is not authorized
    """
    db = next(get_db())
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        return jsonify({"detail": "Activity not found"}), 404
    
    if activity.created_by != current_user.id:
        return jsonify({"detail": "Not authorized to delete this activity"}), 403
    
    db.delete(activity)
    db.commit()
    return jsonify({"message": "Activity deleted successfully"})

@bp.route('/<int:activity_id>/join', methods=['POST'])
def join_activity(activity_id):
    """
    Join an activity as a participant.
    
    Args:
        activity_id: ID of the activity to join
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        dict: Success message
    
    Raises:
        HTTPException: If activity is not found, full, or user is already a participant
    """
    db = next(get_db())
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        return jsonify({"detail": "Activity not found"}), 404
    
    current_participants = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id
    ).count()
    
    if current_participants >= activity.max_participants:
        return jsonify({"detail": "Activity is full"}), 400
    
    existing_participant = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id,
        activity_participants.c.user_id == current_user.id
    ).first()
    
    if existing_participant:
        return jsonify({"detail": "Already joined this activity"}), 400
    
    db.execute(
        activity_participants.insert().values(
            activity_id=activity_id,
            user_id=current_user.id
        )
    )
    db.commit()
    return jsonify({"message": "Successfully joined activity"})

@bp.route('/<int:activity_id>/leave', methods=['POST'])
def leave_activity(activity_id):
    """
    Leave an activity as a participant.
    
    Args:
        activity_id: ID of the activity to leave
        db: Database session
        current_user: Currently authenticated user
    
    Returns:
        dict: Success message
    
    Raises:
        HTTPException: If activity is not found or user is not a participant
    """
    db = next(get_db())
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        return jsonify({"detail": "Activity not found"}), 404
    
    existing_participant = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id,
        activity_participants.c.user_id == current_user.id
    ).first()
    
    if not existing_participant:
        return jsonify({"detail": "Not a participant of this activity"}), 400
    
    db.execute(
        activity_participants.delete().where(
            activity_participants.c.activity_id == activity_id,
            activity_participants.c.user_id == current_user.id
        )
    )
    db.commit()
    return jsonify({"message": "Successfully left activity"}) 