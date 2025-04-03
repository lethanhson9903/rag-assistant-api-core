
import React from "react";
import { Conversation, User } from "@/types/api";
import { NavLink } from "react-router-dom";
import {
  BookTextIcon,
  FileTextIcon,
  LogOutIcon,
  MessagesSquareIcon,
  PlusIcon,
  SettingsIcon,
  TagIcon,
  UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarProps {
  user: User;
  conversations: Conversation[];
  onLogout: () => Promise<void>;
  onCreateConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  conversations,
  onLogout,
  onCreateConversation,
  isOpen,
  onToggle,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:relative",
          isOpen ? "w-64" : "w-0 md:w-16"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {isOpen && <h1 className="text-lg font-bold">RAG Assistant</h1>}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto text-sidebar-foreground hover:bg-sidebar-accent",
              !isOpen && "mx-auto"
            )}
            onClick={onToggle}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-2">
            <Button
              onClick={onCreateConversation}
              className={cn(
                "w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                !isOpen && "p-2 w-10 h-10 mx-auto"
              )}
            >
              <PlusIcon className="mr-2" size={16} />
              {isOpen && "New Chat"}
            </Button>
          </div>

          <nav className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-2">
              <div className="space-y-1 py-2">
                {isOpen ? (
                  <p className="text-xs font-medium text-sidebar-foreground/60 px-2 py-1">
                    CONVERSATIONS
                  </p>
                ) : (
                  <div className="h-4" />
                )}
                {conversations.map((conversation) => (
                  <NavLink
                    key={conversation.id}
                    to={`/chat/${conversation.id}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80",
                        !isOpen && "justify-center px-1"
                      )
                    }
                  >
                    {isOpen ? (
                      <>
                        <MessagesSquareIcon size={16} />
                        <span className="truncate">{conversation.title}</span>
                      </>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <MessagesSquareIcon size={16} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right">{conversation.title}</TooltipContent>
                      </Tooltip>
                    )}
                  </NavLink>
                ))}
              </div>
            </ScrollArea>
          </nav>

          <div className="border-t border-sidebar-border p-2">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80",
                      !isOpen && "justify-center px-1"
                    )
                  }
                >
                  {isOpen ? (
                    <>
                      <FileTextIcon size={16} />
                      <span>Documents</span>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <FileTextIcon size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">Documents</TooltipContent>
                    </Tooltip>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tags"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80",
                      !isOpen && "justify-center px-1"
                    )
                  }
                >
                  {isOpen ? (
                    <>
                      <TagIcon size={16} />
                      <span>Tags</span>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TagIcon size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">Tags</TooltipContent>
                    </Tooltip>
                  )}
                </NavLink>
              </li>
              {user.role === "admin" && (
                <li>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80",
                        !isOpen && "justify-center px-1"
                      )
                    }
                  >
                    {isOpen ? (
                      <>
                        <SettingsIcon size={16} />
                        <span>Settings</span>
                      </>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <SettingsIcon size={16} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                      </Tooltip>
                    )}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          <div className="border-t border-sidebar-border p-2 mt-auto">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md",
                isOpen ? "justify-between" : "justify-center"
              )}
            >
              {isOpen ? (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {user.avatar && (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <p className="text-xs font-medium leading-none">{user.name}</p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    onClick={onLogout}
                  >
                    <LogOutIcon size={16} />
                  </Button>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      onClick={onLogout}
                    >
                      <LogOutIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 md:hidden"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
