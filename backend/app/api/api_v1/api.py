
"""Main API router for all endpoints."""
from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    auth, 
    users, 
    conversations, 
    messages,
    feedback,
    documents, 
    tags,
    settings,
    roles
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(conversations.router, prefix="/chat/conversations", tags=["Conversations"])
api_router.include_router(messages.router, prefix="/chat", tags=["Messages"])
api_router.include_router(feedback.router, prefix="/chat", tags=["Feedback"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(tags.router, prefix="/tags", tags=["Tags"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
