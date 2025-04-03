
import { AuthResponse, Conversation, Document, Message, PaginatedResponse, Source, Tag } from "@/types/api";
import { toast } from "sonner";

const API_BASE_URL = "/api/v1";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.detail || "An error occurred";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

// Get authorization header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refresh_token);
    }
    return data;
  },
  
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {
        // Ignore errors on logout
      });
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
  
  getCurrentUser: async (): Promise<AuthResponse["user"]> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  refreshToken: async (): Promise<{ token: string; refresh_token: string }> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refresh_token);
    }
    return data;
  },
};

// Conversations API
export const conversationApi = {
  createConversation: async (title: string): Promise<Conversation> => {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },
  
  getConversations: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Conversation>> => {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversations?page=${page}&page_size=${pageSize}`,
      { headers: getAuthHeader() }
    );
    return handleResponse(response);
  },
  
  getConversation: async (id: string): Promise<Conversation> => {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  deleteConversation: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  getMessages: async (conversationId: string, page = 1, pageSize = 50): Promise<PaginatedResponse<Message>> => {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversations/${conversationId}/messages?page=${page}&page_size=${pageSize}`,
      { headers: getAuthHeader() }
    );
    return handleResponse(response);
  },
  
  sendMessage: async (
    message: string,
    conversationId: string,
    contextFilter?: string
  ): Promise<{ id: string; content: string; sources: Source[]; conversation_id: string }> => {
    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        ...(contextFilter && { context_filter: contextFilter }),
      }),
    });
    return handleResponse(response);
  },
  
  submitFeedback: async (
    messageId: string,
    feedbackType: "positive" | "negative",
    feedbackCategory?: string,
    feedbackText?: string
  ): Promise<{ id: string; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/chat/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        message_id: messageId,
        feedback_type: feedbackType,
        ...(feedbackCategory && { feedback_category: feedbackCategory }),
        ...(feedbackText && { feedback_text: feedbackText }),
      }),
    });
    return handleResponse(response);
  },
};

// Documents API
export const documentApi = {
  getDocuments: async (
    page = 1,
    pageSize = 10,
    search?: string,
    tagId?: string,
    status?: string
  ): Promise<PaginatedResponse<Document>> => {
    let url = `${API_BASE_URL}/documents?page=${page}&page_size=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (tagId) url += `&tag_id=${tagId}`;
    if (status) url += `&status=${status}`;
    
    const response = await fetch(url, { headers: getAuthHeader() });
    return handleResponse(response);
  },
  
  uploadDocument: async (
    file: File,
    title?: string,
    description?: string,
    tags?: string[]
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (tags && tags.length) formData.append("tags", tags.join(","));
    
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(response);
  },
  
  getDocument: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  updateDocument: async (
    id: string,
    updates: { title?: string; description?: string; tags?: string[] }
  ): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },
  
  deleteDocument: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  getDocumentStatus: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/status`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
  
  reprocessDocument: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/reprocess`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
};

// Tags API
export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      headers: getAuthHeader(),
    });
    const data = await handleResponse(response);
    return data.items;
  },
  
  createTag: async (
    name: string,
    color: string,
    description?: string
  ): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        name,
        color,
        ...(description && { description }),
      }),
    });
    return handleResponse(response);
  },
  
  updateTag: async (
    id: string,
    updates: { name?: string; color?: string; description?: string }
  ): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },
  
  deleteTag: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
};

// Mock API implementation for development
export const mockApi = {
  // Mock data generators for development
  mockConversations: (count = 5): Conversation[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `conv-${i}`,
      title: `Conversation ${i + 1}`,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 43200000).toISOString(),
      message_count: Math.floor(Math.random() * 20) + 1,
    }));
  },
  
  mockMessages: (count = 10): Message[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `msg-${i}`,
      content: i % 2 === 0
        ? `This is a user question ${i + 1}. How does RAG work?`
        : `This is a response ${i + 1}. RAG (Retrieval-Augmented Generation) combines a retrieval system with a generative model. It first retrieves relevant documents from a corpus and then generates text based on both the query and the retrieved information.`,
      role: i % 2 === 0 ? "user" : "assistant",
      created_at: new Date(Date.now() - (count - i) * 60000).toISOString(),
      sources: i % 2 === 0 ? [] : [
        {
          id: `source-${i}-1`,
          title: "Introduction to RAG",
          page: 12,
          content: "RAG combines retrieval systems with generative AI models.",
          score: 0.92,
          documentId: "doc-1"
        },
        {
          id: `source-${i}-2`,
          title: "Advanced RAG Techniques",
          page: 45,
          content: "Modern RAG systems often use vector databases for efficient retrieval.",
          score: 0.87,
          documentId: "doc-2"
        }
      ],
    }));
  },
  
  mockDocuments: (count = 8): Document[] => {
    const types = ["application/pdf", "text/plain", "text/markdown", "text/html"];
    const statuses: ("processed" | "processing" | "failed" | "pending")[] = ["processed", "processing", "failed", "pending"];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `doc-${i}`,
      title: `Document ${i + 1}`,
      description: i % 2 === 0 ? `Description for document ${i + 1}` : undefined,
      file_name: `file-${i + 1}.${types[i % types.length].split('/')[1]}`,
      file_size: Math.floor(Math.random() * 1000000) + 10000,
      mime_type: types[i % types.length],
      status: statuses[i % statuses.length],
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 43200000).toISOString(),
      user_id: "user-1",
      tags: i % 3 === 0 ? [] : [
        {
          id: `tag-${i % 5}`,
          name: `Tag ${i % 5 + 1}`,
          color: ["red", "blue", "green", "purple", "orange"][i % 5],
        }
      ],
    }));
  },
  
  mockTags: (): Tag[] => {
    const colors = ["#FF5733", "#33A8FF", "#33FF57", "#CB33FF", "#FFC533"];
    return Array.from({ length: 5 }, (_, i) => ({
      id: `tag-${i}`,
      name: `Tag ${i + 1}`,
      color: colors[i],
      description: i % 2 === 0 ? `Description for tag ${i + 1}` : undefined,
    }));
  }
};
