/**
 * Sociora - Core Domain Types
 * Single canonical contracts for campaigns, briefs, social content, and visual generation.
 */

import type {
  PlatformOption,
  CampaignObjectiveOption,
  ToneOption,
  VisualStyleOption,
} from "@/constants/campaign-options";
import type {
  GeneratedCampaign,
  StoryboardScene,
} from "@/lib/validations/generated-campaign";
import type {
  VisualDirection,
  GeneratedPoster,
} from "@/lib/validations/visual-direction";

export type {
  PlatformOption,
  CampaignObjectiveOption,
  ToneOption,
  VisualStyleOption,
  GeneratedCampaign,
  StoryboardScene,
  VisualDirection,
  GeneratedPoster,
};

/**
 * Canonical CampaignBrief Contract
 * Consumed by the campaign form, validation schema, brief preview, Gemini AI pipeline, and visual generator.
 */
export interface CampaignBrief {
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  platform: PlatformOption | string;
  campaignObjective: CampaignObjectiveOption | string;
  tone: ToneOption | string;
  offer?: string;
  callToAction?: string;
  visualStyle?: VisualStyleOption | string;
  additionalInstructions?: string;
}

export type ContentFormat =
  | "poster"
  | "caption"
  | "headline"
  | "cta"
  | "hashtags"
  | "reel_concept"
  | "storyboard"
  | "story_idea"
  | "carousel";
