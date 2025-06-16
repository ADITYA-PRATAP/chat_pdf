import React from "react";
import { Message } from "@ai-sdk/react";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";
type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = (props: Props) => {
  if (props.isLoading) {
    return (
      <div className="relative flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (props.messages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {props.messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex ", {
              "justify-end pl-10 ": message.role === "user",
              "justify-start pr-10": message.role === "system",
            })}
          >
            <div
              className={cn(
                "rounded-lg p-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                  "bg-white text-gray-900":( message.role === "system" ||  message.role === "assistant"),
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
