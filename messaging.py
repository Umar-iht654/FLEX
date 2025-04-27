from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import UserNotFoundError, UnauthorizedAccessError
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse

class MessagingService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_messages(self, user_id: int) -> List[Message]:
        """Get all messages for a user"""
        return self.db.query(Message).filter(
            (Message.sender_id == user_id) | (Message.receiver_id == user_id)
        ).all()

    def get_conversation(self, user_id: int, other_user_id: int) -> List[Message]:
        """Get conversation between two users"""
        return self.db.query(Message).filter(
            ((Message.sender_id == user_id) & (Message.receiver_id == other_user_id)) |
            ((Message.sender_id == other_user_id) & (Message.receiver_id == user_id))
        ).order_by(Message.created_at).all()

    def send_message(self, message: MessageCreate, sender_id: int) -> Message:
        """Send a new message"""
        # Verify receiver exists
        receiver = self.db.query(User).filter(User.id == message.receiver_id).first()
        if not receiver:
            raise UserNotFoundError()

        db_message = Message(
            **message.dict(),
            sender_id=sender_id
        )
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        return db_message

    def delete_message(self, message_id: int, user_id: int) -> None:
        """Delete a message"""
        db_message = self.db.query(Message).filter(
            Message.id == message_id,
            (Message.sender_id == user_id | Message.receiver_id == user_id)
        ).first()
        
        if not db_message:
            raise UnauthorizedAccessError()
            
        self.db.delete(db_message)
        self.db.commit()

    def get_message_by_id(self, message_id: int, user_id: int) -> Message:
        """Get a specific message by ID"""
        message = self.db.query(Message).filter(
            Message.id == message_id,
            (Message.sender_id == user_id | Message.receiver_id == user_id)
        ).first()
        
        if not message:
            raise UnauthorizedAccessError()
            
        return message 