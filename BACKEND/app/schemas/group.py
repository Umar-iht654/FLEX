from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GroupMember(BaseModel):
    user_id: int

class GroupBase(BaseModel):
    name: str
    bio: Optional[str] = None
    activity_type: str

class GroupCreate(GroupBase):
    users: List[GroupMember]

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    activity_type: Optional[str] = None
    is_private: Optional[bool] = None

class GroupResponse(GroupBase):
    id: int
    created_by: int
    member_count: int
    created_at: datetime
    updated_at: datetime
    users: List[GroupMember]

    class Config:
        from_attributes = True

class GroupList(BaseModel):
    groups: List[GroupResponse]
    total: int
    page: int
    size: int 