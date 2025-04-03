
"""Document schema definitions."""
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.schemas.tag import Tag

class DocumentBase(BaseModel):
    """Base document schema."""
    title: str
    description: Optional[str] = None

class DocumentCreate(DocumentBase):
    """Document creation schema."""
    file_name: str
    file_size: int
    mime_type: str
    tags: Optional[List[str]] = []

class DocumentUpdate(BaseModel):
    """Document update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class DocumentInDB(DocumentBase):
    """Document database schema."""
    id: str
    file_name: str
    file_size: int
    mime_type: str
    status: str
    storage_path: Optional[str] = None
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentResponse(DocumentInDB):
    """Document response schema."""
    tags: List[Tag] = []

class DocumentStatus(BaseModel):
    """Document status schema."""
    id: str
    status: str
    progress: float = 0.0
    error: Optional[str] = None
    updated_at: datetime

class ProcessingDetails(BaseModel):
    """Document processing details."""
    chunk_count: int
    embedding_model: str
    error_message: Optional[str] = None

class DocumentDetails(DocumentResponse):
    """Document details with processing info."""
    processing_details: Optional[ProcessingDetails] = None
