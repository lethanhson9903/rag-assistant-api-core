
"""Message schema definitions."""
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class SourceBase(BaseModel):
    """Base source schema."""
    title: str
    content: str
    score: float
    documentId: str
    page: Optional[int] = None

class SourceCreate(SourceBase):
    """Source creation schema."""
    pass

class SourceInDB(SourceBase):
    """Source database schema."""
    id: str
    message_id: str

    class Config:
        from_attributes = True

class Source(SourceBase):
    """Source response schema."""
    id: str

class MessageBase(BaseModel):
    """Base message schema."""
    content: str
    role: str

class MessageCreate(BaseModel):
    """Message creation schema."""
    message: str
    conversation_id: str
    context_filter: Optional[str] = None

class MessageInDB(MessageBase):
    """Message database schema."""
    id: str
    conversation_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Message(MessageBase):
    """Message response schema."""
    id: str
    created_at: datetime
    sources: Optional[List[Source]] = []
    user_avatar: Optional[str] = None
    user_name: Optional[str] = None

class MessageResponse(BaseModel):
    """Message send response schema."""
    id: str
    content: str
    sources: List[Source] = []
    conversation_id: str

class FeedbackBase(BaseModel):
    """Base feedback schema."""
    message_id: str
    feedback_type: str
    feedback_category: Optional[str] = None
    feedback_text: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    """Feedback creation schema."""
    pass

class FeedbackInDB(FeedbackBase):
    """Feedback database schema."""
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackResponse(BaseModel):
    """Feedback response schema."""
    id: str
    status: str = "success"
