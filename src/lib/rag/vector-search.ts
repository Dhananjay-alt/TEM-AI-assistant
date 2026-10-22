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

    // Direct multi-word phrase bonuses for high precision
    const lowerQuery = query.toLowerCase();
    if ((lowerQuery.includes("kikuchi") || lowerQuery.includes("kikuchi line") || lowerQuery.includes("kikuchi band")) && chunk.chapterNumber === 19) score += 25;
    if ((lowerQuery.includes("sem") || lowerQuery.includes("tem vs") || lowerQuery.includes("vs sem")) && chunk.chunkId === "carter-ch1-s3") score += 25;
    if ((lowerQuery.includes("centered dark") || lowerQuery.includes("cdf") || (lowerQuery.includes("bright") && lowerQuery.includes("dark"))) && chunk.chapterNumber === 13) score += 25;
    if ((lowerQuery.includes("haadf") || lowerQuery.includes("stem") || lowerQuery.includes("z-contrast") || lowerQuery.includes("z contrast") || lowerQuery.includes("annular dark")) && chunk.chapterNumber === 24) score += 25;
    if ((lowerQuery.includes("cbed") || lowerQuery.includes("convergent beam") || lowerQuery.includes("kossel") || lowerQuery.includes("holz")) && chunk.chapterNumber === 18) score += 25;
    if ((lowerQuery.includes("eds vs eels") || lowerQuery.includes("eels vs eds") || (lowerQuery.includes("eds") && lowerQuery.includes("eels"))) && chunk.chapterNumber === 38) score += 25;
    if ((lowerQuery.includes("sample prep") || lowerQuery.includes("specimen prep") || lowerQuery.includes("electropolish") || lowerQuery.includes("ion mill") || lowerQuery.includes("fib") || lowerQuery.includes("lift out")) && chunk.chapterNumber === 10) score += 25;
    if ((lowerQuery.includes("alignment") || lowerQuery.includes("eucentric") || lowerQuery.includes("wobbler") || lowerQuery.includes("astigmatism") || lowerQuery.includes("stigmator")) && chunk.chapterNumber === 4) score += 25;
    if ((lowerQuery.includes("diffraction contrast") || lowerQuery.includes("amplitude contrast") || lowerQuery.includes("mass-thickness")) && chunk.chapterNumber === 22) score += 25;
    if ((lowerQuery.includes("burgers") || lowerQuery.includes("g.b") || lowerQuery.includes("g·b") || lowerQuery.includes("dislocation")) && chunk.chapterNumber === 23) score += 25;
    if ((lowerQuery.includes("ewald") || lowerQuery.includes("reciprocal space") || lowerQuery.includes("reciprocal lattice")) && chunk.chapterNumber === 11) score += 25;
    if ((lowerQuery.includes("scherzer") || lowerQuery.includes("ctf") || lowerQuery.includes("contrast transfer") || lowerQuery.includes("hrtem") || lowerQuery.includes("lattice fringe")) && chunk.chapterNumber === 28) score += 25;
    if ((lowerQuery.includes("wavelength") || lowerQuery.includes("de broglie") || lowerQuery.includes("accelerating voltage") || lowerQuery.includes("abbe")) && chunk.chunkId === "carter-ch1-s1") score += 25;
    if ((lowerQuery.includes("saed") || lowerQuery.includes("camera length") || lowerQuery.includes("camera constant") || lowerQuery.includes("r*d") || lowerQuery.includes("r·d") || lowerQuery.includes("r d =")) && chunk.chapterNumber === 12) score += 25;
    if ((lowerQuery.includes("eds") || lowerQuery.includes("edx") || lowerQuery.includes("cliff-lorimer") || lowerQuery.includes("characteristic x-ray")) && chunk.chapterNumber === 33) score += 20;
    if ((lowerQuery.includes("eels") || lowerQuery.includes("zero loss") || lowerQuery.includes("plasmon") || lowerQuery.includes("core-loss") || lowerQuery.includes("elnes")) && chunk.chapterNumber === 37) score += 20;
    if ((lowerQuery.includes("field emission") || lowerQuery.includes("feg") || lowerQuery.includes("thermionic") || lowerQuery.includes("lab6") || lowerQuery.includes("gun")) && chunk.chapterNumber === 5) score += 20;
    if ((lowerQuery.includes("aberration") || lowerQuery.includes("spherical aberration") || lowerQuery.includes("chromatic aberration") || lowerQuery.includes("cs") || lowerQuery.includes("cc")) && chunk.chapterNumber === 6) score += 20;
    if ((lowerQuery.includes("elastic") || lowerQuery.includes("inelastic") || lowerQuery.includes("scattering")) && chunk.chapterNumber === 2) score += 15;

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
