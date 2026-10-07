"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  BookOpen,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  PLATFORMS,
  CAMPAIGN_OBJECTIVES,
  TONES,
  VISUAL_STYLES,
  EXAMPLE_CAMPAIGN_BRIEF,
  PlatformOption,
  CampaignObjectiveOption,
  ToneOption,
  VisualStyleOption,
} from "@/constants/campaign-options";
import { campaignBriefSchema } from "@/lib/validations/campaign";
import { CampaignBrief } from "@/types";
import { GeneratedCampaign } from "@/lib/validations/generated-campaign";
import { GeneratedPoster } from "@/lib/validations/visual-direction";
import { CampaignBriefPreview } from "@/components/campaign-brief-preview";
import { GeneratedCampaignView } from "@/components/generated-campaign-view";
import { CampaignLoadingState } from "@/components/campaign-loading-state";

interface FormState {
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  platform: string;
  campaignObjective: string;
  tone: string;
  offer: string;
  callToAction: string;
  visualStyle: string;
  additionalInstructions: string;
}

const INITIAL_FORM_STATE: FormState = {
  brandName: "",
  productName: "",
  productDescription: "",
  targetAudience: "",
  platform: "",
  campaignObjective: "",
  tone: "",
  offer: "",
  callToAction: "",
  visualStyle: "",
  additionalInstructions: "",
};

