"use client";

import React from "react";
import { DrizzleChat } from "../lib/db/schema";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { cn } from "../lib/utils";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SubscriptionButton from "./SubscriptionButton";
import { SignedIn, UserButton } from "@clerk/nextjs";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro?: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro = false }: Props) => {
  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3.5">
        <Logo />
        <ThemeToggle />
      </div>

      <div className="px-3 pt-3">
        <Link href="/">
          <Button className="w-full justify-start gap-2" size="sm">
            <PlusCircle className="h-4 w-4" />
            New chat
          </Button>
        </Link>
      </div>

      {/* Chat list */}
      <nav className="scrollbar-thin mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your documents
        </p>
        {chats.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            No documents yet.
          </p>
        ) : (
          chats.map((chat) => {
            const active = chat.id === chatId;
            return (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  title={chat.pdfName}
                >
                  <FileText
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active
                        ? "text-sidebar-primary-foreground"
                        : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  <span className="truncate">{chat.pdfName}</span>
                </div>
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-sidebar-border p-3">
        <SubscriptionButton isPro={isPro} className="w-full" />
        <div className="flex items-center justify-between">
          <SignedIn>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserButton afterSignOutUrl="/" />
              <span>Account</span>
            </div>
          </SignedIn>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
