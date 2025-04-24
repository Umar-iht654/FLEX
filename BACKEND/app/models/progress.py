from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_type = Column(String)  # e.g., "push-ups", "running", etc.
    value = Column(Float)  # e.g., number of reps, distance, etc.
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="progress_entries")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_type = Column(String)
    target_value = Column(Float)
    deadline = Column(DateTime)
    current_value = Column(Float, default=0)
    is_completed = Column(Integer, default=0)  # 0 = not completed, 1 = completed

    user = relationship("User", back_populates="goals") 