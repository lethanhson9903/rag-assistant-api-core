
import React, { useState } from "react";
import { Message } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, ThumbsDownIcon, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { conversationApi } from "@/services/api";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showSources, setShowSources] = useState(false);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);

  const handleFeedback = async (type: "positive" | "negative") => {
    try {
      setFeedback(type);
      // In a real app we would call the API
      // await conversationApi.submitFeedback(message.id, type);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setFeedback(null);
    }
  };

  const hasSources = message.sources && message.sources.length > 0;

  return (
    <div
      className={cn(
        "py-5 px-4 md:px-6",
        message.role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <Avatar className="h-8 w-8 rounded-md">
            {message.role === "assistant" ? (
              <AvatarImage src="/robot-avatar.png" alt="Assistant" />
            ) : (
              message.user_avatar && <AvatarImage src={message.user_avatar} alt={message.user_name || "User"} />
            )}
            <AvatarFallback className="rounded-md bg-primary text-primary-foreground">
              {message.role === "assistant" ? "AI" : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow space-y-2">
          <div className="font-medium text-sm">
            {message.role === "assistant" ? "AI Assistant" : message.user_name || "You"}
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content.split("\n").map((paragraph, i) => (
              <p key={i} className={paragraph.trim() === "" ? "h-4" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {message.role === "assistant" && (
            <div className="flex flex-col space-y-2 pt-2">
              {hasSources && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 gap-1"
                    onClick={() => setShowSources(!showSources)}
                  >
                    {showSources ? (
                      <>
                        <ChevronUp size={14} />
                        Hide Sources ({message.sources!.length})
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        Show Sources ({message.sources!.length})
                      </>
                    )}
                  </Button>
                  
                  {showSources && (
                    <div className="mt-2 space-y-2">
                      {message.sources!.map((source) => (
                        <div
                          key={source.id}
                          className="bg-muted rounded-md p-3 text-sm border"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{source.title}</div>
                            <div className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              Score: {Math.round(source.score * 100)}%
                            </div>
                          </div>
                          {source.page && (
                            <div className="text-xs text-muted-foreground mb-1">
                              Page {source.page}
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            "{source.content}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant={feedback === "positive" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs h-7 px-2 gap-1",
                    feedback === "positive" && "bg-green-600 hover:bg-green-700"
                  )}
                  onClick={() => handleFeedback("positive")}
                  disabled={feedback !== null}
                >
                  <ThumbsUpIcon size={14} />
                  Helpful
                </Button>
                <Button
                  variant={feedback === "negative" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs h-7 px-2 gap-1",
                    feedback === "negative" && "bg-red-600 hover:bg-red-700"
                  )}
                  onClick={() => handleFeedback("negative")}
                  disabled={feedback !== null}
                >
                  <ThumbsDownIcon size={14} />
                  Not Helpful
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
