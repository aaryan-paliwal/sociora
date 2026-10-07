# Sociora — AI Social Content Studio

> **AI-powered social media content creation platform.**
> Built as a production-ready college project for generating multi-format social campaigns.

---

## 🚀 Overview

**Sociora** turns product/business information and promotional briefs into comprehensive social-media marketing packs, including:

- **Visual Concepts & Posters**: Structured promotional visual directions and vector poster layouts
- **Captions & Headlines**: High-converting hook headlines, engaging copy, calls-to-action (CTA), and tailored hashtags
- **Reel & Video Concepts**: Viral hook suggestions, full scripts, audio cues, and visual directions
- **Storyboards**: Multi-frame storyboards for video production
- **Story & Carousel Ideas**: Multi-slide educational/promotional carousels and story sequences
- **Campaign Persistence**: Supabase PostgreSQL database storage with interactive campaign management dashboard

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) PostgreSQL (`@supabase/supabase-js`)
- **AI Engine**: [Google Gemini 3.8 Flash](https://aistudio.google.com/) (`@google/genai` with native structured output)
- **Visual Synthesis**: Gemini Image (`gemini-3.1-flash-image`) with deterministic SVG poster fallback
- **Deployment Target**: Vercel

---

## 📁 Project Structure

```text
sociora/
├── app/                  # Next.js App Router
│   ├── api/              # Secure server-side API routes
│   │   ├── campaigns/    # GET list, POST save campaign
│   │   │   ├── [id]/     # GET detail, DELETE campaign
│   │   │   ├── generate/ # POST AI text generation (Gemini Flash)
│   │   │   └── generate-image/ # POST visual direction & poster
│   │   └── health/       # GET health status & service availability
│   ├── campaigns/
│   │   ├── [id]/         # Dynamic saved campaign viewer (Suspense-wrapped)
│   │   └── new/          # Campaign creation brief workflow & results
│   ├── dashboard/        # Campaign Studio dashboard with live history & metrics
│   ├── layout.tsx        # Root layout with Sociora branding & navigation
│   └── page.tsx          # Landing page ("Turn your ideas into social content")
├── components/           # UI components (Navbar, Footer, Previews, Poster)
├── constants/            # Centralized platform enums & options
├── lib/                  # Utilities and services
│   ├── ai/               # Gemini AI generation, demo generator, poster SVG
│   ├── supabase/         # Supabase client and campaign repository
│   ├── validations/      # Zod runtime schemas (Brief, Campaign, VisualDirection)
│   └── utils.ts          # Class merging and common utilities
├── supabase/             # Database migrations
│   └── migrations/       # SQL scripts (001_initial_schema.sql)
├── types/                # Domain types (CampaignBrief, GeneratedCampaign, etc.)
└── .env.example          # Authoritative environment variables template
```

---

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js 20+ (recommended) or 18+
- npm (or pnpm / yarn)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables Reference

| Variable | Required | Description / Default | Fallback Mode |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | Google AI Studio API key | Deterministic Demo AI Generator |
| `GEMINI_MODEL` | Optional | Gemini text model (`gemini-3.8-flash`) | Defaults to `gemini-3.8-flash` |
| `IMAGE_GENERATION_API_KEY` | Optional | Dedicated image API key | Falls back to `GEMINI_API_KEY` or Demo SVG |
| `IMAGE_GENERATION_MODEL` | Optional | Gemini image model (`gemini-3.1-flash-image`) | Deterministic SVG Poster Generator |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL | Graceful in-memory workspace |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase public anon key | Graceful in-memory workspace |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only service role key | Never exposed to browser bundle |
| `NEXT_PUBLIC_APP_URL` | Optional | Application base URL (`http://localhost:3000`) | Localhost default |

---

## 🗄️ Supabase Setup & Migration

To configure real PostgreSQL persistence:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, go to **SQL Editor** -> **New query**.
3. Copy and execute the contents of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql).
4. Go to **Project Settings** -> **API** and copy:
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - Public Anon key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role key (optional for server backend) -> `SUPABASE_SERVICE_ROLE_KEY`
5. Paste these into your `.env.local` (or Vercel Project Settings).

> **Note on Workspaces:** In this current phase, the workspace operates in single/demo workspace mode without requiring user logins. When Supabase Auth is integrated in future iterations, user ownership links seamlessly via the existing nullable `user_id` column.

---

## 🌐 Operational Modes (Graceful Degradation)

Sociora is engineered to be 100% functional for demonstrations under all configurations:

1. **Full Production Mode (Credentials Configured)**:
   - Uses **Google Gemini 3.8 Flash** with low-effort reasoning for fast social copywriting.
   - Saves campaigns durably into **Supabase PostgreSQL**.
   - Displays green **Live AI** badges.

2. **Zero-Configuration Demo Mode (No API Keys Required)**:
   - If `GEMINI_API_KEY` is absent, Sociora activates its deterministic AI generator to formulate comprehensive marketing packs tailored to your brief.
   - If image credentials are absent, Sociora synthesizes vector SVG posters styled with platform-appropriate aspect ratios and brand color swatches.
   - If Supabase credentials are absent, Sociora persists campaigns across the active server session via an in-memory repository.
   - Displays amber **Demo Mode** badges for academic transparency.

---

## 🚀 Vercel Deployment Guide

Deploy Sociora to Vercel in 5 simple steps:

1. **Push to GitHub**:
   Ensure your code is pushed to your GitHub repository (`main` branch).
2. **Import into Vercel**:
   Go to [vercel.com](https://vercel.com), click **Add New** -> **Project**, and select your `sociora` repository.
3. **Configure Environment Variables**:
   In the **Environment Variables** section, add your credentials (from your `.env.local`).
   *(Tip: You can deploy without environment variables first to verify the demo build, then add keys later.)*
4. **Deploy**:
   Click **Deploy**. Next.js App Router will compile and optimize all routes automatically.
5. **Verify Deployment**:
   - Check the health endpoint: `https://<your-vercel-domain>/api/health`
   - Test campaign brief creation at `/campaigns/new`
   - Test "Save Campaign" and inspect `/dashboard`
   - Test opening `/campaigns/[id]` and downloading posters

---

## 🧪 Validation & Testing

Run the complete test suite locally:

```bash
# TypeScript Typecheck
npx tsc --noEmit

# ESLint Code Quality
npm run lint

# Production Build
npm run build

# Start Production Server
npm run start
```
