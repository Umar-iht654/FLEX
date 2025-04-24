from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import ActivityNotFoundError, UnauthorizedAccessError
from app.models.activity import Activity
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse

class ActivityService:
    def __init__(self, db: Session):
        self.db = db

    def get_activity(self, activity_id: int, user_id: int) -> Activity:
        """Get a specific activity by ID"""
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
        if not activity:
            raise ActivityNotFoundError()
        if activity.user_id != user_id:
            raise UnauthorizedAccessError()
        return activity

    def get_user_activities(self, user_id: int) -> List[Activity]:
        """Get all activities for a user"""
        return self.db.query(Activity).filter(Activity.user_id == user_id).all()

    def create_activity(self, activity: ActivityCreate, user_id: int) -> Activity:
        """Create a new activity"""
        db_activity = Activity(
            **activity.dict(),
            user_id=user_id
        )
        self.db.add(db_activity)
        self.db.commit()
        self.db.refresh(db_activity)
        return db_activity

    def update_activity(self, activity_id: int, activity_update: ActivityUpdate, user_id: int) -> Activity:
        """Update an existing activity"""
        db_activity = self.get_activity(activity_id, user_id)
        
        update_data = activity_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_activity, field, value)
        
        self.db.commit()
        self.db.refresh(db_activity)
        return db_activity

    def delete_activity(self, activity_id: int, user_id: int) -> None:
        """Delete an activity"""
        db_activity = self.get_activity(activity_id, user_id)
        self.db.delete(db_activity)
        self.db.commit() 