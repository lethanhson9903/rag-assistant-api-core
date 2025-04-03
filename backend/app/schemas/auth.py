
"""Authentication schema definitions."""
from typing import Optional
from pydantic import BaseModel

from app.schemas.user import User

class Token(BaseModel):
    """Token schema."""
    token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """Token payload schema."""
    sub: Optional[str] = None
    type: Optional[str] = None

class LoginRequest(BaseModel):
    """Login request schema."""
    email: str
    password: str

class RefreshRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str

class AuthResponse(BaseModel):
    """Authentication response schema."""
    token: str
    refresh_token: str
    user: User
