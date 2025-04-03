
"""Settings schema definitions."""
from typing import List, Optional
from pydantic import BaseModel, Field

class LLMSettingsBase(BaseModel):
    """Base LLM settings schema."""
    provider: Optional[str] = None
    model_name: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    top_p: Optional[float] = None
    frequency_penalty: Optional[float] = None
    presence_penalty: Optional[float] = None
    api_key: Optional[str] = None
    api_base: Optional[str] = None
    is_active: Optional[bool] = None

class LLMSettingsCreate(LLMSettingsBase):
    """LLM settings creation schema."""
    provider: str
    model_name: str
    max_tokens: int
    temperature: float
    top_p: float
    frequency_penalty: float
    presence_penalty: float
    api_key: str

class LLMSettingsUpdate(LLMSettingsBase):
    """LLM settings update schema."""
    pass

class LLMSettingsResponse(LLMSettingsBase):
    """LLM settings response schema."""
    id: str
    api_key: str = Field(..., description="API key, masked")

    class Config:
        from_attributes = True

class EmbeddingSettingsBase(BaseModel):
    """Base embedding settings schema."""
    provider: Optional[str] = None
    model_name: Optional[str] = None
    dimensions: Optional[int] = None
    api_key: Optional[str] = None
    api_base: Optional[str] = None
    is_active: Optional[bool] = None

class EmbeddingSettingsCreate(EmbeddingSettingsBase):
    """Embedding settings creation schema."""
    provider: str
    model_name: str
    dimensions: int
    api_key: str

class EmbeddingSettingsUpdate(EmbeddingSettingsBase):
    """Embedding settings update schema."""
    pass

class EmbeddingSettingsResponse(EmbeddingSettingsBase):
    """Embedding settings response schema."""
    id: str
    api_key: str = Field(..., description="API key, masked")

    class Config:
        from_attributes = True

class ChunkingSettingsBase(BaseModel):
    """Base chunking settings schema."""
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    strategy: Optional[str] = None
    separator: Optional[str] = None
    custom_split_logic: Optional[str] = None
    metadata_extraction: Optional[bool] = None
    is_active: Optional[bool] = None

class ChunkingSettingsCreate(ChunkingSettingsBase):
    """Chunking settings creation schema."""
    chunk_size: int
    chunk_overlap: int
    strategy: str

class ChunkingSettingsUpdate(ChunkingSettingsBase):
    """Chunking settings update schema."""
    pass

class ChunkingSettingsResponse(ChunkingSettingsBase):
    """Chunking settings response schema."""
    id: str

    class Config:
        from_attributes = True

class VectorDBSettingsBase(BaseModel):
    """Base vector DB settings schema."""
    provider: Optional[str] = None
    connection_string: Optional[str] = None
    api_key: Optional[str] = None
    environment: Optional[str] = None
    collection_name: Optional[str] = None
    dimensions: Optional[int] = None
    metric: Optional[str] = None
    use_hybrid_search: Optional[bool] = None
    use_metadata_filtering: Optional[bool] = None
    is_active: Optional[bool] = None

class VectorDBSettingsCreate(VectorDBSettingsBase):
    """Vector DB settings creation schema."""
    provider: str
    connection_string: str
    collection_name: str
    dimensions: int
    metric: str = "cosine"

class VectorDBSettingsUpdate(VectorDBSettingsBase):
    """Vector DB settings update schema."""
    pass

class VectorDBSettingsResponse(VectorDBSettingsBase):
    """Vector DB settings response schema."""
    id: str
    connection_string: str = Field(..., description="Connection string, masked")
    api_key: Optional[str] = Field(None, description="API key, masked")

    class Config:
        from_attributes = True

class SystemPromptBase(BaseModel):
    """Base system prompt schema."""
    name: str
    content: str
    description: Optional[str] = None
    is_default: Optional[bool] = False

class SystemPromptCreate(SystemPromptBase):
    """System prompt creation schema."""
    pass

class SystemPromptUpdate(BaseModel):
    """System prompt update schema."""
    name: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    is_default: Optional[bool] = None

class SystemPromptResponse(SystemPromptBase):
    """System prompt response schema."""
    id: str

    class Config:
        from_attributes = True
