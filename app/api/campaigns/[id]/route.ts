import { NextRequest, NextResponse } from "next/server";
import { getCampaignById, deleteCampaign } from "@/lib/supabase/campaigns";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_ID", message: "Campaign ID is required" } },
        { status: 400 }
      );
    }

    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, campaign }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_FAILED", message: (error as Error).message },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_ID", message: "Campaign ID is required" } },
        { status: 400 }
      );
    }

    const deleted = await deleteCampaign(id);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DELETE_FAILED", message: "Campaign not found or could not be deleted" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DELETE_FAILED", message: (error as Error).message },
      },
      { status: 500 }
    );
  }
}
