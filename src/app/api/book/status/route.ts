import { NextResponse } from "next/server";
import { getBookStatus } from "@/lib/rag/book-index";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getBookStatus());
}
