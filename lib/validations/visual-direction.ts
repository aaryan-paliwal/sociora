import { z } from "zod";

/**
 * Platform Format mapping configuration
 */
export const PLATFORM_ASPECT_RATIOS: Record<
  string,
  { label: string; ratio: string; width: number; height: number; cssRatio: string }
> = {
  Instagram: {
    label: "4:5 Portrait Feed / Promotional Post",
    ratio: "4:5",
    width: 1080,
    height: 1350,
    cssRatio: "4/5",
  },
  Facebook: {
    label: "1:1 Square Feed / Promo Post",
    ratio: "1:1",
    width: 1200,
    height: 1200,
    cssRatio: "1/1",
  },
  LinkedIn: {
    label: "1:1 Professional Showcase",
    ratio: "1:1",
    width: 1200,
    height: 1200,
    cssRatio: "1/1",
  },
  X: {
    label: "16:9 Landscape Feed Card",
    ratio: "16:9",
    width: 1200,
    height: 675,
    cssRatio: "16/9",
  },
  "YouTube Shorts": {
    label: "9:16 Fullscreen Vertical",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    cssRatio: "9/16",
  },
};

/**
 * Canonical VisualDirection Zod Schema
 */
export const visualDirectionSchema = z.object({
  visualConcept: z.string().min(1, "Visual concept is required"),
  composition: z.string().min(1, "Composition direction is required"),
  colorPalette: z
    .array(z.string().min(1))
    .min(3, "At least 3 color palette hex/name values are required"),
  typographyDirection: z.string().min(1, "Typography direction is required"),
  imageryDirection: z.string().min(1, "Imagery direction is required"),
  layoutDirection: z.string().min(1, "Layout direction is required"),
  platformFormat: z.string().min(1, "Platform format is required"),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  imagePrompt: z.string().min(1, "Image prompt is required"),
});

export type VisualDirection = z.infer<typeof visualDirectionSchema>;

/**
 * Canonical GeneratedPoster Schema
 */
export const generatedPosterSchema = z.object({
  imageUrl: z.string().min(1, "Poster image URL or data URI is required"),
  mode: z.enum(["LIVE", "DEMO"]),
  modelUsed: z.string().optional(),
  visualDirection: visualDirectionSchema,
  overlayText: z.object({
    brandName: z.string(),
    headline: z.string(),
    offer: z.string().optional(),
    callToAction: z.string(),
  }),
});

export type GeneratedPoster = z.infer<typeof generatedPosterSchema>;
