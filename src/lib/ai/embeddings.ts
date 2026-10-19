/**
 * Embedding Service for TEM-AI RAG
 * Generates vector representations using Google Gemini text embeddings or local deterministic fallback.
 */

import { getGenAIClient, IS_LIVE_AI_AVAILABLE } from "./client";

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGenAIClient();

  if (client && IS_LIVE_AI_AVAILABLE) {
    try {
      // If live Gemini client supports embeddings
      // Note: In @google/genai, embedding generation is supported via text-embedding-004
      // We safely try or fallback
      const result = await client.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });

      const resAny = result as any;
      const values = resAny.embedding?.values || resAny.embeddings?.[0]?.values;
      if (values && Array.isArray(values)) {
        return values;
      }
    } catch (err) {
      console.warn("Live embedding failed, using deterministic pseudo-embedding:", err);
    }
  }

  // Deterministic 128-dimensional fallback embedding for local offline usage
  return createLocalEmbedding(text, 128);
}

function createLocalEmbedding(text: string, dimensions: number = 128): number[] {
  const vec = new Array(dimensions).fill(0);
  const normalized = text.toLowerCase();

  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const index = (charCode * (i + 1)) % dimensions;
    vec[index] += 1 / (1 + (i % 7));
  }

  // Normalize vector to unit length
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm) || 1;
  return vec.map((v) => v / norm);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
