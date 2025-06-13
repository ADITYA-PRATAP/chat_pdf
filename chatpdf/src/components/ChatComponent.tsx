'use client'
import React from 'react';
import { Input } from "../components/ui/input";
import { useChat } from '@ai-sdk/react';
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";
import MessageList from './MessageList';

const ChatComponent = (props: any) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
  });

  // Wrap handleSubmit to prevent default form submit reload
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="relative max-h-screen overflow">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2  h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} />

      {/* form */}
      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4  flex gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="w-full"
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          <Send className="mr-2 w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
