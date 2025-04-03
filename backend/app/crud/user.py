
"""CRUD operations for user management."""
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.security import verify_password, get_password_hash
from app.db.base import User as UserModel
from app.schemas.user import UserCreate, UserUpdate, User

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    user = db.query(UserModel).filter(UserModel.email == email).first()
    return user

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Get user by ID."""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    return user

def create_user(db: Session, user: UserCreate) -> User:
    """Create new user."""
    db_user = UserModel(
        email=user.email,
        name=user.name,
        password_hash=get_password_hash(user.password),
        role=user.role,
        avatar=user.avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user: UserUpdate) -> Optional[User]:
    """Update user info."""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        return None
        
    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    """Delete user."""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        return False
        
    db.delete(db_user)
    db.commit()
    return True

def authenticate(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user."""
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def update_last_login(db: Session, user_id: str) -> None:
    """Update user's last login timestamp."""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user:
        db_user.last_login = datetime.utcnow()
        db.commit()
