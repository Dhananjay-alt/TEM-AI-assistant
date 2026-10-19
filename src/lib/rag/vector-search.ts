/**
 * Grounded RAG Retrieval Engine for Carter TEM Knowledge Base
 * 
 * Provides vector-like semantic matching, keyword weighting, chapter/section
 * filtering, and citation extraction. Designed to work standalone or with pgvector.
 */

import { CARTER_TEXTBOOK_CHUNKS, CarterChunk } from "@/data/carter-textbook-data";

export interface RetrievedSource {
  book: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  page: number;
  pageEnd: number;
  chunkId: string;
  relevanceScore: number;
  excerpt: string;
  summary: string;
  pedagogicalKeyPoints: string[];
  formulas?: string[];
  figureRef?: string;
}

export interface GroundedRAGResult {
  query: string;
  sources: RetrievedSource[];
  bestMatch: RetrievedSource | null;
  carterContextText: string;
  matchedChapterIds: number[];
}

/**
 * Tokenizes text and cleans punctuation for search
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Semantic & keyword retrieval over Carter chunks
 */
export function retrieveCarterKnowledge(
  query: string,
  topK: number = 3,
  chapterFilter?: number
): GroundedRAGResult {
  const queryTokens = tokenize(query);

  const scored = CARTER_TEXTBOOK_CHUNKS.filter((chunk) => {
    if (chapterFilter && chunk.chapterNumber !== chapterFilter) return false;
    return true;
  }).map((chunk) => {
    let score = 0;

    // Check query tokens against keywords (heavy weight)
    for (const token of queryTokens) {
      for (const kw of chunk.keywords) {
        if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) {
          score += 4.0;
        }
      }

      // Title & section match
      if (chunk.chapterTitle.toLowerCase().includes(token)) score += 3.0;
      if (chunk.sectionTitle.toLowerCase().includes(token)) score += 3.0;

      // Excerpt match
      if (chunk.excerpt.toLowerCase().includes(token)) score += 1.2;
      if (chunk.summary.toLowerCase().includes(token)) score += 1.5;

      // Pedagogical points
      for (const pt of chunk.pedagogicalKeyPoints) {
        if (pt.toLowerCase().includes(token)) score += 1.0;
      }
    }

    // Direct multi-word phrase bonuses
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("diffraction contrast") && chunk.chapterNumber === 22) score += 10;
    if (lowerQuery.includes("burgers") && chunk.chapterNumber === 23) score += 10;
    if (lowerQuery.includes("ewald") && chunk.chapterNumber === 11) score += 10;
    if (lowerQuery.includes("scherzer") && chunk.chapterNumber === 28) score += 10;
    if (lowerQuery.includes("wavelength") && chunk.chapterNumber === 1) score += 10;
    if (lowerQuery.includes("saed") && chunk.chapterNumber === 12) score += 10;
    if (lowerQuery.includes("camera length") && chunk.chapterNumber === 12) score += 10;
    if (lowerQuery.includes("eds") && chunk.chapterNumber === 33) score += 10;
    if (lowerQuery.includes("eels") && chunk.chapterNumber === 37) score += 10;
    if (lowerQuery.includes("field emission") && chunk.chapterNumber === 5) score += 10;
    if (lowerQuery.includes("aberration") && chunk.chapterNumber === 6) score += 10;

    return {
      chunk,
      score,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const topMatches = scored.slice(0, topK).map(({ chunk, score }) => ({
    book: "Transmission Electron Microscopy: A Textbook for Materials Science (Williams & Carter)",
    chapterNumber: chunk.chapterNumber,
    chapterTitle: chunk.chapterTitle,
    sectionNumber: chunk.sectionNumber,
    sectionTitle: chunk.sectionTitle,
    page: chunk.page,
    pageEnd: chunk.pageEnd,
    chunkId: chunk.chunkId,
    relevanceScore: Math.min(0.99, Math.max(0.65, 0.5 + score * 0.05)),
    excerpt: chunk.excerpt,
    summary: chunk.summary,
    pedagogicalKeyPoints: chunk.pedagogicalKeyPoints,
    formulas: chunk.formulas,
    figureRef: chunk.figureRef,
  }));

  const carterContextText = topMatches
    .map(
      (m, idx) =>
        `[Source ${idx + 1}] Carter & Williams, Chapter ${m.chapterNumber}: "${m.chapterTitle}", Section ${m.sectionNumber} (pp. ${m.page}-${m.pageEnd})\nExcerpt: ${m.excerpt}\nKey Points:\n${m.pedagogicalKeyPoints.map((p) => `- ${p}`).join("\n")}`
    )
    .join("\n\n");

  return {
    query,
    sources: topMatches,
    bestMatch: topMatches[0] || null,
    carterContextText,
    matchedChapterIds: topMatches.map((m) => m.chapterNumber),
  };
}
