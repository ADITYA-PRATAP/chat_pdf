import { NextResponse } from "next/server"
import { loadS3IntoPinecone } from "../../../lib/pinecone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file_key, file_name } = body;

     if (!file_key || !file_name) {
      return NextResponse.json({ error: "Missing file_key or file_name" }, { status: 400 });
    }

    const pages = await loadS3IntoPinecone(file_key);

    return NextResponse.json(
      { message: "File loaded successfully", pages: pages },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("Error in POST request:", error);

    return NextResponse.json(
      { error: `An error occurred while processing your request. ${error}` , },
      
      { status: 500 }
    );
  }
}





