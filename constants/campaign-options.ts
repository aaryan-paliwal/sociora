/**
 * Sociora - Centralized Campaign Options & Constants
 * Used across forms, validation schemas, previews, and AI prompts.
 */

export const PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "X",
  "YouTube Shorts",
] as const;

export type PlatformOption = (typeof PLATFORMS)[number];

export const CAMPAIGN_OBJECTIVES = [
  "Product Launch",
  "Promotion",
  "Brand Awareness",
  "Festival Campaign",
  "Sale / Discount",
  "Event Promotion",
  "Educational",
  "Engagement",
] as const;

export type CampaignObjectiveOption = (typeof CAMPAIGN_OBJECTIVES)[number];

export const TONES = [
  "Professional",
  "Premium",
  "Minimal",
  "Youthful",
  "Fun",
  "Luxury",
  "Bold",
  "Friendly",
] as const;

export type ToneOption = (typeof TONES)[number];

export const VISUAL_STYLES = [
  "Minimal",
  "Modern",
  "Bold",
  "Luxury",
  "Playful",
  "Editorial",
  "Cinematic",
  "Corporate",
] as const;

export type VisualStyleOption = (typeof VISUAL_STYLES)[number];

export const EXAMPLE_CAMPAIGN_BRIEF = {
  brandName: "BrewHouse",
  productName: "Cold Brew Coffee",
  productDescription:
    "A smooth bottled cold brew coffee designed for students and young professionals.",
  targetAudience: "College students and young professionals aged 18–30",
  platform: "Instagram" as PlatformOption,
  campaignObjective: "Festival Campaign" as CampaignObjectiveOption,
  tone: "Youthful" as ToneOption,
  offer: "20% off for the festive season",
  callToAction: "Order Now",
  visualStyle: "Modern" as VisualStyleOption,
  additionalInstructions: "Highlight refreshed energy and smooth rich texture.",
};
