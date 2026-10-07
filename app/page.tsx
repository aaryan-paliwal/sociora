import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Video,
  Layers,
  CheckCircle2,
  Palette,
  Bot,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-pink-500/10 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md mb-8">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Powered Social Media Marketing Studio</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Turn your ideas into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              social content.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Sociora empowers businesses and creators to turn product briefs into high-converting social campaigns—generating posts, captions, reels, storyboards, and carousels in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/campaigns/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
            >
              <span>Create Campaign</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm px-6 py-3.5 text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* Quick Stats/Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Multi-Platform Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Optimized Gemini Flash AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Production-Grade Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid: Posts, Captions, Reels, Campaigns */}
      <section id="features" className="w-full border-t border-slate-800/80 bg-slate-950/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              End-to-End Social Creation
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything needed to fuel your brand&apos;s presence
            </p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Say goodbye to creative burnout. Provide a product summary and get ready-to-publish assets tailored for each channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Posts */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-lg text-white">Visual Posts & Posters</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Structured promotional visual concepts, poster layouts, and creative directions designed to stop the scroll.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Posters</span>
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Graphics</span>
              </div>
            </div>

            {/* Card 2: Captions */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-lg text-white">Captions & Headlines</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                High-converting hook headlines, engaging captions, targeted CTAs, and algorithm-friendly hashtag packages.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Copywriting</span>
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Hashtags</span>
              </div>
            </div>

            {/* Card 3: Reels */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-lg text-white">Reels & Short Video</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Frame-by-frame storyboards, viral hooks, script breakdowns, and audio suggestions for Instagram Reels & TikTok.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Storyboards</span>
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Scripts</span>
              </div>
            </div>

            {/* Card 4: Campaigns */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-lg text-white">Full Campaigns</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Cohesive multi-day content calendars, multi-slide carousels, and cross-platform promotional bundles.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Carousels</span>
                <span className="rounded bg-slate-800/60 px-2 py-0.5">Calendars</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Simple 3-Step Flow
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              How Sociora works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-800 bg-slate-900/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-white">Brief the Studio</h3>
              <p className="mt-2 text-sm text-slate-400">
                Input your product details, promotional goals, and target audience persona.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-800 bg-slate-900/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-white">AI Engine Processing</h3>
              <p className="mt-2 text-sm text-slate-400">
                Gemini Flash creates synchronized captions, visual poster concepts, reels, and hashtag tags.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-800 bg-slate-900/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-white">Review & Publish</h3>
              <p className="mt-2 text-sm text-slate-400">
                Inspect generated copy, export storyboards, or save directly to your campaign dashboard.
              </p>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/60 p-8 sm:p-10 text-center flex flex-col items-center">
            <Bot className="h-10 w-10 text-indigo-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">Ready to streamline your social marketing?</h3>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Start building your first multi-format social campaign with Sociora today.
            </p>
            <Link
              href="/campaigns/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              <span>Launch Campaign Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
