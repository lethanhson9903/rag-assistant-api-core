
"""Conversation schema definitions."""
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ConversationBase(BaseModel):
    """Base conversation schema."""
    title: str

class ConversationCreate(ConversationBase):
    """Conversation creation schema."""
    pass

class ConversationUpdate(BaseModel):
    """Conversation update schema."""
    title: Optional[str] = None

class ConversationInDB(ConversationBase):
    """Conversation database schema."""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(ConversationBase):
    """Conversation response schema."""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    message_count: Optional[int] = None

class ConversationDetails(ConversationInDB):
    """Conversation details schema."""
    pass
