import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { CampaignBrief } from "@/types";
import {
  GeneratedCampaign,
  generatedCampaignSchema,
} from "@/lib/validations/generated-campaign";
import { GEMINI_CONFIG } from "@/lib/ai/gemini";
import { generateDemoCampaign } from "@/lib/ai/demo-generator";

/**
 * System instruction defining the AI Persona and strict marketing constraints.
 */
const SYSTEM_INSTRUCTION = `You are a world-class professional social media marketing strategist, creative director, and copywriter.
Your job is to generate a comprehensive, commercially effective, ready-to-publish social media campaign package based strictly on the provided Campaign Brief.

Guiding Rules:
1. Specificity: Generate content that directly addresses the specific product, target audience, platform, and objective.
2. Tone & Platform: Match the specified tone and write idiomatically for the selected social media platform (e.g., hooks for Reels/TikTok, structured insight for LinkedIn, punchy lines for Instagram/X).
3. Grounding: Do NOT invent unsupported factual claims, fake lab certifications, non-existent technical specifications, or false medical guarantees. Use compelling creative marketing language grounded in the brief.
4. Output Format: You MUST output structured JSON strictly adhering to the requested schema. No markdown wrapping, no conversational pleasantries.`;

/**
 * User Prompt Constructor
 */
function buildPrompt(brief: CampaignBrief): string {
  return `Please generate the full social media campaign package for the following brief:

- Brand Name: ${brief.brandName}
- Product / Service: ${brief.productName}
- Product Description & Core Features: ${brief.productDescription}
- Target Audience: ${brief.targetAudience}
- Target Platform: ${brief.platform}
- Campaign Objective: ${brief.campaignObjective}
- Desired Tone: ${brief.tone}
${brief.offer ? `- Promotional Offer: ${brief.offer}` : ""}
${brief.callToAction ? `- Call to Action (CTA): ${brief.callToAction}` : ""}
${brief.visualStyle ? `- Visual Style / Aesthetic: ${brief.visualStyle}` : ""}
${brief.additionalInstructions ? `- Additional Instructions: ${brief.additionalInstructions}` : ""}

Required deliverables:
1. campaignTitle: A punchy campaign title (e.g., "BrewHouse Cold Brew - Summer Launch")
2. headline: An attention-grabbing hook headline (max 10 words)
3. caption: Primary high-converting long caption with hook, value points, offer mention, and CTA
4. shortCaption: Punchy 1-2 sentence caption ideal for fast-scrolling feeds
5. callToAction: Clear, actionable closing CTA
6. hashtags: 5 to 10 relevant, high-traffic and niche hashtags (include '#' symbol)
7. reelIdea: A concise viral short-form video concept (15-30s) including hook, visuals, and audio suggestion
8. storyIdea: An interactive 3-frame Instagram/Facebook story sequence concept
9. carouselIdea: A multi-slide educational or promotional carousel concept with slide-by-slide structure
10. videoStoryboard: An array of 3 to 5 scenes, each with scene number, visual/audio description, and duration (e.g., '0-3s', '3-7s')`;
}

/**
 * Native Response Schema definition for @google/genai
 */
const GENERATED_CAMPAIGN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    campaignTitle: { type: Type.STRING },
    headline: { type: Type.STRING },
    caption: { type: Type.STRING },
    shortCaption: { type: Type.STRING },
    callToAction: { type: Type.STRING },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    reelIdea: { type: Type.STRING },
    storyIdea: { type: Type.STRING },
    carouselIdea: { type: Type.STRING },
    videoStoryboard: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scene: { type: Type.INTEGER },
          description: { type: Type.STRING },
          duration: { type: Type.STRING },
        },
        required: ["scene", "description", "duration"],
      },
    },
  },
  required: [
    "campaignTitle",
    "headline",
    "caption",
    "shortCaption",
    "callToAction",
    "hashtags",
    "reelIdea",
    "storyIdea",
    "carouselIdea",
    "videoStoryboard",
  ],
};

export interface GenerationResult {
  campaign: GeneratedCampaign;
  mode: "LIVE" | "DEMO";
  modelUsed?: string;
}

/**
 * Generates a complete social marketing campaign.
 * Automatically falls back to deterministic demo generation if GEMINI_API_KEY is not configured.
 */
export async function generateCampaign(
  brief: CampaignBrief
): Promise<GenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. DEMO MODE check
  if (!apiKey) {
    console.log(
      `[Sociora AI] GEMINI_API_KEY is not configured. Using deterministic DEMO MODE for brand: "${brief.brandName}".`
    );
    const demoCampaign = generateDemoCampaign(brief);
    // Validate demo campaign against schema to guarantee integrity
    const validatedDemo = generatedCampaignSchema.parse(demoCampaign);
    return {
      campaign: validatedDemo,
      mode: "DEMO",
    };
  }

  // 2. LIVE AI MODE via @google/genai SDK
  const modelName = GEMINI_CONFIG.model;
  console.log(
    `[Sociora AI] Calling Gemini Live API with model "${modelName}" for "${brief.brandName} - ${brief.productName}"...`
  );

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = buildPrompt(brief);

    // Call Gemini with structured JSON output and low-effort thinking
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: GEMINI_CONFIG.temperature,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
        responseMimeType: "application/json",
        responseSchema: GENERATED_CAMPAIGN_RESPONSE_SCHEMA,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const responseText = response.text;
    if (!responseText || responseText.trim() === "") {
      throw new Error("Gemini returned an empty response");
    }

    // Parse JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText.trim());
    } catch {
      throw new Error("Failed to parse JSON response from Gemini");
    }

    // Validate with canonical Zod schema
    const validationResult = generatedCampaignSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      console.error(
        "[Sociora AI] AI Output Schema Validation Failed:",
        validationResult.error.format()
      );
      throw new Error(
        `AI generated output did not conform to the campaign contract: ${validationResult.error.issues[0]?.message}`
      );
    }

    console.log(
      `[Sociora AI] Successfully generated and validated live campaign for "${brief.brandName}".`
    );

    return {
      campaign: validationResult.data,
      mode: "LIVE",
      modelUsed: modelName,
    };
  } catch (error) {
    const err = error as Error;
    console.error(
      `[Sociora AI] Live Gemini generation failed (${err.message}). Activating graceful DEMO MODE fallback for "${brief.brandName}".`
    );

    // Controlled fallback to deterministic demo generation to avoid breaking application
    const demoCampaign = generateDemoCampaign(brief);
    const validatedDemo = generatedCampaignSchema.parse(demoCampaign);

    return {
      campaign: validatedDemo,
      mode: "DEMO",
      modelUsed: `${modelName} (fallback-demo)`,
    };
  }
}
