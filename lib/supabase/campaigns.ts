import { createServerSupabaseClient } from "./client";
import { CampaignBrief, GeneratedCampaign, VisualDirection, GeneratedPoster } from "@/types";
import { DbCampaignRecord, SavedCampaign, CampaignListItem } from "./types";
import { generateDemoPoster } from "@/lib/ai/demo-poster";

export interface CreateCampaignInput {
  brief: CampaignBrief;
  campaign: GeneratedCampaign;
  visualDirection: VisualDirection;
  poster?: GeneratedPoster | null;
  generationMode: "LIVE" | "DEMO";
  modelUsed?: string;
}

// In-memory fallback repository when Supabase database is unreachable or table not yet created
const inMemoryCampaignStore = new Map<string, SavedCampaign>();

function mapDbRecordToSavedCampaign(record: DbCampaignRecord): SavedCampaign {
  const brief: CampaignBrief = {
    brandName: record.brand_name,
    productName: record.product_name,
    productDescription: record.product_description,
    targetAudience: record.target_audience,
    platform: record.platform,
    campaignObjective: record.campaign_objective,
    tone: record.tone,
    offer: record.offer || undefined,
    callToAction: record.call_to_action || undefined,
    visualStyle: record.visual_style || undefined,
    additionalInstructions: record.additional_instructions || undefined,
  };

  const poster: GeneratedPoster = {
    imageUrl:
      record.poster_image_url ||
      generateDemoPoster(brief, record.generated_content, record.visual_direction)
        .imageUrl,
    mode: record.poster_mode as "LIVE" | "DEMO",
    modelUsed: record.model_used || undefined,
    visualDirection: record.visual_direction,
    overlayText: {
      brandName: record.brand_name,
      headline: record.generated_content.headline,
      offer: record.offer || undefined,
      callToAction: record.call_to_action || record.generated_content.callToAction,
    },
  };

  return {
    id: record.id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    brief,
    campaign: record.generated_content,
    poster,
    generationMode: record.generation_mode as "LIVE" | "DEMO",
    modelUsed: record.model_used || undefined,
    status: record.status,
  };
}

/**
 * Creates and persists a campaign.
 * First tries Supabase; gracefully falls back to memory store if table isn't migrated.
 */
export async function createCampaign(
  input: CreateCampaignInput
): Promise<{ id: string; storageType: "SUPABASE" | "MEMORY" }> {
  const client = createServerSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("campaigns")
        .insert({
          brand_name: input.brief.brandName,
          product_name: input.brief.productName,
          product_description: input.brief.productDescription,
          target_audience: input.brief.targetAudience,
          platform: input.brief.platform,
          campaign_objective: input.brief.campaignObjective,
          tone: input.brief.tone,
          offer: input.brief.offer || null,
          call_to_action: input.brief.callToAction || null,
          visual_style: input.brief.visualStyle || null,
          additional_instructions: input.brief.additionalInstructions || null,
          generated_content: input.campaign,
          visual_direction: input.visualDirection,
          poster_image_url: input.poster?.imageUrl || null,
          poster_mode: input.poster?.mode || "DEMO",
          generation_mode: input.generationMode,
          model_used: input.modelUsed || null,
          status: "completed",
        })
        .select("id")
        .single();

      if (!error && data?.id) {
        return { id: data.id, storageType: "SUPABASE" };
      }
      console.warn(
        `[Supabase Repository] Insert error: ${error?.message}. Using in-memory fallback.`
      );
    } catch (err) {
      console.warn(
        `[Supabase Repository] Connection error: ${(err as Error).message}. Using in-memory fallback.`
      );
    }
  }

  // In-memory fallback
  const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const savedItem: SavedCampaign = {
    id,
    createdAt: now,
    updatedAt: now,
    brief: input.brief,
    campaign: input.campaign,
    poster:
      input.poster ||
      generateDemoPoster(input.brief, input.campaign, input.visualDirection),
    generationMode: input.generationMode,
    modelUsed: input.modelUsed,
    status: "completed",
  };

  inMemoryCampaignStore.set(id, savedItem);
  return { id, storageType: "MEMORY" };
}

/**
 * Retrieves the list of campaigns for the dashboard.
 */
export async function getCampaigns(): Promise<CampaignListItem[]> {
  const client = createServerSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("campaigns")
        .select(
          "id, created_at, brand_name, product_name, generated_content, platform, campaign_objective, generation_mode, status"
        )
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((d) => ({
          id: d.id,
          createdAt: d.created_at,
          brandName: d.brand_name,
          productName: d.product_name,
          campaignTitle:
            (d.generated_content as GeneratedCampaign)?.campaignTitle ||
            `${d.brand_name} ${d.product_name} Campaign`,
          platform: d.platform,
          campaignObjective: d.campaign_objective,
          generationMode: d.generation_mode as "LIVE" | "DEMO",
          status: d.status,
        }));
      }
    } catch (err) {
      console.warn(
        `[Supabase Repository] Fetch list error: ${(err as Error).message}`
      );
    }
  }

  // In-memory list fallback
  return Array.from(inMemoryCampaignStore.values())
    .map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      brandName: item.brief.brandName,
      productName: item.brief.productName,
      campaignTitle: item.campaign.campaignTitle,
      platform: item.brief.platform,
      campaignObjective: item.brief.campaignObjective,
      generationMode: item.generationMode,
      status: item.status,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Retrieves a single campaign by ID.
 */
export async function getCampaignById(id: string): Promise<SavedCampaign | null> {
  const client = createServerSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return mapDbRecordToSavedCampaign(data as DbCampaignRecord);
      }
    } catch (err) {
      console.warn(
        `[Supabase Repository] Fetch item error: ${(err as Error).message}`
      );
    }
  }

  return inMemoryCampaignStore.get(id) || null;
}

/**
 * Deletes a campaign by ID.
 */
export async function deleteCampaign(id: string): Promise<boolean> {
  const client = createServerSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from("campaigns").delete().eq("id", id);
      if (!error) {
        inMemoryCampaignStore.delete(id);
        return true;
      }
    } catch (err) {
      console.warn(
        `[Supabase Repository] Delete error: ${(err as Error).message}`
      );
    }
  }

  return inMemoryCampaignStore.delete(id);
}
