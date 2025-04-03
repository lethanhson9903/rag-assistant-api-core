
import React, { useEffect, useRef, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import { Button } from "@/components/ui/button";
import { Conversation, Message, Tag } from "@/types/api";
import { mockApi, conversationApi, tagApi } from "@/services/api";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

interface ChatContextType {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, setConversations } = useOutletContext<ChatContextType>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // In a real app, we would use tagApi.getTags()
        // For demo purposes, we're using mock data
        setTags(mockApi.mockTags());
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // In a real app, we would use conversationApi.getMessages(id)
        // For demo purposes, we're using mock data
        setMessages(mockApi.mockMessages());
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load conversation messages");
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (id) {
      fetchMessages();
    } else {
      setInitialLoadComplete(true);
    }
  }, [id]);

  useEffect(() => {
    if (messages.length && initialLoadComplete) {
      scrollToBottom();
    }
  }, [messages, initialLoadComplete]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string, contextFilter?: string) => {
    if (!content.trim()) return;
    
    // If there's no conversation yet, create one
    let conversationId = id;
    if (!conversationId) {
      try {
        // In a real app, we would create a new conversation
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
          created_at: new Date().toISOString(),
          message_count: 0
        };
        
        // Add to conversations list
        setConversations([newConversation, ...conversations]);
        conversationId = newConversation.id;
        navigate(`/chat/${conversationId}`);
      } catch (error) {
        console.error("Failed to create conversation:", error);
        toast.error("Failed to create new conversation");
        return;
      }
    }
    
    // Add user message immediately
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      role: "user",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Scroll to the bottom to show the new message
    setTimeout(scrollToBottom, 100);
    
    setLoading(true);
    
    try {
      // In a real app, we would send the message to the API
      // const response = await conversationApi.sendMessage(content, conversationId, contextFilter);
      
      // For demo purposes, create a simulated response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          content: generateResponse(content),
          role: "assistant",
          created_at: new Date().toISOString(),
          sources: content.toLowerCase().includes("rag") ? mockApi.mockMessages(1)[0].sources : [],
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
        
        // Update conversation list with new message count
        setConversations((prev) => 
          prev.map((conv) => 
            conv.id === conversationId 
              ? { ...conv, message_count: (conv.message_count || 0) + 2 }
              : conv
          )
        );
        
        // Scroll to the bottom to show the new message
        setTimeout(scrollToBottom, 100);
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  // Simple response generator for the demo
  const generateResponse = (query: string): string => {
    if (query.toLowerCase().includes("rag")) {
      return "RAG (Retrieval-Augmented Generation) combines a retrieval system with a generative model. It first retrieves relevant documents from a corpus and then generates text based on both the query and the retrieved information.\n\nThis approach has several advantages:\n\n1. It provides more accurate and factual responses\n2. It can cite sources for its information\n3. It reduces hallucinations common in pure generative models\n4. It allows the model to access specific knowledge without retraining";
    }
    
    if (query.toLowerCase().includes("hello") || query.toLowerCase().includes("hi")) {
      return "Hello! How can I help you today? You can ask me questions about documents in your knowledge base.";
    }
    
    if (query.toLowerCase().includes("document") || query.toLowerCase().includes("upload")) {
      return "You can upload documents through the Documents section. The system currently supports PDF, text, Markdown, HTML, and DOCX files. After uploading, documents are processed and indexed to make their content searchable.";
    }
    
    if (query.toLowerCase().includes("tag")) {
      return "Tags help you organize your documents and filter context when asking questions. You can create tags with custom colors and assign them to documents. When chatting, you can select a tag to focus the assistant's answers on documents with that tag.";
    }
    
    return "I'm your RAG Assistant, built to help you work with your documents. You can ask me questions about any uploaded documents, and I'll provide answers with source citations.\n\nTo get the most out of me:\n\n- Upload documents in the Documents section\n- Organize them with tags\n- Ask specific questions about their content\n- Use the tag filter when you want to focus on particular document types";
  };

  return (
    <div className="flex flex-col h-full">
      {!loading && messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <div className="max-w-md text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to RAG Assistant</h2>
            <p className="text-muted-foreground">
              Ask questions about your documents and get accurate, sourced answers.
            </p>
          </div>
          <Button
            onClick={() => {
              const welcomeMessage = "Hi! What can you help me with?";
              handleSendMessage(welcomeMessage);
            }}
          >
            Start a Conversation
          </Button>
        </div>
      )}

      {loading && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {/* This empty div is used to scroll to the bottom of the chat */}
          <div ref={messagesEndRef} />
        </div>
      )}

      <ChatInput onSendMessage={handleSendMessage} isLoading={loading} tags={tags} />
    </div>
  );
};

export default Chat;
