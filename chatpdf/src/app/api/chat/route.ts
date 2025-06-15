// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

// These imports using @ai-sdk or @vercel/ai
import { Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

import { eq } from "drizzle-orm";
import { chats } from "../../../lib/db/schema";
import { db } from "../../../lib/db";
import { getContext } from "../../../lib/context";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, chatId } = body;
    const lastMessage = messages[messages.length - 1];

    // console.log("lastMessage", lastMessage,chatId);
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

    if (_chats.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].filekey;

    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                AI is a well-behaved and well-mannered individual.
                AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.
                AI has the sum of all knowledge in its brain, and is able to accurately answer nearly any question about any topic in existence.
                AI assistant is a big fan of Pinecone and Vercel.
                START CONTEXT BLOCK
                ${context}
                END OF CONTEXT BLOCK
                AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                If the context does not provide the answer to a question, the AI assistant will say, "I'm sorry, but I don't know the answer."
                AI assistant will not apologize for previous responses, but will indicate that new information was gained.
                AI assistant will not invent anything that is not drawn directly from the context.`,
    };

    const response = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [prompt, ...messages.filter((message:Message) => message.role == "user")],
     }
  );

    return response.toDataStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
      },
    }
  );
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Error processing chat" },
      { status: 500 }
    );
  }
}
