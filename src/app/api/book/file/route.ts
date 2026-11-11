import fs from "node:fs";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getBookPdfPath } from "@/lib/rag/book-index";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Streams the locally stored textbook PDF to the source viewer. Supports
 * HTTP range requests so the viewer only downloads the pages it shows.
 */
export async function GET(req: NextRequest) {
  const file = getBookPdfPath();
  if (!file) {
    return NextResponse.json({ error: "No textbook PDF has been indexed." }, { status: 404 });
  }

  const size = fs.statSync(file).size;
  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
    "Content-Disposition": "inline",
  };

  const range = req.headers.get("range");
  const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
  if (m && (m[1] || m[2])) {
    let start = m[1] ? parseInt(m[1], 10) : size - parseInt(m[2], 10);
    let end = m[1] && m[2] ? parseInt(m[2], 10) : size - 1;
    start = Math.max(0, start);
    end = Math.min(size - 1, end);
    if (start > end) {
      return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const stream = Readable.toWeb(fs.createReadStream(file, { start, end })) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
  return new NextResponse(stream, { status: 200, headers: { ...headers, "Content-Length": String(size) } });
}
