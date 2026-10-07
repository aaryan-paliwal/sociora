import { CampaignBrief, GeneratedCampaign, VisualDirection, GeneratedPoster } from "@/types";

/**
 * Database Campaign Record representation in Supabase
 */
export interface DbCampaignRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  brand_name: string;
  product_name: string;
  product_description: string;
  target_audience: string;
  platform: string;
  campaign_objective: string;
  tone: string;
  offer?: string | null;
  call_to_action?: string | null;
  visual_style?: string | null;
  additional_instructions?: string | null;
  generated_content: GeneratedCampaign;
  visual_direction: VisualDirection;
  poster_image_url?: string | null;
  poster_mode: "LIVE" | "DEMO";
  generation_mode: "LIVE" | "DEMO";
  model_used?: string | null;
  status: string;
}

/**
 * Normalized SavedCampaign Model returned to the application layer
 */
export interface SavedCampaign {
  id: string;
  createdAt: string;
  updatedAt: string;
  brief: CampaignBrief;
  campaign: GeneratedCampaign;
  poster: GeneratedPoster;
  generationMode: "LIVE" | "DEMO";
  modelUsed?: string;
  status: string;
}

/**
 * Summary representation for Dashboard list view
 */
export interface CampaignListItem {
  id: string;
  createdAt: string;
  brandName: string;
  productName: string;
  campaignTitle: string;
  platform: string;
  campaignObjective: string;
  generationMode: "LIVE" | "DEMO";
  status: string;
}
