from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import UserNotFoundError, UnauthorizedAccessError
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.recommendation import RecommendationCreate, RecommendationResponse

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_recommendations(self, user_id: int) -> List[Recommendation]:
        """Get all recommendations for a user"""
        return self.db.query(Recommendation).filter(Recommendation.user_id == user_id).all()

    def create_recommendation(self, recommendation: RecommendationCreate, user_id: int) -> Recommendation:
        """Create a new recommendation"""
        db_recommendation = Recommendation(
            **recommendation.dict(),
            user_id=user_id
        )
        self.db.add(db_recommendation)
        self.db.commit()
        self.db.refresh(db_recommendation)
        return db_recommendation

    def delete_recommendation(self, recommendation_id: int, user_id: int) -> None:
        """Delete a recommendation"""
        db_recommendation = self.db.query(Recommendation).filter(
            Recommendation.id == recommendation_id,
            Recommendation.user_id == user_id
        ).first()
        
        if not db_recommendation:
            raise UnauthorizedAccessError()
            
        self.db.delete(db_recommendation)
        self.db.commit()

    def get_recommendation_by_id(self, recommendation_id: int, user_id: int) -> Recommendation:
        """Get a specific recommendation by ID"""
        recommendation = self.db.query(Recommendation).filter(
            Recommendation.id == recommendation_id,
            Recommendation.user_id == user_id
        ).first()
        
        if not recommendation:
            raise UnauthorizedAccessError()
            
        return recommendation 