from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class EmailRequest(BaseModel):
    email: str

class UsernameRequest(BaseModel):
    username: str

class PasswordRequest(BaseModel):
    password: str

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    username: Optional[str] = None

class UserCreate(UserBase):
    username: str
    email: EmailStr
    postcode: str
    DOB: str
    address: str
    full_name: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 
