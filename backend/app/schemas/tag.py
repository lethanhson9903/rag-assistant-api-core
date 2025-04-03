
"""Tag schema definitions."""
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TagBase(BaseModel):
    """Base tag schema."""
    name: str
    color: str
    description: Optional[str] = None

class TagCreate(TagBase):
    """Tag creation schema."""
    pass

class TagUpdate(BaseModel):
    """Tag update schema."""
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None

class TagInDB(TagBase):
    """Tag database schema."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Tag(TagBase):
    """Tag response schema."""
    id: str

class TagDetails(TagInDB):
    """Tag details schema."""
    document_count: int = 0

class TagAccess(BaseModel):
    """Tag access schema."""
    tag_id: str
    roles: List[str]

class TagAccessUpdate(BaseModel):
    """Tag access update schema."""
    roles: List[str]
