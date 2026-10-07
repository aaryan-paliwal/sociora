-- ==============================================================================
-- Sociora — Database Migration: 001_initial_schema.sql
-- Creates the campaigns table and indexes for AI-generated social content studio.
-- Designed for modular monolith architecture and future Supabase Auth compatibility.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- Optional future user / workspace ownership
  user_id UUID,

  -- Brief Core Columns (Denormalized for high-performance dashboard filtering & listing)
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  platform TEXT NOT NULL,
  campaign_objective TEXT NOT NULL,
  tone TEXT NOT NULL,
  offer TEXT,
  call_to_action TEXT,
  visual_style TEXT,
  additional_instructions TEXT,

  -- Generated deliverables stored as structured JSONB
  generated_content JSONB NOT NULL,
  visual_direction JSONB NOT NULL,

  -- Visual poster artwork
  poster_image_url TEXT,
  poster_mode TEXT NOT NULL DEFAULT 'DEMO',

  -- Operational metadata
  generation_mode TEXT NOT NULL DEFAULT 'DEMO', -- 'LIVE' or 'DEMO'
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'completed' -- 'completed', 'draft', 'archived'
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns (platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns (user_id);

-- Row Level Security (RLS) configuration
-- In this initial phase without auth, enable open public access for demo workspace.
-- When Supabase Auth is integrated in future phases, policies can be restricted to auth.uid().
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access for demo workspace"
  ON campaigns FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous insert access for demo workspace"
  ON campaigns FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access for demo workspace"
  ON campaigns FOR DELETE
  USING (true);
