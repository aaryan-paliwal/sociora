"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  FolderOpen,
  Calendar,
  Layers,
  Trash2,
  ExternalLink,
  Bot,
  Zap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { CampaignListItem } from "@/lib/supabase/types";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.campaigns)) {
            setCampaigns(data.campaigns);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch campaigns:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete campaign.");
      }
    } catch {
      alert("Error deleting campaign.");
    } finally {
      setDeletingId(null);
    }
  };

  const platformsCount = new Set(campaigns.map((c) => c.platform)).size;
  const latestDate = campaigns[0]
    ? new Date(campaigns[0].createdAt).toLocaleDateString()
    : "None";

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Campaign Studio Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your AI-generated marketing campaigns, visual posters, and creative packs.
          </p>
        </div>

        <Link
          href="/campaigns/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Campaigns
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{campaigns.length}</div>
          <div className="mt-1 text-xs text-slate-500">Saved in workspace</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Platforms Covered
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{platformsCount}</div>
          <div className="mt-1 text-xs text-slate-500">Distinct channels targeted</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Latest Generation
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-200">{latestDate}</div>
          <div className="mt-1 text-xs text-slate-500">Most recent brief saved</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Database Status
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-200">
              Supabase / Active
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">PostgreSQL persistence ready</div>
        </div>
      </div>

      {/* Campaign List View */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-16 text-center flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-3" />
          <p className="text-sm text-slate-400">Loading saved campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center my-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
            <FolderOpen className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-white">No campaigns yet</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            You haven&apos;t saved any campaigns yet. Generate marketing copy, storyboards, and posters from a campaign brief.
          </p>
          <div className="mt-6">
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Your First Campaign</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Populated Campaigns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Platform & Mode Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                    <Layers className="h-3 w-3" />
                    <span>{item.platform}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      item.generationMode === "LIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {item.generationMode === "LIVE" ? (
                      <>
                        <Zap className="h-2.5 w-2.5" />
                        <span>Live AI</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-2.5 w-2.5" />
                        <span>Demo</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Brand & Title */}
                <div className="text-xs text-slate-400 font-medium">
                  {item.brandName} • {item.productName}
                </div>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {item.campaignTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Objective: <span className="text-slate-300">{item.campaignObjective}</span>
                </p>
              </div>

              {/* Card Footer: Date & Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-pink-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/campaigns/${item.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
