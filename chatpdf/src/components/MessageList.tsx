import React from "react";
import { Message } from "@ai-sdk/react";
import { cn } from "../lib/utils";
import { Bot, MessageSquareText, User } from "lucide-react";

type Props = {
  isLoading: boolean;
  isStreaming?: boolean;
  messages: Message[];
};

const Avatar = ({ role }: { role: string }) => {
  const isUser = role === "user";
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isUser
          ? "bg-primary text-primary-foreground"
          : "bg-accent text-accent-foreground"
      )}
    >
      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
    </span>
  );
};

const MessageList = ({ isLoading, isStreaming, messages }: Props) => {
  // Initial fetch skeletons
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn("flex gap-3", i % 2 === 1 && "flex-row-reverse")}
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
            <div
              className="h-16 animate-pulse rounded-2xl bg-muted"
              style={{ width: `${60 - i * 8}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!messages.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <MessageSquareText className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-xl tracking-tight">
            Ask your first question
          </h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            Your document is ready. Try asking for a summary, a key definition,
            or what a specific section means.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {["Summarize this document", "What are the key takeaways?"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const showTyping = isStreaming && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={cn("flex gap-3", isUser && "flex-row-reverse")}
          >
            <Avatar role={message.role} />
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                isUser
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : "rounded-tl-sm border border-border bg-card text-card-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        );
      })}

      {showTyping && (
        <div className="flex gap-3">
          <Avatar role="assistant" />
          <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 shadow-sm">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            <span
              className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Memoized: the composer's input state lives in the parent, so without this
// the entire message list re-renders on every keystroke.
export default React.memo(MessageList);
