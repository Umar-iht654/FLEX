from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    receiver_id: int

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    content: Optional[str] = None

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    created_at: datetime
    updated_at: datetime
    is_read: bool = False

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    messages: List[MessageResponse]
    other_user_id: int
    other_user_name: str

class MessageList(BaseModel):
    messages: List[MessageResponse]
    total: int
    page: int
    size: int 