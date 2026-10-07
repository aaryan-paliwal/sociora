import { CampaignBrief, GeneratedCampaign } from "@/types";
import {
  VisualDirection,
  PLATFORM_ASPECT_RATIOS,
  visualDirectionSchema,
} from "@/lib/validations/visual-direction";

/**
 * Maps tone and visual style to curated aesthetic color palettes.
 */
function deriveColorPalette(brief: CampaignBrief): string[] {
  const tone = brief.tone.toLowerCase();
  const visualStyle = (brief.visualStyle || "").toLowerCase();

  if (tone.includes("luxury") || visualStyle.includes("luxury")) {
    return ["#0A0A0C", "#D4AF37", "#1E1E24", "#F5E6C8", "#8C7853"];
  }
  if (tone.includes("youthful") || tone.includes("fun") || visualStyle.includes("playful")) {
    return ["#6366F1", "#EC4899", "#8B5CF6", "#FDE047", "#0F172A"];
  }
  if (tone.includes("minimal") || visualStyle.includes("minimal")) {
    return ["#0F172A", "#334155", "#94A3B8", "#F8FAFC", "#64748B"];
  }
  if (tone.includes("bold") || visualStyle.includes("bold")) {
    return ["#090A0F", "#EF4444", "#F97316", "#FFFFFF", "#1E293B"];
  }
  if (visualStyle.includes("cinematic")) {
    return ["#030712", "#1E1B4B", "#38BDF8", "#F43F5E", "#E2E8F0"];
  }

  // Default Modern Saas / Product palette
  return ["#0B0F19", "#4F46E5", "#06B6D4", "#F1F5F9", "#1E293B"];
}

/**
 * Synthesizes a structured Creative Visual Direction derived from
 * the user's CampaignBrief and the generated copywriting.
 */
export function generateVisualDirection(
  brief: CampaignBrief,
  campaign: GeneratedCampaign
): VisualDirection {
  const platformConfig =
    PLATFORM_ASPECT_RATIOS[brief.platform] || PLATFORM_ASPECT_RATIOS["Instagram"];
  const colors = deriveColorPalette(brief);
  const visualStyle = brief.visualStyle || "Modern Clean";

  const visualConcept = `${visualStyle} promotional visual hero composition for ${brief.brandName} ${brief.productName}, tailored for ${brief.platform} audiences interested in ${brief.targetAudience}. Featuring a distinct ${brief.tone.toLowerCase()} atmosphere that anchors the message "${campaign.headline}".`;

  const composition = `Balanced ${platformConfig.ratio} framed focal layout with intentional negative breathing room. Hero product placement in the optical center or lower third, accompanied by soft directional rim lighting to preserve visual clarity for headline and CTA placement.`;

  const typographyDirection = `High-contrast sans-serif typographic hierarchy. Bold impactful title scale for headline ("${campaign.headline.slice(0, 45)}..."), secondary badge styling for promotional offer ("${brief.offer || "Special Feature"}"), and an accessible, elevated button aesthetic for "${campaign.callToAction}".`;

  const imageryDirection = `Premium commercial product rendering/photography style. Rich textures emphasizing the core product essence ("${brief.productDescription.slice(0, 100)}..."), subtle ambient atmospheric gradients, dynamic lighting highlights, and zero distracting clutter.`;

  const layoutDirection = `Optimized for ${brief.platform} feed conversion: Clear visual anchor at the center, upper region reserved for brand/headline, lower region supporting the conversion callout.`;

  // Comprehensive image synthesis prompt
  const imagePrompt = `Commercial product photography advertisement background for ${brief.brandName} ${brief.productName}. ${visualConcept} ${composition} Color theme: ${colors.slice(0, 3).join(", ")}. Lighting: soft cinematic studio illumination with subtle accent edge glow. Aesthetic: ${visualStyle}, ${brief.tone.toLowerCase()}, ultra-clean negative space, highly detailed 8k commercial quality, no distorted or scrambled random text. Aspect ratio ${platformConfig.ratio}.`;

  const direction: VisualDirection = {
    visualConcept,
    composition,
    colorPalette: colors,
    typographyDirection,
    imageryDirection,
    layoutDirection,
    platformFormat: `${brief.platform} (${platformConfig.label})`,
    aspectRatio: platformConfig.ratio,
    imagePrompt,
  };

  return visualDirectionSchema.parse(direction);
}
