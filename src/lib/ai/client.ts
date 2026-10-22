/**
 * AI Provider Client Configuration
 * Clean abstraction supporting Google Gemini Pro with automatic fallback to high-fidelity demo mode.
 */

import { GoogleGenAI } from "@google/genai";

export const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "";

export const IS_LIVE_AI_AVAILABLE = Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0);

let genAiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  if (!IS_LIVE_AI_AVAILABLE) {
    return null;
  }
  if (!genAiClient) {
    try {
      genAiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return genAiClient;
}

export const AI_CONFIG = {
  modelName: "gemini-3-flash-preview",
  fallbackModelName: "gemini-3.5-flash",
  visionModelName: "gemini-3-flash-preview",
  provider: "Google Gemini 3 Flash (Live AI)",
  isLive: IS_LIVE_AI_AVAILABLE,
};
