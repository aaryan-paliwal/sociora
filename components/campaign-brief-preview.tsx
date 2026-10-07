import { CampaignBrief } from "@/types";
import {
  Sparkles,
  Share2,
  Target,
  Palette,
  Tag,
  CheckCircle2,
  RotateCcw,
  Send,
  Loader2,
  AlertCircle,
  Bot,
} from "lucide-react";

interface CampaignBriefPreviewProps {
  brief: CampaignBrief;
  isGenerating: boolean;
  generationError: string | null;
  onEdit: () => void;
  onReset: () => void;
  onGenerate: () => void;
}

export function CampaignBriefPreview({
  brief,
  isGenerating,
  generationError,
  onEdit,
  onReset,
  onGenerate,
}: CampaignBriefPreviewProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-indigo-950/40 space-y-6">
      {/* Ready Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Campaign brief ready
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Normalized contract ready to generate via Google Gemini AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onEdit}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Edit Brief
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            <span>New Brief</span>
          </button>
        </div>
      </div>

      {/* Structured Brief Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product / Brand Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Product Identity</span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Brand & Product</div>
            <div className="text-base font-semibold text-white mt-0.5">
              {brief.brandName} — {brief.productName}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Description</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              {brief.productDescription}
            </p>
          </div>
        </div>

        {/* Strategy / Targeting Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Target className="h-3.5 w-3.5" />
            <span>Audience & Strategy</span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Target Audience</div>
            <div className="text-sm font-medium text-slate-200 mt-0.5">
              {brief.targetAudience}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-xs text-slate-400">Platform</div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 mt-1 rounded bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20">
                <Share2 className="h-3 w-3" />
                <span>{brief.platform}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Objective</div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 mt-1 rounded bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                <span>{brief.campaignObjective}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-xs text-slate-400">Tone / Style</div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 mt-1 rounded bg-purple-500/10 px-2 py-0.5 border border-purple-500/20">
                <Palette className="h-3 w-3" />
                <span>{brief.tone}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Visual Aesthetic</div>
              <div className="text-xs font-medium text-slate-300 mt-1">
                {brief.visualStyle || "Default Modern"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional details (Offer, CTA, Notes) */}
      {(brief.offer || brief.callToAction || brief.additionalInstructions) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {brief.offer && (
            <div>
              <span className="text-slate-400 flex items-center gap-1">
                <Tag className="h-3 w-3 text-pink-400" />
                <span>Special Offer</span>
              </span>
              <p className="font-medium text-slate-200 mt-1">{brief.offer}</p>
            </div>
          )}

          {brief.callToAction && (
            <div>
              <span className="text-slate-400">Call to Action (CTA)</span>
              <p className="font-semibold text-indigo-300 mt-1">
                &ldquo;{brief.callToAction}&rdquo;
              </p>
            </div>
          )}

          {brief.additionalInstructions && (
            <div className={brief.offer && brief.callToAction ? "col-span-1" : "col-span-2"}>
              <span className="text-slate-400">Additional Instructions</span>
              <p className="font-normal text-slate-300 mt-1">
                {brief.additionalInstructions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Banner if Generation Failed */}
      {generationError && (
        <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-4 flex items-start gap-3 text-xs text-pink-300">
          <AlertCircle className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-pink-200">Generation failed:</span>{" "}
            {generationError}
          </div>
        </div>
      )}

      {/* Primary Action Button to Trigger Generation */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-400" />
          <span>
            Generates 10 social assets in a single structured Gemini call
          </span>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Generating Campaign with Gemini...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Generate Campaign</span>
            </>
          )}
        </button>
      </div>

      {/* Raw JSON Contract Inspection */}
      <div className="border-t border-slate-800 pt-4">
        <details className="text-xs text-slate-400 group">
          <summary className="cursor-pointer hover:text-slate-200 select-none font-mono flex items-center gap-2">
            <span>[+] View normalized JSON payload (Canonical CampaignBrief)</span>
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-[11px] text-slate-300 border border-slate-800/80">
            {JSON.stringify(brief, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
