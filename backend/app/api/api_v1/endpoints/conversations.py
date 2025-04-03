
"""Conversation management endpoints."""
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.schemas.conversation import (
    ConversationCreate, 
    ConversationResponse, 
    ConversationDetails
)
from app.schemas.pagination import PaginatedResponse
from app.schemas.user import User
from app.api.deps import get_current_user, get_db
from app.crud.conversation import (
    create_conversation,
    get_conversations,
    get_conversation_by_id,
    delete_conversation
)

router = APIRouter()

@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_new_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create a new conversation.
    """
    return create_conversation(db=db, conversation=conversation, user_id=current_user.id)

@router.get("", response_model=PaginatedResponse[ConversationResponse])
def list_conversations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve conversations for the current user.
    """
    conversations, total = get_conversations(
        db=db, 
        user_id=current_user.id,
        page=page,
        page_size=page_size
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "items": conversations,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

@router.get("/{conversation_id}", response_model=ConversationDetails)
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get conversation details by ID.
    """
    conversation = get_conversation_by_id(db=db, conversation_id=conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    # Check if user owns this conversation or is admin
    if conversation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conversation"
        )
        
    return conversation

@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """
    Delete a conversation.
    """
    conversation = get_conversation_by_id(db=db, conversation_id=conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    # Check if user owns this conversation or is admin
    if conversation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this conversation"
        )
        
    delete_conversation(db=db, conversation_id=conversation_id)
