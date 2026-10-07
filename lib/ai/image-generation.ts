import { GoogleGenAI } from "@google/genai";
import { CampaignBrief, GeneratedCampaign } from "@/types";
import {
  VisualDirection,
  GeneratedPoster,
  generatedPosterSchema,
} from "@/lib/validations/visual-direction";
import { generateDemoPoster } from "@/lib/ai/demo-poster";

export const IMAGE_GENERATION_CONFIG = {
  // Official verified Gemini Image model identifier
  model: process.env.IMAGE_GENERATION_MODEL || "gemini-3.1-flash-image",
  apiKey: process.env.IMAGE_GENERATION_API_KEY || process.env.GEMINI_API_KEY,
};

export function isImageProviderConfigured(): boolean {
  return Boolean(
    (process.env.IMAGE_GENERATION_API_KEY &&
      process.env.IMAGE_GENERATION_API_KEY.trim() !== "") ||
      (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "")
  );
}

/**
 * Isolated Image Generation Service
 * Calls live Gemini Image generation model if configured; otherwise gracefully returns deterministic Demo Poster.
 */
export async function generatePosterImage(
  brief: CampaignBrief,
  campaign: GeneratedCampaign,
  direction: VisualDirection
): Promise<GeneratedPoster> {
  const apiKey =
    process.env.IMAGE_GENERATION_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim();

  // 1. DEMO MODE check (No API key available)
  if (!apiKey) {
    console.log(
      `[Sociora Image AI] No image API key configured. Generating DEMO poster for "${brief.brandName}".`
    );
    const demoPoster = generateDemoPoster(brief, campaign, direction);
    return generatedPosterSchema.parse(demoPoster);
  }

  // 2. LIVE IMAGE GENERATION MODE via GoogleGenAI
  const modelName = IMAGE_GENERATION_CONFIG.model;
  console.log(
    `[Sociora Image AI] Requesting live image synthesis from "${modelName}" for "${brief.brandName}"...`
  );

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: direction.imagePrompt,
      config: {
        // Request image modality
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    // Inspect candidate parts for inline image bytes
    const candidates = response.candidates || [];
    let imageUri: string | null = null;

    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUri = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
      if (imageUri) break;
    }

    if (!imageUri) {
      console.warn(
        `[Sociora Image AI] No inline image data in model response. Falling back to Demo Poster.`
      );
      return generateDemoPoster(brief, campaign, direction);
    }

    console.log(`[Sociora Image AI] Successfully synthesized live image.`);

    const livePoster: GeneratedPoster = {
      imageUrl: imageUri,
      mode: "LIVE",
      modelUsed: modelName,
      visualDirection: direction,
      overlayText: {
        brandName: brief.brandName,
        headline: campaign.headline,
        offer: brief.offer || undefined,
        callToAction: campaign.callToAction,
      },
    };

    return generatedPosterSchema.parse(livePoster);
  } catch (error) {
    const err = error as Error;
    console.error(
      `[Sociora Image AI] Live image synthesis error: ${err.message}. Falling back to demo mode.`
    );
    // Graceful fallback to demo poster so campaign stays functional
    return generateDemoPoster(brief, campaign, direction);
  }
}
