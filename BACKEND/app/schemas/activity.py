from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ActivityParticipant(BaseModel):
    user_id: int
    team: Optional[str] = None
    score: Optional[float] = None

class ActivityBase(BaseModel):
    name: str
    description: Optional[str] = None
    activity_type: str
    location: str
    latitude: float
    longitude: float
    start_time: datetime
    end_time: datetime
    max_participants: Optional[int] = None

class ActivityCreate(ActivityBase):
    participants: List[ActivityParticipant]

class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_participants: Optional[int] = None

class ActivityResponse(ActivityBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    participants: List[ActivityParticipant]

    class Config:
        from_attributes = True

class ActivityList(BaseModel):
    activities: List[ActivityResponse]
    total: int
    page: int
    size: int 