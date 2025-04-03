
"""SQLAlchemy models declaration."""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Table, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    """Generate a UUID string."""
    return str(uuid.uuid4())

# Association table for document-tag many-to-many relationship
document_tags = Table(
    "document_tags",
    Base.metadata,
    Column("document_id", String, ForeignKey("documents.id"), primary_key=True),
    Column("tag_id", String, ForeignKey("tags.id"), primary_key=True),
)

# Association table for tag-role many-to-many relationship
tag_access = Table(
    "tag_access",
    Base.metadata,
    Column("tag_id", String, ForeignKey("tags.id"), primary_key=True),
    Column("role", String, primary_key=True),
)

class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")
    avatar = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime)
    
    conversations = relationship("Conversation", back_populates="user")
    documents = relationship("Document", back_populates="user")

class Conversation(Base):
    """Conversation model."""
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    """Message model."""
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    content = Column(Text, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    conversation = relationship("Conversation", back_populates="messages")
    sources = relationship("Source", back_populates="message", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="message", uselist=False, cascade="all, delete-orphan")

class Source(Base):
    """Document source for message context."""
    __tablename__ = "sources"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    message_id = Column(String, ForeignKey("messages.id"), nullable=False)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    title = Column(String)
    content = Column(Text, nullable=False)
    page = Column(Integer)
    score = Column(Float, nullable=False)
    
    message = relationship("Message", back_populates="sources")
    document = relationship("Document")

class Feedback(Base):
    """Feedback for message responses."""
    __tablename__ = "feedback"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    message_id = Column(String, ForeignKey("messages.id"), nullable=False, unique=True)
    feedback_type = Column(String, nullable=False)  # positive or negative
    feedback_category = Column(String)
    feedback_text = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    
    message = relationship("Message", back_populates="feedback")

class Document(Base):
    """Document model."""
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text)
    file_name = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    storage_path = Column(String)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="documents")
    tags = relationship("Tag", secondary=document_tags, back_populates="documents")
    status_updates = relationship("DocumentStatus", back_populates="document", cascade="all, delete-orphan")

class DocumentStatus(Base):
    """Document processing status."""
    __tablename__ = "document_status"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    status = Column(String, nullable=False)
    progress = Column(Float, default=0.0)
    error = Column(Text)
    updated_at = Column(DateTime, server_default=func.now())
    
    document = relationship("Document", back_populates="status_updates")

class Tag(Base):
    """Tag model."""
    __tablename__ = "tags"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    color = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    documents = relationship("Document", secondary=document_tags, back_populates="tags")
    allowed_roles = relationship("TagAccess", back_populates="tag", cascade="all, delete-orphan")

class TagAccess(Base):
    """Tag access control by role."""
    __tablename__ = "tag_access"
    
    tag_id = Column(String, ForeignKey("tags.id"), primary_key=True)
    role = Column(String, primary_key=True)
    
    tag = relationship("Tag", back_populates="allowed_roles")

class LLMSettings(Base):
    """LLM configuration settings."""
    __tablename__ = "llm_settings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    provider = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    max_tokens = Column(Integer, nullable=False)
    temperature = Column(Float, nullable=False)
    top_p = Column(Float, nullable=False)
    frequency_penalty = Column(Float, nullable=False)
    presence_penalty = Column(Float, nullable=False)
    api_key = Column(String, nullable=False)
    api_base = Column(String)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class EmbeddingSettings(Base):
    """Embedding model configuration."""
    __tablename__ = "embedding_settings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    provider = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    dimensions = Column(Integer, nullable=False)
    api_key = Column(String, nullable=False)
    api_base = Column(String)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ChunkingSettings(Base):
    """Document chunking configuration."""
    __tablename__ = "chunking_settings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    chunk_size = Column(Integer, nullable=False)
    chunk_overlap = Column(Integer, nullable=False)
    strategy = Column(String, nullable=False)
    separator = Column(String)
    custom_split_logic = Column(Text)
    metadata_extraction = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class VectorDBSettings(Base):
    """Vector database configuration."""
    __tablename__ = "vectordb_settings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    provider = Column(String, nullable=False)
    connection_string = Column(String, nullable=False)
    api_key = Column(String)
    environment = Column(String)
    collection_name = Column(String, nullable=False)
    dimensions = Column(Integer, nullable=False)
    metric = Column(String, nullable=False, default="cosine")
    use_hybrid_search = Column(Boolean, default=False)
    use_metadata_filtering = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class SystemPrompt(Base):
    """System prompts for the assistant."""
    __tablename__ = "system_prompts"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    content = Column(Text, nullable=False)
    description = Column(Text)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
