import React from "react";
import { DrizzleChat } from "../lib/db/schema";
import { chat } from "@pinecone-database/pinecone/dist/assistant/data/chat";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { MessageCircle, PlusCircle, PlusIcon } from "lucide-react";
import { cn } from "../lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen text-gray-200 bg-gray-900 p-4">
      <Link href="/">
        <Button className={"w-full border-dashed border-white border mt-2"}>
          <PlusCircle className="mr-2 w4 h4" />
          New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-3 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-800": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2 w4 h4" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href={"/"}>Home</Link>
          <Link href={"/sign-out"}>Sign Out</Link>
          {/* Stripe   */}
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
