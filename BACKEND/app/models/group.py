from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

# Association table for many-to-many relationship between users and groups
user_group = Table(
    "user_group",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("group_id", Integer, ForeignKey("groups.id"))
)

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))

    # Relationships
    members = relationship("User", secondary=user_group, back_populates="groups")
    messages = relationship("Message", back_populates="group")
    creator = relationship("User", foreign_keys=[created_by]) 