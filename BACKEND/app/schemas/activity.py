from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: str
    location: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_participants: Optional[int] = None
    is_public: bool = True

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_participants: Optional[int] = None
    is_public: Optional[bool] = None

class ActivityResponse(ActivityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    current_participants: int = 0

    class Config:
        from_attributes = True

class ActivityList(BaseModel):
    activities: List[ActivityResponse]
    total: int
    page: int
    size: int 