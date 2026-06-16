"use client";

import React, { useEffect, useRef } from "react";
import { Input } from "../components/ui/input";
import { useChat } from "@ai-sdk/react";
import { Button } from "../components/ui/button";
import { Loader2, SendHorizontal } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  chatId: string;
  chatName?: string;
};

const ChatComponent = ({ chatId, chatName }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post("/api/get-messages", { chatId });
      return response?.data?._messages;
    },
  });

  const { input, handleInputChange, handleSubmit, messages, status } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: data || [],
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const bottomRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    handleSubmit();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <SendHorizontal className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold leading-tight">
            {chatName || "Chat"}
          </h2>
          <p className="text-xs text-muted-foreground">Ask anything about this document</p>
        </div>
      </header>

      {/* Messages */}
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-border bg-card p-3"
      >
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about your PDF…"
            className="h-11 flex-1 rounded-xl"
            disabled={isStreaming}
            aria-label="Message"
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
          PaperChat can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
};

export default ChatComponent;
