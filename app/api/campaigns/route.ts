import { NextRequest, NextResponse } from "next/server";
import { GeneratedPoster } from "@/lib/validations/visual-direction";
import { campaignBriefSchema } from "@/lib/validations/campaign";
import { generatedCampaignSchema } from "@/lib/validations/generated-campaign";
import { visualDirectionSchema } from "@/lib/validations/visual-direction";
import {
  createCampaign,
  getCampaigns,
} from "@/lib/supabase/campaigns";

export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json({ success: true, campaigns }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: (error as Error).message || "Failed to load campaigns",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_REQUEST", message: "Malformed JSON payload" },
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_REQUEST", message: "Invalid request body" },
        },
        { status: 400 }
      );
    }

    const {
      brief,
      campaign,
      visualDirection,
      poster,
      generationMode,
      modelUsed,
    } = body as {
      brief: unknown;
      campaign: unknown;
      visualDirection: unknown;
      poster?: unknown;
      generationMode?: unknown;
      modelUsed?: unknown;
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

    // 3. Validate visual direction
    const visualValidation = visualDirectionSchema.safeParse(visualDirection);
    if (!visualValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: `Visual direction error: ${visualValidation.error.issues[0]?.message}`,
          },
        },
        { status: 400 }
      );
    }

    // 4. Save campaign
    const result = await createCampaign({
      brief: briefValidation.data,
      campaign: campaignValidation.data,
      visualDirection: visualValidation.data,
      poster: (poster as GeneratedPoster) || null,
      generationMode: generationMode === "LIVE" ? "LIVE" : "DEMO",
      modelUsed: typeof modelUsed === "string" ? modelUsed : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        campaignId: result.id,
        storageType: result.storageType,
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("[API /api/campaigns] Error saving campaign:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SAVE_FAILED",
          message: "Failed to save campaign. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
