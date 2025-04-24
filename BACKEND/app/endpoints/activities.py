from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from FLEX.backend.app.config.database import get_db
from app.core.auth import get_current_user
from app.models.activity import Activity, activity_participants
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from FLEX.backend.app.models.user import User

router = APIRouter()

@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    return db_activity

@router.get("/", response_model=List[ActivityResponse])
def get_activities(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    activities = db.query(Activity).offset(skip).limit(limit).all()
    return activities

@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    activity_update: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    db_activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    if db_activity.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this activity")
    
    for field, value in activity_update.dict(exclude_unset=True).items():
        setattr(db_activity, field, value)
    
    db_activity.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/{activity_id}")
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    db_activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    if db_activity.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this activity")
    
    db.delete(db_activity)
    db.commit()
    return {"message": "Activity deleted successfully"}

@router.post("/{activity_id}/join")
def join_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    current_participants = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id
    ).count()
    
    if current_participants >= activity.max_participants:
        raise HTTPException(status_code=400, detail="Activity is full")
    
    existing_participant = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id,
        activity_participants.c.user_id == current_user.id
    ).first()
    
    if existing_participant:
        raise HTTPException(status_code=400, detail="Already joined this activity")
    
    db.execute(
        activity_participants.insert().values(
            activity_id=activity_id,
            user_id=current_user.id
        )
    )
    db.commit()
    return {"message": "Successfully joined activity"}

@router.post("/{activity_id}/leave")
def leave_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    existing_participant = db.query(activity_participants).filter(
        activity_participants.c.activity_id == activity_id,
        activity_participants.c.user_id == current_user.id
    ).first()
    
    if not existing_participant:
        raise HTTPException(status_code=400, detail="Not a participant of this activity")
    
    db.execute(
        activity_participants.delete().where(
            activity_participants.c.activity_id == activity_id,
            activity_participants.c.user_id == current_user.id
        )
    )
    db.commit()
    return {"message": "Successfully left activity"} 