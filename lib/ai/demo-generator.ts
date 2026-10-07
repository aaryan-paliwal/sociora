import { CampaignBrief } from "@/types";
import { GeneratedCampaign } from "@/lib/validations/generated-campaign";

/**
 * Deterministic Demo Campaign Generator
 * Used when GEMINI_API_KEY is not configured or in fallback test modes.
 * Ensures the platform is fully demonstrable to faculty without requiring cloud API keys.
 */
export function generateDemoCampaign(brief: CampaignBrief): GeneratedCampaign {
  const brand = brief.brandName.trim();
  const product = brief.productName.trim();
  const audience = brief.targetAudience.trim();
  const platform = brief.platform;
  const objective = brief.campaignObjective;
  const tone = brief.tone;
  const cta = brief.callToAction?.trim() || "Experience the Difference Today";
  const offer = brief.offer?.trim() || "Exclusive Limited-Time Offer";
  const visualStyle = brief.visualStyle || "Modern Minimalist";

  // Format hashtags based on product and brand
  const brandTag = `#${brand.replace(/[^a-zA-Z0-9]/g, "")}`;
  const productTag = `#${product.replace(/[^a-zA-Z0-9]/g, "")}`;
  const baseHashtags = [
    brandTag,
    productTag,
    "#SocialMarketing",
    "#TrendingNow",
    "#ModernCreators",
    "#DailyUpgrade",
  ];

  return {
    campaignTitle: `${brand} ${product} — ${objective} Campaign`,
    headline: `Meet ${product}: Engineered for ${audience}`,
    caption: `Say hello to ${product} by ${brand}. Crafted with intention for ${audience}, it delivers on every front.\n\n✨ Why you'll love it:\n• ${brief.productDescription}\n• Styled with a ${tone.toLowerCase()} aesthetic that stands out on ${platform}.\n\n🔥 Offer: ${offer}\n\nReady to elevate your everyday routine? ${cta}!`,
    shortCaption: `Ready for an upgrade? ${product} by ${brand} is built for ${audience}. ${offer} — ${cta}!`,
    callToAction: cta,
    hashtags: baseHashtags,
    reelIdea: `Quick 15-second high-energy product spotlight. Open with an eye-catching POV hook addressing a relatable problem for ${audience}, cut to vibrant dynamic macro shots of ${product}, and finish with bold text overlay highlighting "${offer}".`,
    storyIdea: `Interactive 3-part Story poll. Slide 1 asks ${audience} about their daily pain point; Slide 2 introduces ${product} as the smart fix; Slide 3 adds an interactive link sticker leading directly to "${cta}".`,
    carouselIdea: `A 5-slide educational breakdown: Slide 1 hook question with ${visualStyle} visuals; Slides 2-4 highlight 3 essential benefits from "${brief.productDescription}"; Slide 5 provides clear action steps with "${offer}" and a prominent "${cta}" reminder.`,
    videoStoryboard: [
      {
        scene: 1,
        description: `Hook: Fast-paced opening shot featuring a relatable everyday moment for ${audience}. Text overlay: "Tired of the usual routine?"`,
        duration: "0-3s",
      },
      {
        scene: 2,
        description: `Introduction: Smooth camera transition revealing ${product} in crisp ${visualStyle} lighting. Natural ambient sound or trending audio beat drops.`,
        duration: "3-7s",
      },
      {
        scene: 3,
        description: `Value Demonstration: Quick cut highlighting the core benefit: "${brief.productDescription.slice(0, 80)}...". Text badges reinforce quality.`,
        duration: "7-11s",
      },
      {
        scene: 4,
        description: `Call to Action: Clear end card showcasing ${brand} logo, special offer banner ("${offer}"), and prominent directional arrow pointing to "${cta}".`,
        duration: "11-15s",
      },
    ],
  };
}
