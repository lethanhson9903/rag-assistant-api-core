
"""Initialize database with default data."""
import os
import sys
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.base import Base, User, LLMSettings, EmbeddingSettings, ChunkingSettings, VectorDBSettings, SystemPrompt
from app.db.session import engine, SessionLocal
from app.core.security import get_password_hash

def init_db() -> None:
    """Initialize database with required tables and default data."""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    create_default_data(db)
    db.close()

def create_default_data(db: Session) -> None:
    """Create default data in the database."""
    # Create admin user if none exists
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            name="Admin User",
            password_hash=get_password_hash("adminpassword"),
            role="admin"
        )
        db.add(admin)
        
    # Create default LLM settings if none exist
    llm = db.query(LLMSettings).first()
    if not llm:
        llm = LLMSettings(
            provider="openai",
            model_name="gpt-3.5-turbo",
            max_tokens=1000,
            temperature=0.7,
            top_p=0.95,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            api_key="sk-placeholder",
            is_active=True
        )
        db.add(llm)
        
    # Create default embedding settings if none exist
    emb = db.query(EmbeddingSettings).first()
    if not emb:
        emb = EmbeddingSettings(
            provider="openai",
            model_name="text-embedding-ada-002",
            dimensions=1536,
            api_key="sk-placeholder",
            is_active=True
        )
        db.add(emb)
        
    # Create default chunking settings if none exist
    chunking = db.query(ChunkingSettings).first()
    if not chunking:
        chunking = ChunkingSettings(
            chunk_size=1000,
            chunk_overlap=200,
            strategy="paragraph",
            metadata_extraction=True,
            is_active=True
        )
        db.add(chunking)
        
    # Create default vector DB settings if none exist
    vectordb = db.query(VectorDBSettings).first()
    if not vectordb:
        vectordb = VectorDBSettings(
            provider="chroma",
            connection_string="local",
            collection_name="rag_assistant",
            dimensions=1536,
            metric="cosine",
            use_hybrid_search=False,
            use_metadata_filtering=True,
            is_active=True
        )
        db.add(vectordb)
        
    # Create default system prompt if none exists
    sys_prompt = db.query(SystemPrompt).filter(SystemPrompt.is_default == True).first()
    if not sys_prompt:
        sys_prompt = SystemPrompt(
            name="Default System Prompt",
            content=(
                "You are a helpful RAG Assistant that provides accurate information based on the provided context. "
                "If you don't know the answer or can't find relevant information in the context, "
                "acknowledge that you don't have enough information to answer correctly. "
                "Always cite your sources when providing information."
            ),
            description="Default system prompt for the RAG Assistant",
            is_default=True
        )
        db.add(sys_prompt)
    
    db.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized with default data!")
