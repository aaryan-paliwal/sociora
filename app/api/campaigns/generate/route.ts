import { NextRequest, NextResponse } from "next/server";
import { campaignBriefSchema } from "@/lib/validations/campaign";
import { generateCampaign } from "@/lib/ai/generate-campaign";
import {
  CampaignGenerateSuccessResponse,
  CampaignGenerateErrorResponse,
} from "@/lib/validations/generated-campaign";

export const maxDuration = 45; // Support up to 45 seconds for AI generation

export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      const errResponse: CampaignGenerateErrorResponse = {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Malformed JSON payload in request body",
        },
      };
      return NextResponse.json(errResponse, { status: 400 });
    }

    // 2. Validate request payload contract { brief: CampaignBrief }
    if (!body || typeof body !== "object" || !("brief" in body)) {
      const errResponse: CampaignGenerateErrorResponse = {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Request body must contain a 'brief' object",
        },
      };
      return NextResponse.json(errResponse, { status: 400 });
    }

    const rawBrief = (body as { brief: unknown }).brief;

    // 3. Server-side validation using canonical Zod schema
    const briefValidation = campaignBriefSchema.safeParse(rawBrief);
    if (!briefValidation.success) {
      const firstErrorMessage =
        briefValidation.error.issues[0]?.message || "Invalid campaign brief";
      const errResponse: CampaignGenerateErrorResponse = {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: `Campaign brief validation failed: ${firstErrorMessage}`,
        },
      };
      return NextResponse.json(errResponse, { status: 400 });
    }

    const validatedBrief = briefValidation.data;

    // 4. Safe logging of generation initiation
    console.log(
      `[API /api/campaigns/generate] Processing brief for brand: "${validatedBrief.brandName}", platform: "${validatedBrief.platform}"`
    );

    // 5. Execute generation (Gemini Live API or Demo Mode fallback)
    const result = await generateCampaign(validatedBrief);

    const successResponse: CampaignGenerateSuccessResponse = {
      success: true,
      data: result.campaign,
      mode: result.mode,
      modelUsed: result.modelUsed,
    };

    console.log(
      `[API /api/campaigns/generate] Successfully fulfilled request in ${result.mode} mode.`
    );

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("[API /api/campaigns/generate] Unhandled error:", err.message);

    // Map errors to appropriate HTTP status codes
    const isRateLimit =
      err.message.includes("429") ||
      err.message.toLowerCase().includes("quota") ||
      err.message.toLowerCase().includes("rate limit");

    const isTimeout =
      err.message.toLowerCase().includes("timeout") ||
      err.message.toLowerCase().includes("aborted");

    let statusCode = 502; // AI Provider failure by default
    let errorCode:
      | "RATE_LIMIT"
      | "TIMEOUT"
      | "AI_GENERATION_FAILED"
      | "INTERNAL_ERROR" = "AI_GENERATION_FAILED";

    if (isRateLimit) {
      statusCode = 429;
      errorCode = "RATE_LIMIT";
    } else if (isTimeout) {
      statusCode = 504;
      errorCode = "TIMEOUT";
    }

    const errorResponse: CampaignGenerateErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message:
          isRateLimit
            ? "Gemini API rate limit or quota exceeded. Please wait a moment and try again."
            : "Generation failed. Please try again.",
      },
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
