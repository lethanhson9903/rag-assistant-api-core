
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Conversation, User } from "@/types/api";
import { Outlet, useNavigate } from "react-router-dom";
import { authApi, conversationApi, mockApi } from "@/services/api";
import { toast } from "sonner";
import LoginForm from "../auth/LoginForm";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

const AppLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      // In a real app, we would use authApi.getCurrentUser()
      // For demo purposes with no backend, we're setting a mock user
      setUser({
        id: "user-1",
        name: "Demo User",
        email: "user@example.com",
        role: "user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
      });
      
      // In a real app, we would use conversationApi.getConversations()
      // For demo purposes, we're using mock data
      setConversations(mockApi.mockConversations());
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load user data");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    fetchUserData();
  }, []);

  const handleLogin = () => {
    fetchUserData();
    navigate("/chat");
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setConversations([]);
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleCreateConversation = async () => {
    try {
      // In a real app, we would use conversationApi.createConversation()
      // For demo purposes, we're adding a mock conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: "New Conversation",
        created_at: new Date().toISOString(),
        message_count: 0
      };
      
      setConversations([newConversation, ...conversations]);
      navigate(`/chat/${newConversation.id}`);
      toast.success("New conversation created");
    } catch (error) {
      toast.error("Failed to create new conversation");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-muted/50">
        <h1 className="text-3xl font-bold mb-6">RAG Assistant</h1>
        <LoginForm onLoginSuccess={handleLogin} />
        <p className="mt-6 text-sm text-muted-foreground">
          Don't have an account? Use demo credentials: user@example.com / password
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        user={user} 
        conversations={conversations} 
        onLogout={handleLogout} 
        onCreateConversation={handleCreateConversation}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ user, conversations, setConversations }} />
        </div>
      </div>
      
      {/* Mobile new conversation button */}
      <div className="md:hidden fixed bottom-4 right-4">
        <Button
          onClick={handleCreateConversation}
          className="rounded-full w-12 h-12 p-0 shadow-lg"
        >
          <PlusIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AppLayout;
