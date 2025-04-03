
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Loader2Icon } from "lucide-react";
import { Tag } from "@/types/api";

interface ChatInputProps {
  onSendMessage: (message: string, contextFilter?: string) => Promise<void>;
  isLoading: boolean;
  tags: Tag[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, tags }) => {
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, selectedTag || undefined);
      setMessage("");
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="text-sm text-muted-foreground pt-1">
              Filter context:
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedTag(null)}
              >
                All Documents
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedTag(tag.id)}
                  style={{
                    backgroundColor: selectedTag === tag.id ? tag.color : undefined,
                    borderColor: selectedTag !== tag.id ? tag.color : undefined,
                    color: selectedTag === tag.id ? "#fff" : undefined,
                  }}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="relative">
          <Textarea
            placeholder="Ask a question..."
            className="resize-none pr-14 min-h-24 max-h-48"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            className="absolute right-2 bottom-2"
            size="icon"
            disabled={!message.trim() || isLoading}
            onClick={handleSendMessage}
          >
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          The assistant uses your documents to provide information.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
