-- Kindred Database Schema
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/sql

-- Enable Row Level Security
-- This ensures users can only see and modify their own data

-- Create emotion_mons table
CREATE TABLE IF NOT EXISTS public.emotion_mons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Kindred details
  name TEXT NOT NULL,
  nickname TEXT,
  generated_name TEXT NOT NULL,

  -- Stats (0-100)
  health INTEGER NOT NULL CHECK (health >= 0 AND health <= 100),
  mood INTEGER NOT NULL CHECK (mood >= 0 AND mood <= 100),
  energy INTEGER NOT NULL CHECK (energy >= 0 AND energy <= 100),
  faith INTEGER NOT NULL CHECK (faith >= 0 AND faith <= 100),

  -- User description
  description TEXT,

  -- AI generation details
  prompt TEXT NOT NULL,
  color_palette TEXT,
  primary_trait TEXT,
  rarity TEXT,
  title TEXT,

  -- Image data (base64 or URL)
  image_url TEXT NOT NULL,

  -- Display color gradient
  color_class TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.emotion_mons ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view all kindreds (public gallery)
CREATE POLICY "Anyone can view kindreds"
  ON public.emotion_mons
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert kindreds
CREATE POLICY "Authenticated users can insert kindreds"
  ON public.emotion_mons
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own kindreds
CREATE POLICY "Users can update own kindreds"
  ON public.emotion_mons
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own kindreds
CREATE POLICY "Users can delete own kindreds"
  ON public.emotion_mons
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS emotion_mons_user_id_idx ON public.emotion_mons(user_id);
CREATE INDEX IF NOT EXISTS emotion_mons_created_at_idx ON public.emotion_mons(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.emotion_mons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
