"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SavedCampaign } from "@/lib/supabase/types";
import { GeneratedCampaignView } from "@/components/generated-campaign-view";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

function CampaignDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [savedItem, setSavedItem] = useState<SavedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    fetch(`/api/campaigns/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Campaign not found"
              : "Failed to load campaign"
          );
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.campaign) {
            setSavedItem(data.campaign);
          } else {
            setError("Campaign not found");
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load campaign");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-20 text-center flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading campaign details...</p>
      </div>
    );
  }

  if (error || !savedItem) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 mb-2">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested campaign could not be located or may have been deleted.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Navigation breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs font-mono text-slate-500">
          Saved on {new Date(savedItem.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Render existing high-fidelity Campaign Output */}
      <GeneratedCampaignView
        campaign={savedItem.campaign}
        brief={savedItem.brief}
        poster={savedItem.poster}
        isPosterLoading={false}
        posterError={null}
        mode={savedItem.generationMode}
        modelUsed={savedItem.modelUsed}
        isSaved={true}
        onRegenerate={() => {}}
        onRegenerateVisual={() => {}}
        onEditBrief={() => {}}
      />
    </div>
  );
}

export default function CampaignDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
          <p className="text-sm text-slate-400">Loading campaign details...</p>
        </div>
      }
    >
      <CampaignDetailContent />
    </Suspense>
  );
}
