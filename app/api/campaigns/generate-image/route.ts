import { NextRequest, NextResponse } from "next/server";
import { campaignBriefSchema } from "@/lib/validations/campaign";
import { generatedCampaignSchema } from "@/lib/validations/generated-campaign";
import {
  visualDirectionSchema,
  GeneratedPoster,
} from "@/lib/validations/visual-direction";
import { generateVisualDirection } from "@/lib/ai/visual-direction";
import { generatePosterImage } from "@/lib/ai/image-generation";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Malformed JSON payload" } },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Invalid request body" } },
        { status: 400 }
      );
    }

    const { brief, campaign, visualDirection: customVisualDirection } = body as {
      brief: unknown;
      campaign: unknown;
      visualDirection?: unknown;
    };

    // 1. Validate brief
    const briefValidation = campaignBriefSchema.safeParse(brief);
    if (!briefValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: `Brief validation error: ${briefValidation.error.issues[0]?.message}`,
          },
        },
        { status: 400 }
      );
    }

    // 2. Validate campaign
    const campaignValidation = generatedCampaignSchema.safeParse(campaign);
    if (!campaignValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: `Campaign validation error: ${campaignValidation.error.issues[0]?.message}`,
          },
        },
        { status: 400 }
      );
    }

    // 3. Derive or validate Visual Direction
    const direction =
      customVisualDirection &&
      visualDirectionSchema.safeParse(customVisualDirection).success
        ? visualDirectionSchema.parse(customVisualDirection)
        : generateVisualDirection(briefValidation.data, campaignValidation.data);

    console.log(
      `[API /api/campaigns/generate-image] Generating poster for "${briefValidation.data.brandName}" (${briefValidation.data.platform})`
    );

    // 4. Generate poster (Live or Demo fallback)
    const poster: GeneratedPoster = await generatePosterImage(
      briefValidation.data,
      campaignValidation.data,
      direction
    );

    return NextResponse.json(
      {
        success: true,
        poster,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("[API /api/campaigns/generate-image] Error:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "IMAGE_GENERATION_FAILED",
          message: "Visual generation failed. Please try again.",
        },
      },
      { status: 502 }
    );
  }
}
