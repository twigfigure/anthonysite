-- Migration: Add rarity and title columns to emotion_mons table
-- Run this SQL in your Supabase SQL Editor if you already have the emotion_mons table
-- https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/sql

-- Add rarity column
ALTER TABLE public.emotion_mons
ADD COLUMN IF NOT EXISTS rarity TEXT;

-- Add title column
ALTER TABLE public.emotion_mons
ADD COLUMN IF NOT EXISTS title TEXT;

-- Optional: Set a default rarity for existing mons
UPDATE public.emotion_mons
SET rarity = 'Normal'
WHERE rarity IS NULL;
