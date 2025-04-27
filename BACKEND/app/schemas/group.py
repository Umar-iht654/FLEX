from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GroupMember(BaseModel):
    user_id: int
    role: str

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    activity_type: str
    location: str
    latitude: float
    longitude: float
    is_private: bool = False

class GroupCreate(GroupBase):
    members: List[GroupMember]

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_private: Optional[bool] = None

class GroupResponse(GroupBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    members: List[GroupMember]

    class Config:
        from_attributes = True

class GroupList(BaseModel):
    groups: List[GroupResponse]
    total: int
    page: int
    size: int 