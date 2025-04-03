
"""CRUD operations for message management."""
from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.base import (
    Message as MessageModel,
    Source as SourceModel,
    Feedback as FeedbackModel
)
from app.schemas.message import FeedbackCreate, SourceBase

def create_message(
    db: Session, 
    content: str, 
    role: str, 
    conversation_id: str,
    sources: List[SourceBase] = None
) -> MessageModel:
    """Create a new message."""
    db_message = MessageModel(
        content=content,
        role=role,
        conversation_id=conversation_id
    )
    db.add(db_message)
    db.flush()  # Flush to get the ID without committing
    
    # Add sources if provided (for assistant messages)
    if sources and role == "assistant":
        for source in sources:
            db_source = SourceModel(
                message_id=db_message.id,
                document_id=source.documentId,
                title=source.title,
                content=source.content,
                page=source.page,
                score=source.score
            )
            db.add(db_source)
    
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages(
    db: Session, 
    conversation_id: str,
    page: int = 1,
    page_size: int = 50
) -> Tuple[List[MessageModel], int]:
    """Get paginated messages for a conversation."""
    # Count total messages in this conversation
    total = db.query(func.count(MessageModel.id)).filter(
        MessageModel.conversation_id == conversation_id
    ).scalar()
    
    # Get messages with related sources
    messages = db.query(MessageModel).filter(
        MessageModel.conversation_id == conversation_id
    ).order_by(
        MessageModel.created_at.desc()  # Most recent first
    ).offset(
        (page - 1) * page_size
    ).limit(
        page_size
    ).all()
    
    # Load sources for each message
    for message in messages:
        message.sources = db.query(SourceModel).filter(
            SourceModel.message_id == message.id
        ).all()
    
    return messages, total

def get_message_by_id(db: Session, message_id: str) -> Optional[MessageModel]:
    """Get a specific message by ID."""
    return db.query(MessageModel).filter(MessageModel.id == message_id).first()

def create_feedback(db: Session, feedback: FeedbackCreate) -> FeedbackModel:
    """Create or update feedback for a message."""
    # Check if feedback already exists
    existing = db.query(FeedbackModel).filter(
        FeedbackModel.message_id == feedback.message_id
    ).first()
    
    if existing:
        # Update existing feedback
        existing.feedback_type = feedback.feedback_type
        existing.feedback_category = feedback.feedback_category
        existing.feedback_text = feedback.feedback_text
        db.commit()
        db.refresh(existing)
        return existing
    
    # Create new feedback
    db_feedback = FeedbackModel(
        message_id=feedback.message_id,
        feedback_type=feedback.feedback_type,
        feedback_category=feedback.feedback_category,
        feedback_text=feedback.feedback_text
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback
