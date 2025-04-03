
"""User schema definitions."""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    """Base user schema."""
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    """User creation schema."""
    email: EmailStr
    name: str
    password: str = Field(..., min_length=8)
    role: str = "user"

class UserUpdate(UserBase):
    """User update schema."""
    password: Optional[str] = Field(None, min_length=8)

class UserInDB(UserBase):
    """User database schema."""
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDB):
    """User response schema."""
    pass

class UserWithPassword(UserInDB):
    """User schema with password hash."""
    password_hash: str
