import { auth } from "@clerk/nextjs/server";
import React from 'react'
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { chats } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
type Props = {
  params: {
    chatId: string
  }
}

const page = async({params:{chatId}}) => {
  const { userId } = await auth();

  if(!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if(!_chats.length) {
    return redirect("/");
  }
  if(!_chats.find((chat) => chat.id === Number(chatId))) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen">

    </div>
  )
}

export default page