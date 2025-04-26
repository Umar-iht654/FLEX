from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    group_id: Optional[int] = None
    recipient_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    content: Optional[str] = None
    is_read: Optional[bool] = None
    is_pinned: Optional[bool] = None

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    is_read: bool
    is_pinned: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    messages: List[MessageResponse]
    other_user_id: int
    other_user_name: str

class MessageList(BaseModel):
    messages: list[MessageResponse]
    total: int
    page: int
    size: int 