from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime, timezone

# Association table for user interests
user_interests = Table(
    "user_interests",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("activity_type", String)
)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    activity_type = Column(String)  # e.g., "running", "cycling", "yoga", etc.
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    max_participants = Column(Integer)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    creator = relationship("User", foreign_keys=[created_by])
    participants = relationship("User", secondary="activity_participants")

# Association table for activity participants
activity_participants = Table(
    "activity_participants",
    Base.metadata,
    Column("activity_id", Integer, ForeignKey("activities.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class UserLocation(Base):
    __tablename__ = "user_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="location") 