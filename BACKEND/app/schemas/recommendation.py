from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RecommendationBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: str
    reason: str
    priority: int = 1

class RecommendationCreate(RecommendationBase):
    pass

class RecommendationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    reason: Optional[str] = None
    priority: Optional[int] = None

class RecommendationResponse(RecommendationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_completed: bool = False

    class Config:
        from_attributes = True

class RecommendationList(BaseModel):
    recommendations: List[RecommendationResponse]
    total: int
    page: int
    size: int 