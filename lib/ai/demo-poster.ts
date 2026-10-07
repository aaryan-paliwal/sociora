import { CampaignBrief, GeneratedCampaign } from "@/types";
import {
  VisualDirection,
  GeneratedPoster,
  PLATFORM_ASPECT_RATIOS,
} from "@/lib/validations/visual-direction";

/**
 * Generates an SVG Data URI containing an intentional, high-fidelity promotional poster.
 * Uses exact brand colors, gradient backdrops, geometric framing, and typography composition.
 */
export function generateDemoPosterSvg(
  brief: CampaignBrief,
  campaign: GeneratedCampaign,
  direction: VisualDirection
): string {
  const platformConfig =
    PLATFORM_ASPECT_RATIOS[brief.platform] || PLATFORM_ASPECT_RATIOS["Instagram"];
  const width = platformConfig.width;
  const height = platformConfig.height;

  const primaryColor = direction.colorPalette[0] || "#0B0F19";
  const accent1 = direction.colorPalette[1] || "#4F46E5";
  const accent2 = direction.colorPalette[2] || "#06B6D4";
  const textColor = direction.colorPalette[3] || "#FFFFFF";

  // Escape XML entities
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const brand = escapeXml(brief.brandName.toUpperCase());
  const headline = escapeXml(campaign.headline);
  const product = escapeXml(brief.productName);
  const offer = brief.offer ? escapeXml(brief.offer) : "";
  const cta = escapeXml(campaign.callToAction);
  const platform = escapeXml(brief.platform);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="${primaryColor}"/>
    </linearGradient>

    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent1}"/>
      <stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>

    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="${accent1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
    </radialGradient>

    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <circle cx="${width / 2}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.4}" fill="url(#glow)"/>

  <!-- Subtle framing lines -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="none" stroke="${accent1}" stroke-opacity="0.2" stroke-width="2"/>

  <!-- Brand Tag (Top Left) -->
  <rect x="80" y="80" width="180" height="40" rx="10" fill="${accent1}" fill-opacity="0.15" stroke="${accent1}" stroke-opacity="0.3"/>
  <text x="170" y="105" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="${textColor}" text-anchor="middle" letter-spacing="3">${brand}</text>

  <!-- Platform Badge (Top Right) -->
  <text x="${width - 90}" y="105" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#94A3B8" text-anchor="end">${platform} • ${brief.campaignObjective}</text>

  <!-- Headline & Product in Hero Center -->
  <g transform="translate(0, ${height * 0.22})">
    <text x="${width / 2}" y="0" font-family="system-ui, sans-serif" font-size="${width > 1000 ? 54 : 38}" font-weight="900" fill="#FFFFFF" text-anchor="middle" filter="url(#shadow)">
      ${headline}
    </text>
    <text x="${width / 2}" y="65" font-family="system-ui, sans-serif" font-size="24" font-weight="500" fill="#94A3B8" text-anchor="middle" letter-spacing="1">
      ${product}
    </text>
  </g>

  <!-- Stylized Central Product Emblem/Artwork Plate -->
  <g transform="translate(${width / 2}, ${height * 0.52})">
    <rect x="-180" y="-120" width="360" height="240" rx="28" fill="#1E293B" fill-opacity="0.6" stroke="url(#accentGrad)" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="-20" r="45" fill="url(#accentGrad)" fill-opacity="0.2"/>
    <!-- Abstract Sparkle / Camera Aperture icon in center -->
    <path d="M 0 -45 L 6 -26 L 25 -20 L 6 -14 L 0 5 L -6 -14 L -25 -20 L -6 -26 Z" fill="${accent2}"/>
    <text x="0" y="45" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">${product}</text>
    <text x="0" y="75" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#CBD5E1" text-anchor="middle">${escapeXml(brief.visualStyle || "Modern Commercial Aesthetic")}</text>
  </g>

  <!-- Bottom Promotional Banner & CTA -->
  <g transform="translate(0, ${height * 0.78})">
    ${
      offer
        ? `<rect x="${width / 2 - 200}" y="0" width="400" height="42" rx="21" fill="#BE185D" fill-opacity="0.25" stroke="#F43F5E" stroke-opacity="0.4"/>
           <text x="${width / 2}" y="27" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#F472B6" text-anchor="middle">★ ${offer} ★</text>`
        : ""
    }

    <!-- Call to action button -->
    <rect x="${width / 2 - 150}" y="60" width="300" height="60" rx="18" fill="url(#accentGrad)" filter="url(#shadow)"/>
    <text x="${width / 2}" y="98" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      ${cta} →
    </text>

    <!-- Watermark / Footnote -->
    <text x="${width / 2}" y="160" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#64748B" text-anchor="middle">
      Designed with Sociora • AI Social Content Studio
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

/**
 * Creates the complete GeneratedPoster contract in demo mode.
 */
export function generateDemoPoster(
  brief: CampaignBrief,
  campaign: GeneratedCampaign,
  direction: VisualDirection
): GeneratedPoster {
  const svgDataUri = generateDemoPosterSvg(brief, campaign, direction);

  return {
    imageUrl: svgDataUri,
    mode: "DEMO",
    visualDirection: direction,
    overlayText: {
      brandName: brief.brandName,
      headline: campaign.headline,
      offer: brief.offer || undefined,
      callToAction: campaign.callToAction,
    },
  };
}
