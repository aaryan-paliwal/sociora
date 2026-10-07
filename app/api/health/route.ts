import { NextResponse } from "next/server";
import { isGeminiConfigured, GEMINI_CONFIG } from "@/lib/ai/gemini";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isImageProviderConfigured, IMAGE_GENERATION_CONFIG } from "@/lib/ai/image-generation";

export async function GET() {
  const geminiAvailable = isGeminiConfigured();
  const supabaseAvailable = isSupabaseConfigured();
  const imageAvailable = isImageProviderConfigured();

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        gemini: {
          configured: geminiAvailable,
          model: GEMINI_CONFIG.model,
          fallbackMode: "DEMO_GENERATOR",
        },
        image: {
          configured: imageAvailable,
          model: IMAGE_GENERATION_CONFIG.model,
          fallbackMode: "DEMO_SVG_POSTER",
        },
        supabase: {
          configured: supabaseAvailable,
          fallbackMode: "IN_MEMORY_STORE",
        },
      },
      environment: process.env.NODE_ENV || "development",
    },
    { status: 200 }
  );
}
