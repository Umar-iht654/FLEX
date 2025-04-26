from Backend.app.api.v1.endpoints import group
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, activities, recommendations, messaging
from Backend.app.api.v1.endpoints import progress

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(activities.router, prefix="/activities", tags=["activities"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(messaging.router, prefix="/messaging", tags=["messaging"])
api_router.include_router(group.group_router, prefix="/groups", tags=["groups"])
api_router.include_router(progress.progress_router, prefix="/progress", tags=["progress"]) 
