import { NextRequest, NextResponse } from "next/server";
import { generateCarterChatResponse, ChatMode } from "@/lib/ai/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, mode = "ASK", examSubtype, history } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const response = await generateCarterChatResponse(
      query,
      mode as ChatMode,
      examSubtype,
      history
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      {
        error: "Unable to process TEM-AI chat request.",
        details: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
