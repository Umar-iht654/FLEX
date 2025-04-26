from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.core.auth import get_current_user
from app.models.group import Group, group_members
from app.models.user import User
from app.schemas.group import GroupCreate, GroupUpdate, GroupResponse

group_router = APIRouter()

@group_router.post("/groups", response_model=GroupResponse)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = Group(
        **group.dict(),
        created_by=current_user.id
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@group_router.get("/groups", response_model=List[GroupResponse])
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Group).all()

@group_router.put("/groups/{group_id}", response_model=GroupResponse)
def update_group(
    group_id: int,
    group_update: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    if group.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in group_update.dict(exclude_unset=True).items():
        setattr(group, field, value)

    db.commit()
    db.refresh(group)
    return group

@group_router.post("/groups/{group_id}/join")
def join_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    exists = db.query(group_members).filter(
        group_members.c.group_id == group_id,
        group_members.c.user_id == current_user.id
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already a member")

    db.execute(
        group_members.insert().values(group_id=group_id, user_id=current_user.id, role="member")
    )
    db.commit()
    return {"message": "Joined group successfully"}

@group_router.post("/groups/{group_id}/leave")
def leave_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.execute(
        group_members.delete().where(
            group_members.c.group_id == group_id,
            group_members.c.user_id == current_user.id
        )
    )
    db.commit()
    return {"message": "Left group successfully"} 