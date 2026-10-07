import { z } from "zod";

/**
 * Canonical StoryboardScene Schema
 */
export const storyboardSceneSchema = z.object({
  scene: z.number().int().positive("Scene number must be a positive integer"),
  description: z.string().min(1, "Scene description is required"),
  duration: z.string().min(1, "Scene duration is required (e.g. '0-3s')"),
});

export type StoryboardScene = z.infer<typeof storyboardSceneSchema>;

/**
 * Canonical GeneratedCampaign Schema
 * Validates the complete social marketing package produced by the Gemini AI pipeline
 * or deterministic demo mode generator.
 */
export const generatedCampaignSchema = z.object({
  campaignTitle: z.string().min(1, "Campaign title is required"),
  headline: z.string().min(1, "Headline is required"),
  caption: z.string().min(1, "Primary caption is required"),
  shortCaption: z.string().min(1, "Short caption is required"),
  callToAction: z.string().min(1, "Call to action is required"),
  hashtags: z
    .array(z.string().min(1))
    .min(3, "At least 3 hashtags are required"),
  reelIdea: z.string().min(1, "Reel idea is required"),
  storyIdea: z.string().min(1, "Story idea is required"),
  carouselIdea: z.string().min(1, "Carousel idea is required"),
  videoStoryboard: z
    .array(storyboardSceneSchema)
    .min(2, "At least 2 storyboard scenes are required"),
});

export type GeneratedCampaign = z.infer<typeof generatedCampaignSchema>;

/**
 * Standard API Response Contracts
 */
export interface CampaignGenerateSuccessResponse {
  success: true;
  data: GeneratedCampaign;
  mode: "LIVE" | "DEMO";
  modelUsed?: string;
}

export interface CampaignGenerateErrorResponse {
  success: false;
  error: {
    code:
      | "INVALID_REQUEST"
      | "CONFIG_ERROR"
      | "RATE_LIMIT"
      | "TIMEOUT"
      | "AI_GENERATION_FAILED"
      | "INTERNAL_ERROR";
    message: string;
  };
}

export type CampaignGenerateApiResponse =
  | CampaignGenerateSuccessResponse
  | CampaignGenerateErrorResponse;
