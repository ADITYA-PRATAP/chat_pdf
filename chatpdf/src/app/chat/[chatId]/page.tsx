import { auth } from "@clerk/nextjs/server";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { chats } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import ChatSideBar from "../../../components/ChatSideBar";
import PDFViewer from "../../../components/PDFViewer";
import ChatComponent from "../../../components/ChatComponent";
type Props = {
  params: {
    chatId: string;
  };
};

const page = async ({ params: { chatId } }) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats.length) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === Number(chatId))) {
    return redirect("/");
  }

  const currentchats = _chats.find((chat) => chat.id === Number(chatId));

  return (
    <div className="flex max-h-screen overflow-hideen">
      <div className="flex w-full max-h-screen overflow-hidden">
          {/* chatsidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={Number(chatId)} />
        </div>
        <div className="max-h-screen p-4 overflow--y-scroll flex-[5]">
          <PDFViewer pdf_url={currentchats.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-1-4 border-1-slate-200">
          {/* chat component  */}
          <ChatComponent
           chatId={chatId}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
