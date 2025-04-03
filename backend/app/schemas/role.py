
"""Role schema definitions."""
from pydantic import BaseModel

class Role(BaseModel):
    """Role schema."""
    id: str
    name: str
    description: str
