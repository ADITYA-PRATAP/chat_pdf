import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { messages } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chatId } = body;

    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    return NextResponse.json({ _messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages", details: String(error) },
      { status: 500 }
    );
  }
}