import { auth } from "@clerk/nextjs/server";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { chats } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import ChatSideBar from "../../../components/ChatSideBar";
import PDFViewer from "../../../components/PDFViewer";
import ChatComponent from "../../../components/ChatComponent";
import { checkSubscription } from "../../../lib/subscription";

type Props = {
  params: Promise<{ chatId: string }>;
};

const ChatPage = async ({ params }: Props) => {
  const { chatId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats.length) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === Number(chatId));
  if (!currentChat) {
    return redirect("/");
  }

  const isPro = await checkSubscription();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background lg:flex-row">
      {/* Sidebar — hidden on small screens */}
      <aside className="hidden w-72 shrink-0 md:block">
        <ChatSideBar chats={_chats} chatId={Number(chatId)} isPro={isPro} />
      </aside>

      {/* Document + chat */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* PDF viewer */}
        <section className="min-h-0 flex-1 border-b border-border bg-muted/30 lg:border-b-0 lg:border-r">
          <PDFViewer pdf_url={currentChat.pdfUrl || ""} pdf_name={currentChat.pdfName} />
        </section>

        {/* Chat */}
        <section className="flex min-h-0 w-full flex-col bg-card lg:w-[26rem] xl:w-[30rem]">
          <ChatComponent chatId={chatId} chatName={currentChat.pdfName} />
        </section>
      </div>
    </div>
  );
};

export default ChatPage;
