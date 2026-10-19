import { NextRequest, NextResponse } from "next/server";
import { retrieveCarterKnowledge } from "@/lib/rag/vector-search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const chapterStr = searchParams.get("chapter");
  const topKStr = searchParams.get("topK");

  if (!query) {
    return NextResponse.json({ error: "Missing 'q' query parameter" }, { status: 400 });
  }

  const chapter = chapterStr ? parseInt(chapterStr, 10) : undefined;
  const topK = topKStr ? parseInt(topKStr, 10) : 3;

  const result = retrieveCarterKnowledge(query, topK, chapter);
  return NextResponse.json(result);
}
