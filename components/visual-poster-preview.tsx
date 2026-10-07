"use client";

import { useState } from "react";
import { GeneratedPoster } from "@/lib/validations/visual-direction";
import {
  Palette,
  Download,
  RotateCcw,
  Sparkles,
  Bot,
  Zap,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface VisualPosterPreviewProps {
  poster: GeneratedPoster | null;
  isLoading: boolean;
  error: string | null;
  onRegenerateVisual: () => void;
}

export function VisualPosterPreview({
  poster,
  isLoading,
  error,
  onRegenerateVisual,
}: VisualPosterPreviewProps) {
  const [showDirection, setShowDirection] = useState(false);

  const handleDownload = () => {
    if (!poster?.imageUrl) return;

    try {
      const link = document.createElement("a");
      link.href = poster.imageUrl;
      link.download = `${poster.overlayText.brandName.toLowerCase()}-poster.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback: open in new tab
      window.open(poster.imageUrl, "_blank");
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                poster?.mode === "LIVE"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
              }`}
            >
              {poster?.mode === "LIVE" ? (
                <>
                  <Zap className="h-3 w-3 text-emerald-400" />
                  <span>AI Generated Visual</span>
                </>
              ) : (
                <>
                  <Bot className="h-3 w-3 text-amber-400" />
                  <span>Demo Visual Poster</span>
                </>
              )}
            </span>

            {poster?.visualDirection?.platformFormat && (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                {poster.visualDirection.aspectRatio}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-400" />
            <span>Promotional Visual & Poster</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered layout tailored for {poster?.visualDirection?.platformFormat || "Social Feed"}
          </p>
        </div>

        {/* Visual Controls */}
        <div className="flex items-center gap-2.5">
          {poster && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Download Poster</span>
            </button>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={onRegenerateVisual}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Regenerate Visual</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state if visual generation failed */}
      {error && (
        <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-4 flex items-start gap-3 text-xs text-pink-300">
          <AlertCircle className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-pink-200">
              Visual generation notice:
            </span>{" "}
            {error}
          </div>
          <button
            type="button"
            onClick={onRegenerateVisual}
            className="text-xs text-pink-200 underline hover:text-white"
          >
            Retry Visual
          </button>
        </div>
      )}

      {/* Poster Preview Window */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-16 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
          <p className="text-sm font-medium text-slate-200">
            Synthesizing Visual Layout & Artwork...
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Applying brand palette, commercial lighting, and conversion typography.
          </p>
        </div>
      ) : poster ? (
        <div className="space-y-6">
          <div className="flex justify-center bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-800">
            <div className="relative max-w-md w-full overflow-hidden rounded-xl shadow-2xl border border-slate-700/50">
              {/* Render Image / SVG data URI */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster.imageUrl}
                alt={`${poster.overlayText.brandName} Promotional Poster`}
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>

          {/* Quick Palette Swatch Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Palette Applied:</span>
              <div className="flex items-center gap-1.5 ml-1">
                {poster.visualDirection.colorPalette.map((col, idx) => (
                  <span
                    key={idx}
                    title={col}
                    className="h-4 w-4 rounded-full border border-white/20 inline-block shadow-sm"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDirection(!showDirection)}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <span>{showDirection ? "Hide" : "Inspect"} Creative Direction</span>
              {showDirection ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Collapsible Creative Direction Breakdown (For Faculty Demo) */}
          {showDirection && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Structured Creative Direction Specification</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Derived from Campaign Brief + AI Copywriting
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Visual Concept</span>
                  <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {poster.visualDirection.visualConcept}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Composition</span>
                  <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {poster.visualDirection.composition}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Typography Hierarchy</span>
                  <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {poster.visualDirection.typographyDirection}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Imagery & Lighting</span>
                  <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {poster.visualDirection.imageryDirection}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium text-xs">Synthesized Image Model Prompt</span>
                <pre className="mt-1.5 overflow-x-auto rounded-lg bg-slate-900/80 p-3 font-mono text-[11px] text-slate-300 border border-slate-800/80 whitespace-pre-wrap">
                  {poster.visualDirection.imagePrompt}
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
