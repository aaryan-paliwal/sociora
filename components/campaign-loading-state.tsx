import { Loader2, Sparkles, Bot, Layers } from "lucide-react";

interface CampaignLoadingStateProps {
  brandName: string;
  productName: string;
}

export function CampaignLoadingState({
  brandName,
  productName,
}: CampaignLoadingStateProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-8 sm:p-12 backdrop-blur-md shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 relative">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <Sparkles className="h-4 w-4 text-violet-400 absolute top-2 right-2 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Generating Social Campaign...
        </h3>
        <p className="text-sm text-slate-400">
          Synthesizing marketing copy, viral reel concepts, storyboards, and carousels for{" "}
          <span className="text-slate-200 font-medium">
            {brandName} ({productName})
          </span>
          .
        </p>
      </div>

      {/* Animated Step Cards */}
      <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="rounded-xl border border-indigo-500/20 bg-slate-950/60 p-3 flex flex-col items-center gap-1.5 text-indigo-300">
          <Bot className="h-4 w-4" />
          <span>Analyzing Brief</span>
        </div>
        <div className="rounded-xl border border-purple-500/20 bg-slate-950/60 p-3 flex flex-col items-center gap-1.5 text-purple-300 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>Crafting Copy & Reels</span>
        </div>
        <div className="rounded-xl border border-pink-500/20 bg-slate-950/60 p-3 flex flex-col items-center gap-1.5 text-pink-300">
          <Layers className="h-4 w-4" />
          <span>Validating Schema</span>
        </div>
      </div>

      <p className="text-[11px] font-mono text-slate-500 pt-2">
        Powered by Google Gemini 3.8 Flash • Low Latency Reasoning
      </p>
    </div>
  );
}
