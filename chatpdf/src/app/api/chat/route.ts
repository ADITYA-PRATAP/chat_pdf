// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL_NAME = "gemini-2.0-flash";

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { message: "API key not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: formattedMessages }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Split by double newline (SSE event delimiter)
          const parts = buffer.split('\n\n');
          // Keep incomplete part in buffer
          buffer = parts.pop() || '';

          for (const part of parts) {
            // Each part is like "data: {JSON}"
            if (part.startsWith('data:')) {
              const dataStr = part.replace(/^data:\s*/, '').trim();

              if (dataStr === '[DONE]') {
                controller.close();
                return;
              }

              try {
                const data = JSON.parse(dataStr);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

                if (text) {
                  // Send data as SSE format: "data: {...}\n\n"
                  controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`);
                }
              } catch (e) {
                console.error('JSON parse error:', e, 'chunk:', dataStr);
                controller.enqueue(`data: ${JSON.stringify({ error: 'Failed to parse stream data' })}\n\n`);
              }
            }
          }
        }
      },
      cancel(reason) {
        console.warn('Stream cancelled:', reason);
        response.body?.cancel(reason);
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      {
        message: 'Failed at Gemini API call',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
