-- Migration: Add Kindred Fables (Featured Kindreds)
-- This creates a table to store the 12 featured Kindreds that are visible to everyone
-- but only editable by the site admin

-- Create kindred_fables table
CREATE TABLE IF NOT EXISTS public.kindred_fables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kindred_ids TEXT[] NOT NULL DEFAULT '{}', -- Array of up to 12 kindred IDs
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.kindred_fables ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view kindred fables
CREATE POLICY "Anyone can view kindred fables"
  ON public.kindred_fables
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can update kindred fables
-- (We'll add additional admin check in the application code)
CREATE POLICY "Authenticated users can update kindred fables"
  ON public.kindred_fables
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Policy: Only authenticated users can insert kindred fables
CREATE POLICY "Authenticated users can insert kindred fables"
  ON public.kindred_fables
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert the initial empty row
-- There should only ever be one row in this table
INSERT INTO public.kindred_fables (kindred_ids, updated_by)
VALUES ('{}', NULL);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS kindred_fables_id_idx ON public.kindred_fables(id);