export default function NewCampaignPage() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBrief, setSubmittedBrief] = useState<CampaignBrief | null>(
    null
  );
  const [generatedCampaign, setGeneratedCampaign] =
    useState<GeneratedCampaign | null>(null);
  const [generatedPoster, setGeneratedPoster] =
    useState<GeneratedPoster | null>(null);
  const [isPosterLoading, setIsPosterLoading] = useState(false);
  const [posterError, setPosterError] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<"LIVE" | "DEMO">("DEMO");
  const [modelUsed, setModelUsed] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCampaignId, setSavedCampaignId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const hasUnsavedContent = Object.values(formData).some(
    (v) => v.trim() !== ""
  );

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleLoadExample = () => {
    setFormData({
      brandName: EXAMPLE_CAMPAIGN_BRIEF.brandName,
      productName: EXAMPLE_CAMPAIGN_BRIEF.productName,
      productDescription: EXAMPLE_CAMPAIGN_BRIEF.productDescription,
      targetAudience: EXAMPLE_CAMPAIGN_BRIEF.targetAudience,
      platform: EXAMPLE_CAMPAIGN_BRIEF.platform,
      campaignObjective: EXAMPLE_CAMPAIGN_BRIEF.campaignObjective,
      tone: EXAMPLE_CAMPAIGN_BRIEF.tone,
      offer: EXAMPLE_CAMPAIGN_BRIEF.offer,
      callToAction: EXAMPLE_CAMPAIGN_BRIEF.callToAction,
      visualStyle: EXAMPLE_CAMPAIGN_BRIEF.visualStyle,
      additionalInstructions: EXAMPLE_CAMPAIGN_BRIEF.additionalInstructions,
    });
    setErrors({});
    setSubmittedBrief(null);
    setGeneratedCampaign(null);
    setGenerationError(null);
    showNotification("Loaded 'BrewHouse Cold Brew' example campaign.");
  };

  const handleClearForm = () => {
    if (hasUnsavedContent) {
      const confirmReset = window.confirm(
        "Are you sure you want to clear the form? All entered brief data will be reset."
      );
      if (!confirmReset) return;
    }
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmittedBrief(null);
    setGeneratedCampaign(null);
    setGenerationError(null);
    showNotification("Form cleared.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateData = {
      brandName: formData.brandName,
      productName: formData.productName,
      productDescription: formData.productDescription,
      targetAudience: formData.targetAudience,
      platform: formData.platform,
      campaignObjective: formData.campaignObjective,
      tone: formData.tone,
      offer: formData.offer || undefined,
      callToAction: formData.callToAction || undefined,
      visualStyle: formData.visualStyle || undefined,
      additionalInstructions: formData.additionalInstructions || undefined,
    };

    const result = campaignBriefSchema.safeParse(candidateData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const canonicalBrief: CampaignBrief = {
      brandName: result.data.brandName,
      productName: result.data.productName,
      productDescription: result.data.productDescription,
      targetAudience: result.data.targetAudience,
      platform: result.data.platform as PlatformOption,
      campaignObjective:
        result.data.campaignObjective as CampaignObjectiveOption,
      tone: result.data.tone as ToneOption,
      offer: result.data.offer || undefined,
      callToAction: result.data.callToAction || undefined,
      visualStyle: (result.data.visualStyle as VisualStyleOption) || undefined,
      additionalInstructions: result.data.additionalInstructions || undefined,
    };

    setErrors({});
    setSubmittedBrief(canonicalBrief);
    setGeneratedCampaign(null);
    setGeneratedPoster(null);
    setGenerationError(null);
    setPosterError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateVisual = async (
    brief: CampaignBrief,
    campaign: GeneratedCampaign
  ) => {
    setIsPosterLoading(true);
    setPosterError(null);

    try {
      const res = await fetch("/api/campaigns/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, campaign }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPosterError(
          data?.error?.message ||
            "Visual generation failed. You can retry generating the poster below."
        );
        return;
      }

      setGeneratedPoster(data.poster);
    } catch (err) {
      const error = err as Error;
      setPosterError(error.message || "Failed to connect to image service.");
    } finally {
      setIsPosterLoading(false);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!submittedBrief || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedPoster(null);

    try {
      const response = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brief: submittedBrief }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage =
          data?.error?.message || "Generation failed. Please try again.";
        setGenerationError(errorMessage);
        return;
      }

      const campaignResult = data.data;
      setGeneratedCampaign(campaignResult);
      setGenerationMode(data.mode);
      setModelUsed(data.modelUsed);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Automatically synthesize visual direction & poster
      handleGenerateVisual(submittedBrief, campaignResult);
    } catch (err) {
      const error = err as Error;
      setGenerationError(error.message || "Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCampaign = async () => {
    if (!submittedBrief || !generatedCampaign || isSaving || isSaved) return;

    setIsSaving(true);
    try {
      // Use existing poster's visualDirection or synthesize fallback
      const visualDir =
        generatedPoster?.visualDirection || {
          visualConcept: `${submittedBrief.visualStyle || "Modern"} promotional visual for ${submittedBrief.brandName}`,
          composition: "Hero centered commercial composition",
          colorPalette: ["#0B0F19", "#4F46E5", "#06B6D4", "#F1F5F9", "#1E293B"],
          typographyDirection: "Clean bold typography hierarchy",
          imageryDirection: "High-contrast commercial rendering",
          layoutDirection: "Platform feed conversion focus",
          platformFormat: submittedBrief.platform,
          aspectRatio: "1:1",
          imagePrompt: "Commercial advertisement background",
        };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: submittedBrief,
          campaign: generatedCampaign,
          visualDirection: visualDir,
          poster: generatedPoster,
          generationMode,
          modelUsed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showNotification(data?.error?.message || "Failed to save campaign.");
        return;
      }

      setIsSaved(true);
      setSavedCampaignId(data.campaignId);
      showNotification("Campaign saved successfully!");
    } catch (err) {
      showNotification((err as Error).message || "Failed to save campaign.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {notification && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 px-3 py-1 text-xs text-indigo-300 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Header */}
      {!generatedCampaign && (
        <div className="pb-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {submittedBrief
                    ? "Step 2: Review Brief & Launch AI"
                    : "Step 1: Campaign Brief Setup"}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create New Campaign
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                Define your brand, product value, and campaign goals. Sociora converts your brief into a complete social campaign using Google Gemini AI.
              </p>
            </div>

            {/* Quick Actions */}
            {!submittedBrief && (
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Try an Example</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearForm}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear Form</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW STATE 1: Generated Campaign Output */}
      {generatedCampaign && submittedBrief ? (
        <GeneratedCampaignView
          campaign={generatedCampaign}
          brief={submittedBrief}
          poster={generatedPoster}
          isPosterLoading={isPosterLoading}
          posterError={posterError}
          mode={generationMode}
          modelUsed={modelUsed}
          isSaving={isSaving}
          isSaved={isSaved}
          savedCampaignId={savedCampaignId}
          onSaveCampaign={handleSaveCampaign}
          onRegenerate={handleGenerateCampaign}
          onRegenerateVisual={() =>
            handleGenerateVisual(submittedBrief, generatedCampaign)
          }
          onEditBrief={() => {
            setGeneratedCampaign(null);
            setGeneratedPoster(null);
            setGenerationError(null);
            setPosterError(null);
            setIsSaved(false);
            setSavedCampaignId(null);
          }}
        />
      ) : isGenerating && submittedBrief ? (
        /* VIEW STATE 2: Loading State */
        <div className="mt-8">
          <CampaignLoadingState
            brandName={submittedBrief.brandName}
            productName={submittedBrief.productName}
          />
        </div>
      ) : submittedBrief ? (
        /* VIEW STATE 3: Brief Preview & Generate Action */
        <div className="mt-8 space-y-6">
          <CampaignBriefPreview
            brief={submittedBrief}
            isGenerating={isGenerating}
            generationError={generationError}
            onEdit={() => {
              setSubmittedBrief(null);
              setGenerationError(null);
            }}
            onReset={() => {
              setSubmittedBrief(null);
              setFormData(INITIAL_FORM_STATE);
              setGenerationError(null);
            }}
            onGenerate={handleGenerateCampaign}
          />
        </div>
      ) : (
        /* VIEW STATE 4: Brief Form */
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
          {/* SECTION 1: Product & Brand Information */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 backdrop-blur-sm">
            <div className="mb-5 pb-3 border-b border-slate-800/70">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  1
                </span>
                Brand & Product Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide core details about what you are promoting.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Brand Name */}
                <div>
                  <label
                    htmlFor="field-brandName"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Brand Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    id="field-brandName"
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    placeholder="e.g. BrewHouse, GlowBotanics, NovaTech"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
                      errors.brandName
                        ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                        : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.brandName && (
                    <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.brandName}</span>
                    </p>
                  )}
                </div>

                {/* Product / Service Name */}
                <div>
                  <label
                    htmlFor="field-productName"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Product / Service Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    id="field-productName"
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleChange("productName", e.target.value)}
                    placeholder="e.g. Cold Brew Coffee, Daily Vitamin Serum"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
                      errors.productName
                        ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                        : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.productName && (
                    <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.productName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="field-productDescription"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Product Description <span className="text-pink-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.productDescription.length}/1000
                  </span>
                </div>
                <textarea
                  id="field-productDescription"
                  rows={4}
                  value={formData.productDescription}
                  onChange={(e) =>
                    handleChange("productDescription", e.target.value)
                  }
                  placeholder="Describe key features, benefits, and what makes the product standout (min 15 characters)..."
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
                    errors.productDescription
                      ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                      : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }`}
                />
                {errors.productDescription && (
                  <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.productDescription}</span>
                  </p>
                )}
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Tip: A detailed description helps Gemini generate more tailored captions and reel concepts.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: Campaign Strategy & Target Audience */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 backdrop-blur-sm">
            <div className="mb-5 pb-3 border-b border-slate-800/70">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  2
                </span>
                Target Audience & Marketing Strategy
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your target viewer, preferred platform, and marketing objective.
              </p>
            </div>

            <div className="space-y-5">
              {/* Target Audience */}
              <div>
                <label
                  htmlFor="field-targetAudience"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Target Audience <span className="text-pink-400">*</span>
                </label>
                <input
                  id="field-targetAudience"
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                  placeholder="e.g. College students and young professionals aged 18–30"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
                    errors.targetAudience
                      ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                      : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }`}
                />
                {errors.targetAudience && (
                  <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.targetAudience}</span>
                  </p>
                )}
              </div>

              {/* Platform, Objective, Tone row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Platform */}
                <div>
                  <label
                    htmlFor="field-platform"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Platform <span className="text-pink-400">*</span>
                  </label>
                  <select
                    id="field-platform"
                    value={formData.platform}
                    onChange={(e) => handleChange("platform", e.target.value)}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-all ${
                      errors.platform
                        ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                        : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">
                      Select Platform...
                    </option>
                    {PLATFORMS.map((plat) => (
                      <option key={plat} value={plat} className="bg-slate-900 text-white">
                        {plat}
                      </option>
                    ))}
                  </select>
                  {errors.platform && (
                    <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.platform}</span>
                    </p>
                  )}
                </div>

                {/* Campaign Objective */}
                <div>
                  <label
                    htmlFor="field-campaignObjective"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Objective <span className="text-pink-400">*</span>
                  </label>
                  <select
                    id="field-campaignObjective"
                    value={formData.campaignObjective}
                    onChange={(e) =>
                      handleChange("campaignObjective", e.target.value)
                    }
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-all ${
                      errors.campaignObjective
                        ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                        : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">
                      Select Objective...
                    </option>
                    {CAMPAIGN_OBJECTIVES.map((obj) => (
                      <option key={obj} value={obj} className="bg-slate-900 text-white">
                        {obj}
                      </option>
                    ))}
                  </select>
                  {errors.campaignObjective && (
                    <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.campaignObjective}</span>
                    </p>
                  )}
                </div>

                {/* Tone / Style */}
                <div>
                  <label
                    htmlFor="field-tone"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Tone / Style <span className="text-pink-400">*</span>
                  </label>
                  <select
                    id="field-tone"
                    value={formData.tone}
                    onChange={(e) => handleChange("tone", e.target.value)}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-all ${
                      errors.tone
                        ? "border-pink-500 bg-pink-950/20 focus:border-pink-400"
                        : "border-slate-800 bg-slate-950/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">
                      Select Tone...
                    </option>
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.tone && (
                    <p className="mt-1.5 text-xs text-pink-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.tone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Optional Creative Guidance */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 backdrop-blur-sm">
            <div className="mb-5 pb-3 border-b border-slate-800/70 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                    3
                  </span>
                  Optional Creative Customization
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add specific promotional offers, calls to action, or aesthetic directions (all optional).
                </p>
              </div>
              <span className="rounded bg-slate-800/60 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                Optional
              </span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Offer / Promotion */}
                <div>
                  <label
                    htmlFor="field-offer"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Special Offer / Discount
                  </label>
                  <input
                    id="field-offer"
                    type="text"
                    value={formData.offer}
                    onChange={(e) => handleChange("offer", e.target.value)}
                    placeholder="e.g. 20% off for festive season"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.offer && (
                    <p className="mt-1.5 text-xs text-pink-400">{errors.offer}</p>
                  )}
                </div>

                {/* Call To Action */}
                <div>
                  <label
                    htmlFor="field-callToAction"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Call to Action (CTA)
                  </label>
                  <input
                    id="field-callToAction"
                    type="text"
                    value={formData.callToAction}
                    onChange={(e) => handleChange("callToAction", e.target.value)}
                    placeholder="e.g. Order Now, Claim Offer, Sign Up"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.callToAction && (
                    <p className="mt-1.5 text-xs text-pink-400">
                      {errors.callToAction}
                    </p>
                  )}
                </div>

                {/* Visual Style */}
                <div>
                  <label
                    htmlFor="field-visualStyle"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Visual Style
                  </label>
                  <select
                    id="field-visualStyle"
                    value={formData.visualStyle}
                    onChange={(e) => handleChange("visualStyle", e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" className="bg-slate-900 text-slate-500">
                      None (Default Style)
                    </option>
                    {VISUAL_STYLES.map((style) => (
                      <option key={style} value={style} className="bg-slate-900 text-white">
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Instructions */}
              <div>
                <label
                  htmlFor="field-additionalInstructions"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Additional Creative Instructions
                </label>
                <textarea
                  id="field-additionalInstructions"
                  rows={2}
                  value={formData.additionalInstructions}
                  onChange={(e) =>
                    handleChange("additionalInstructions", e.target.value)
                  }
                  placeholder="e.g. Focus on clean ingredients; avoid cheesy sales language; include hook in first 2 seconds."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                {errors.additionalInstructions && (
                  <p className="mt-1.5 text-xs text-pink-400">
                    {errors.additionalInstructions}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Real-time Summary Card (Sticky/Compact) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-400" />
              <span>
                Brief Status:{" "}
                <span className="text-white font-medium">
                  {formData.brandName && formData.productName
                    ? `${formData.brandName} (${formData.productName})`
                    : "Awaiting input"}
                </span>
                {formData.platform && (
                  <>
                    {" "}
                    • Platform:{" "}
                    <span className="text-indigo-300 font-medium">
                      {formData.platform}
                    </span>
                  </>
                )}
                {formData.campaignObjective && (
                  <>
                    {" "}
                    • Objective:{" "}
                    <span className="text-emerald-300 font-medium">
                      {formData.campaignObjective}
                    </span>
                  </>
                )}
              </span>
            </div>

            <span className="text-[11px] text-slate-500">
              * Required fields marked with asterisk
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClearForm}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
              <span>Review Brief</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
