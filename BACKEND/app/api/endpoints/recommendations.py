from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.recommender import Recommender
from app.core.security import get_current_user
from FLEX.backend.app.models.user import User

router = APIRouter()
recommender = Recommender()

@router.get("/")
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    radius_km: float = 5.0,
    days_ahead: int = 7
):
    """Get personalized recommendations"""
    try:
        recommendations = recommender.get_recommendations(
            user_id=current_user.id,
            db=db,
            num_recommendations=5
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting recommendations: {str(e)}"
        )

@router.post("/update-location")
async def update_user_location(
    latitude: float,
    longitude: float,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's location"""
    try:
        user_location = db.query(UserLocation).filter(
            UserLocation.user_id == current_user.id
        ).first()

        if user_location:
            user_location.latitude = latitude
            user_location.longitude = longitude
        else:
            user_location = UserLocation(
                user_id=current_user.id,
                latitude=latitude,
                longitude=longitude
            )
            db.add(user_location)

        db.commit()
        return {"message": "Location updated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating location: {str(e)}"
        ) 