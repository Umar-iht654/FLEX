from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

# Association table for group members
group_members = Table(
    "group_members",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id")),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("role", String, default="member")  # member, admin, etc.
)

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    activity_type = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    is_private = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User")
    members = relationship("User", secondary=group_members, back_populates="groups")
    messages = relationship("Message", back_populates="group") 
    
    