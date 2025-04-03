// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "curator" | "admin";
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

// Chat Types
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  message_count?: number;
}

export interface Source {
  id: string;
  title: string;
  page?: number;
  content: string;
  score: number;
  documentId: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  sources?: Source[];
  user_avatar?: string;
  user_name?: string;
}

export interface ConversationDetails {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Document Types
export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: "processed" | "processing" | "failed" | "pending";
  created_at: string;
  updated_at: string;
  user_id: string;
  tags: Tag[];
}

export interface DocumentStatus {
  id: string;
  status: "processed" | "processing" | "failed" | "pending";
  progress: number;
  error?: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Settings Types
export interface LLMSettings {
  id: string;
  provider: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  api_key: string;
  api_base?: string;
  is_active: boolean;
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  is_default: boolean;
}

export interface EmbeddingSettings {
  id: string;
  provider: string;
  model_name: string;
  dimensions: number;
  api_key: string;
  api_base?: string;
  is_active: boolean;
}

export interface ChunkingSettings {
  id: string;
  chunk_size: number;
  chunk_overlap: number;
  strategy: "fixed" | "paragraph" | "sentence" | "recursive" | "custom";
  separator?: string;
  custom_split_logic?: string;
  metadata_extraction: boolean;
  is_active: boolean;
}

export interface VectorDBSettings {
  id: string;
  provider: string;
  connection_string: string;
  api_key: string;
  environment?: string;
  collection_name: string;
  dimensions: number;
  metric: "cosine" | "euclidean" | "dot";
  use_hybrid_search: boolean;
  use_metadata_filtering: boolean;
  is_active: boolean;
}
