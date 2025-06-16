import { NextResponse } from "next/server";
import { loadS3IntoPinecone } from "../../../lib/pinecone";
import { db } from "../../../lib/db";
import { chats } from "../../../lib/db/schema";
import { getS3FileUrl } from "../../../lib/s3";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const userId = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { file_key, file_name } = body;

    if (!file_key || !file_name) {
      return NextResponse.json(
        { error: "Missing file_key or file_name" },
        { status: 400 }
      );
    }

    await loadS3IntoPinecone(file_key);

    // console.log("File loaded into Pinecone successfully",userId, file_key, file_name);
    const chat_id = await db
      .insert(chats)
      .values({
        filekey: file_key,
        pdfName: file_name,
        pdfUrl: getS3FileUrl(file_key),
        userId: userId.userId, // ✅ this must be included
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json({
      chat_id: chat_id[0].insertedId,
      message: "File processed successfully and chat created.",
      status: "success",
    });
  } catch (error) {
    console.error("Error in POST request:", error);

    return NextResponse.json(
      { error: `An error occurred while processing your request. ${error}` },

      { status: 500 }
    );
  }
}
