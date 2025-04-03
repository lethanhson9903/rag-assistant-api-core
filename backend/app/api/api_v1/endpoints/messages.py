
"""Message management endpoints."""
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.schemas.message import MessageCreate, Message, MessageResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.user import User
from app.api.deps import get_current_user, get_db
from app.crud.conversation import get_conversation_by_id
from app.crud.message import create_message, get_messages
from app.services.rag import process_query

router = APIRouter()

@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_create: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Send a new message in a conversation.
    """
    # Check if conversation exists and user has access
    conversation = get_conversation_by_id(db=db, conversation_id=message_create.conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    if conversation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conversation"
        )
    
    # Save user message
    user_message = create_message(
        db=db,
        content=message_create.message,
        role="user",
        conversation_id=message_create.conversation_id
    )
    
    # Process message with RAG and get response
    response_content, sources = await process_query(
        db=db,
        query=message_create.message,
        conversation_id=message_create.conversation_id,
        context_filter=message_create.context_filter
    )
    
    # Save assistant response
    assistant_message = create_message(
        db=db,
        content=response_content,
        role="assistant",
        conversation_id=message_create.conversation_id,
        sources=sources
    )
    
    return {
        "id": assistant_message.id,
        "content": assistant_message.content,
        "sources": sources,
        "conversation_id": message_create.conversation_id
    }

@router.get("/conversations/{conversation_id}/messages", response_model=PaginatedResponse[Message])
def get_conversation_messages(
    conversation_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get messages from a conversation.
    """
    # Check if conversation exists and user has access
    conversation = get_conversation_by_id(db=db, conversation_id=conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    if conversation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conversation"
        )
    
    messages, total = get_messages(
        db=db,
        conversation_id=conversation_id,
        page=page,
        page_size=page_size
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    # Enrich messages with user information for user messages
    for message in messages:
        if message.role == "user":
            message.user_name = current_user.name
            message.user_avatar = current_user.avatar
    
    return {
        "items": messages,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }
