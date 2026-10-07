import { z } from "zod";
import {
  PLATFORMS,
  CAMPAIGN_OBJECTIVES,
  TONES,
  VISUAL_STYLES,
} from "@/constants/campaign-options";

export const campaignBriefSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(80, "Brand name must be 80 characters or fewer"),
  productName: z
    .string()
    .trim()
    .min(1, "Product or service name is required")
    .max(100, "Product name must be 100 characters or fewer"),
  productDescription: z
    .string()
    .trim()
    .min(
      15,
      "Please provide at least 15 characters so the AI can understand your product"
    )
    .max(1000, "Product description must be 1,000 characters or fewer"),
  targetAudience: z
    .string()
    .trim()
    .min(1, "Target audience is required")
    .max(200, "Target audience must be 200 characters or fewer"),
  platform: z.enum(PLATFORMS, {
    message: "Please select a supported platform",
  }),
  campaignObjective: z.enum(CAMPAIGN_OBJECTIVES, {
    message: "Please select a valid campaign objective",
  }),
  tone: z.enum(TONES, {
    message: "Please select a tone/style",
  }),
  offer: z
    .string()
    .trim()
    .max(120, "Offer must be 120 characters or fewer")
    .optional(),
  callToAction: z
    .string()
    .trim()
    .max(60, "Call to action must be 60 characters or fewer")
    .optional(),
  visualStyle: z.enum(VISUAL_STYLES).optional().or(z.literal("")),
  additionalInstructions: z
    .string()
    .trim()
    .max(500, "Additional instructions must be 500 characters or fewer")
    .optional(),
});

export type CampaignBriefFormValues = z.infer<typeof campaignBriefSchema>;
