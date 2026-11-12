import { NextRequest, NextResponse } from "next/server";
import { generateCarterChatResponse, ChatMode, HistoryMessage } from "@/lib/ai/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Loading the index on a cold start plus a model call can take a while.
export const maxDuration = 60;

const MODES: ChatMode[] = ["ASK", "TUTOR", "EXAM", "EXPERIMENT"];
const EXAM_TYPES = ["2mark", "5mark", "10mark", "viva", "mcq"] as const;
const MAX_QUERY_CHARS = 1500;

/* A small per-visitor limit. It keeps one client from draining the model quota
   or paging through the book by script. Counters live in memory, so on a
   serverless host the limit applies per running instance. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    hits.forEach((times, key) => {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    });
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
    if (!allow(ip)) {
      return NextResponse.json(
        { error: "Too many questions in a short time. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "The request was not valid JSON." }, { status: 400 });
    }

    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }
    if (query.length > MAX_QUERY_CHARS) {
      return NextResponse.json(
        { error: `The question is too long (limit ${MAX_QUERY_CHARS} characters).` },
        { status: 400 }
      );
    }

    const mode: ChatMode = MODES.includes(body.mode) ? body.mode : "ASK";
    const examSubtype = EXAM_TYPES.includes(body.examSubtype) ? body.examSubtype : undefined;
    const history: HistoryMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((h: any) => h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string")
          .slice(-6)
          .map((h: any) => ({ role: h.role, content: h.content.slice(0, 2000) }))
      : [];

    const response = await generateCarterChatResponse(query, mode, examSubtype, history);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: "The question could not be answered because of a server error. Please try again." },
      { status: 500 }
    );
  }
}
