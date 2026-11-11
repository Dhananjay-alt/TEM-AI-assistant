/**
 * Unified retrieval: uses the indexed textbook PDF when it is available and
 * falls back to the small set of stored summaries otherwise.
 */

import { retrieveCarterKnowledge, RetrievedSource } from "./vector-search";
import { searchBook, tokenize } from "./book-index";

export interface RetrievalResult {
  /** True when sources are real pages of the indexed PDF. */
  fromPdf: boolean;
  sources: RetrievedSource[];
  /** Numbered source text handed to the model. */
  contextText: string;
}

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [text];
  return parts.map((s) => s.trim()).filter(Boolean);
}

export function sourceLabel(s: RetrievedSource): string {
  const parts: string[] = [];
  if (s.chapterNumber) parts.push(`Chapter ${s.chapterNumber}${s.chapterTitle ? `: ${s.chapterTitle}` : ""}`);
  else if (s.chapterTitle) parts.push(s.chapterTitle);
  if (s.kind === "pdf") parts.push(`p. ${s.pageLabel || s.pdfPage}`);
  else parts.push(`Section ${s.sectionNumber}, approx. pp. ${s.page}-${s.pageEnd}`);
  return parts.join(", ");
}

export function retrieveSources(query: string, topK = 4): RetrievalResult {
  const hits = searchBook(query, topK);
  let sources: RetrievedSource[];
  const fromPdf = hits.length > 0;

  if (fromPdf) {
    const top = hits[0].score || 1;
    sources = hits.map((h) => ({
      kind: "pdf" as const,
      book: h.bookTitle,
      chapterNumber: h.chapterNumber,
      chapterTitle: h.chapterTitle,
      sectionNumber: "",
      sectionTitle: h.sectionTitle,
      page: h.passage.page,
      pageEnd: h.passage.page,
      pdfPage: h.passage.page,
      pageLabel: h.pageLabel,
      chunkId: h.passage.id,
      relevanceScore: Math.max(0.05, Math.min(1, h.score / top)),
      excerpt: h.passage.text,
      summary: "",
      pedagogicalKeyPoints: [],
      segments: h.passage.lines.map((l) => l.t),
      rects: h.passage.lines.map((l) => l.r),
      focus: [],
    }));
  } else {
    sources = retrieveCarterKnowledge(query, Math.min(topK, 3)).sources.map((s) => ({
      ...s,
      kind: "excerpt" as const,
      segments: splitSentences(s.excerpt),
      focus: [],
    }));
  }

  const contextText = sources.map((s, i) => `[${i + 1}] ${sourceLabel(s)}\n${s.excerpt}`).join("\n\n");

  return { fromPdf, sources, contextText };
}

/**
 * Marks, for every source, the lines that best support the answer: the
 * sentences of the answer that cite [n] are compared with each line of
 * source n. Falls back to the question when a source is not cited.
 */
export function markSupportingLines(sources: RetrievedSource[], answer: string, query: string): void {
  const answerSentences = answer.split(/(?<=[.!?])\s+|\n+/);
  sources.forEach((src, i) => {
    const segments = src.segments || [];
    if (segments.length === 0) return;
    const marker = `[${i + 1}]`;
    const citing = answerSentences.filter((s) => s.includes(marker)).join(" ");
    const wanted = new Set(tokenize(citing || query));
    if (wanted.size === 0) return;

    const lineScore = segments.map((seg) => {
      const seen = new Set<string>();
      for (const tok of tokenize(seg)) if (wanted.has(tok)) seen.add(tok);
      return seen.size;
    });

    // best window of up to three consecutive lines (one sentence for excerpts)
    const span = src.kind === "pdf" ? Math.min(3, segments.length) : 1;
    let best = 0;
    let bestScore = -1;
    for (let start = 0; start + span <= segments.length; start++) {
      let score = 0;
      for (let k = 0; k < span; k++) score += lineScore[start + k];
      if (score > bestScore) {
        bestScore = score;
        best = start;
      }
    }
    src.focus = bestScore > 0 ? Array.from({ length: span }, (_, k) => best + k) : [];
  });
}
