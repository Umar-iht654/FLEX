from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.config.database import get_db
from app.core.auth import get_current_user
from app.models.progress import Progress, Goal
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressResponse, GoalCreate, GoalResponse

progress_router = APIRouter()

@progress_router.post("/progress", response_model=ProgressResponse)
def log_progress(
    progress: ProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_progress = Progress(
        user_id=current_user.id,
        exercise_type=progress.exercise_type,
        value=progress.value,
        timestamp=datetime.utcnow(),
        notes=progress.notes
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

@progress_router.get("/progress", response_model=List[ProgressResponse])
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Progress).filter(Progress.user_id == current_user.id).all()

@progress_router.post("/goals", response_model=GoalResponse)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = Goal(
        user_id=current_user.id,
        exercise_type=goal.exercise_type,
        target_value=goal.target_value,
        deadline=goal.deadline
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@progress_router.get("/goals", response_model=List[GoalResponse])
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all() 