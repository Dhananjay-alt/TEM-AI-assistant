import { NextRequest, NextResponse } from "next/server";
import { analyzeMicrographAI } from "@/lib/ai/vision";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, question, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required for vision analysis." },
        { status: 400 }
      );
    }

    const report = await analyzeMicrographAI(imageBase64, question, mimeType);
    return NextResponse.json(report);
  } catch (error: any) {
    console.error("API /api/vision error:", error);
    return NextResponse.json(
      {
        error: "Unable to analyze TEM micrograph.",
        details: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
