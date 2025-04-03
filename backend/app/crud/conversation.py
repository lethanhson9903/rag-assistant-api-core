
"""CRUD operations for conversation management."""
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.base import Conversation as ConversationModel, Message as MessageModel
from app.schemas.conversation import ConversationCreate

def create_conversation(
    db: Session, conversation: ConversationCreate, user_id: str
) -> ConversationModel:
    """Create a new conversation."""
    db_conversation = ConversationModel(
        title=conversation.title,
        user_id=user_id
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def get_conversations(
    db: Session, user_id: str, page: int = 1, page_size: int = 20
) -> Tuple[List[ConversationModel], int]:
    """Get paginated conversations for a user."""
    # Count total conversations for the user
    total = db.query(func.count(ConversationModel.id)).filter(
        ConversationModel.user_id == user_id
    ).scalar()
    
    # Get conversations with message count
    conversations_with_count = db.query(
        ConversationModel, 
        func.count(MessageModel.id).label("message_count")
    ).outerjoin(
        MessageModel
    ).filter(
        ConversationModel.user_id == user_id
    ).group_by(
        ConversationModel.id
    ).order_by(
        ConversationModel.updated_at.desc()
    ).offset(
        (page - 1) * page_size
    ).limit(
        page_size
    ).all()
    
    # Merge message count into conversations
    result = []
    for conv, msg_count in conversations_with_count:
        conv.message_count = msg_count
        result.append(conv)
    
    return result, total

def get_conversation_by_id(db: Session, conversation_id: str) -> Optional[ConversationModel]:
    """Get a specific conversation by ID."""
    return db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()

def delete_conversation(db: Session, conversation_id: str) -> bool:
    """Delete a conversation and its messages."""
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id
    ).first()
    
    if not conversation:
        return False
        
    db.delete(conversation)
    db.commit()
    return True
