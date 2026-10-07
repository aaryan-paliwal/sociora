"use client";

import { useState } from "react";
import { GeneratedCampaign } from "@/lib/validations/generated-campaign";
import { GeneratedPoster } from "@/lib/validations/visual-direction";
import { CampaignBrief } from "@/types";
import { VisualPosterPreview } from "@/components/visual-poster-preview";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Film,
  Layers,
  Clock,
  Hash,
  MessageSquare,
  BookmarkCheck,
  Bot,
  Zap,
} from "lucide-react";

interface GeneratedCampaignViewProps {
  campaign: GeneratedCampaign;
  brief: CampaignBrief;
  poster: GeneratedPoster | null;
  isPosterLoading: boolean;
  posterError: string | null;
  mode: "LIVE" | "DEMO";
  modelUsed?: string;
  isSaving?: boolean;
  isSaved?: boolean;
  savedCampaignId?: string | null;
  onSaveCampaign?: () => void;
  onRegenerate: () => void;
  onRegenerateVisual: () => void;
  onEditBrief: () => void;
}

export function GeneratedCampaignView({
  campaign,
  brief,
  poster,
  isPosterLoading,
  posterError,
  mode,
  modelUsed,
  isSaving,
  isSaved,
  onSaveCampaign,
  onRegenerate,
  onRegenerateVisual,
  onEditBrief,
}: GeneratedCampaignViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      console.warn("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Visual Creative / Poster Section */}
      <VisualPosterPreview
        poster={poster}
        isLoading={isPosterLoading}
        error={posterError}
        onRegenerateVisual={onRegenerateVisual}
      />
      {/* Top Header Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  mode === "LIVE"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                }`}
              >
                {mode === "LIVE" ? (
                  <>
                    <Zap className="h-3 w-3 text-emerald-400" />
                    <span>Live AI Generation</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 text-amber-400" />
                    <span>Deterministic Demo Mode</span>
                  </>
                )}
              </span>

              {modelUsed && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                  {modelUsed}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {campaign.campaignTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Generated for <span className="text-slate-200">{brief.brandName}</span> ({brief.platform} • {brief.campaignObjective})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onSaveCampaign && (
              <button
                type="button"
                disabled={isSaving || isSaved}
                onClick={onSaveCampaign}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-all ${
                  isSaved
                    ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20"
                }`}
              >
                {isSaving ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Campaign Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    <span>Save Campaign</span>
                  </>
                )}
              </button>
            )}

            {isSaved && (
              <a
                href="/dashboard"
                className="rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-3.5 py-2.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 transition-colors"
              >
                View in Dashboard
              </a>
            )}

            <button
              type="button"
              onClick={onEditBrief}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Edit Brief
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Regenerate Campaign</span>
            </button>
          </div>
        </div>

        {/* Notice for Demo Mode */}
        {mode === "DEMO" && (
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-200/90 flex items-start gap-2.5">
            <Bot className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Demo Mode Active:</span>{" "}
              GEMINI_API_KEY was not detected in environment variables. Sociora provided a high-quality deterministic simulation for demonstration. Configure your API key to activate real-time Gemini 3.8 Flash live synthesis.
            </div>
          </div>
        )}
      </div>

      {/* Grid of Generated Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Core Copywriting */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Headline & Primary Caption */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Headline & Copywriting</span>
              </h3>
              <span className="text-xs text-slate-400">Core Feed Content</span>
            </div>

            {/* Hook Headline */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Hook Headline</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(campaign.headline, "headline")}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === "headline" ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-lg font-bold text-white bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 leading-snug">
                &ldquo;{campaign.headline}&rdquo;
              </p>
            </div>

            {/* Primary Caption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Primary Caption</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(campaign.caption, "caption")}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === "caption" ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm text-slate-200 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                {campaign.caption}
              </div>
            </div>

            {/* Short Caption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Short Caption (Punchy / Feed)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(campaign.shortCaption, "shortCaption")}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === "shortCaption" ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {campaign.shortCaption}
              </p>
            </div>

            {/* Call To Action & Hashtags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="text-xs font-medium text-slate-400 mb-1">Call to Action (CTA)</div>
                <div className="text-sm font-semibold text-indigo-300">
                  {campaign.callToAction}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Hash className="h-3 w-3 text-pink-400" />
                    <span>Hashtags ({campaign.hashtags.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(campaign.hashtags.join(" "), "hashtags")}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedKey === "hashtags" ? "Copied" : "Copy All"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {campaign.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Video Storyboard */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <Film className="h-4 w-4 text-purple-400" />
                <span>Short-Video Storyboard</span>
              </h3>
              <span className="text-xs text-slate-400">
                {campaign.videoStoryboard.length} Scenes
              </span>
            </div>

            <div className="space-y-3">
              {campaign.videoStoryboard.map((scene) => (
                <div
                  key={scene.scene}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs shrink-0 mt-0.5">
                      {scene.scene}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {scene.description}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 shrink-0 self-end sm:self-center">
                    <Clock className="h-3 w-3" />
                    <span>{scene.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Creative Concepts (Reel, Story, Carousel) */}
        <div className="space-y-6">
          {/* Reel Idea */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
              <Film className="h-4 w-4" />
              <span>Reel / Short Video Concept</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
              {campaign.reelIdea}
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(campaign.reelIdea, "reel")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedKey === "reel" ? "Copied concept" : "Copy Reel Concept"}
            </button>
          </div>

          {/* Story Idea */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <MessageSquare className="h-4 w-4" />
              <span>Story Concept</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
              {campaign.storyIdea}
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(campaign.storyIdea, "story")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedKey === "story" ? "Copied concept" : "Copy Story Concept"}
            </button>
          </div>

          {/* Carousel Idea */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Layers className="h-4 w-4" />
              <span>Multi-Slide Carousel</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
              {campaign.carouselIdea}
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(campaign.carouselIdea, "carousel")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedKey === "carousel" ? "Copied concept" : "Copy Carousel Idea"}
            </button>
          </div>

          {/* College Demonstration Badge */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-xs text-slate-400 flex items-start gap-2.5">
            <BookmarkCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-300">Phase Status:</span>{" "}
              AI text generation complete. All campaign items conform to canonical typed schemas and are ready for future image generation and database persistence.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
