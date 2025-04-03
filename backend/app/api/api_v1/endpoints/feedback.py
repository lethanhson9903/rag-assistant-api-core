
"""Message feedback endpoints."""
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.message import FeedbackCreate, FeedbackResponse
from app.schemas.user import User
from app.api.deps import get_current_user, get_db
from app.crud.message import get_message_by_id, create_feedback

router = APIRouter()

@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Submit feedback for a message.
    """
    # Check if message exists
    message = get_message_by_id(db=db, message_id=feedback.message_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Validate feedback type
    if feedback.feedback_type not in ["positive", "negative"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback type must be 'positive' or 'negative'"
        )
    
    # Create feedback record
    feedback_record = create_feedback(
        db=db,
        feedback=feedback
    )
    
    return {
        "id": feedback_record.id,
        "status": "success"
    }
