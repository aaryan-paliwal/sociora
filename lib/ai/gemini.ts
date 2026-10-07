/**
 * Sociora - AI Services Configuration and Environment
 * Current configured model: Gemini 3.8 Flash (gemini-3.8-flash)
 * Verified fast Flash model with low-effort/low-thinking support.
 */

export const GEMINI_CONFIG = {
  // Official verified Flash model identifier
  model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  temperature: 0.7,
  maxOutputTokens: 2500,
  // Low reasoning effort/thinking level for fast social copy inference
  thinkingConfig: {
    thinkingLevel: "LOW" as const,
  },
};

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
}
