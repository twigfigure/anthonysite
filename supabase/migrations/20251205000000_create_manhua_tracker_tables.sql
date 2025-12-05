-- Manhua Tracker Tables
-- Migration for personal manhua tracking feature

-- Create enum for manhua status
DO $$ BEGIN
    CREATE TYPE manhua_status AS ENUM ('reading', 'completed', 'on_hold', 'dropped', 'plan_to_read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main manhua table
CREATE TABLE IF NOT EXISTS manhua (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    cover_image_url TEXT,
    description TEXT,
    status manhua_status DEFAULT 'plan_to_read',
    current_chapter INTEGER DEFAULT 0,
    total_chapters INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources table for tracking multiple websites
CREATE TABLE IF NOT EXISTS manhua_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manhua_id UUID NOT NULL REFERENCES manhua(id) ON DELETE CASCADE,
    website_name TEXT NOT NULL,
    website_url TEXT NOT NULL,
    latest_chapter INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ,
    last_checked TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_manhua_user_id ON manhua(user_id);
CREATE INDEX IF NOT EXISTS idx_manhua_status ON manhua(status);
CREATE INDEX IF NOT EXISTS idx_manhua_updated_at ON manhua(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_manhua_sources_manhua_id ON manhua_sources(manhua_id);

-- Enable Row Level Security
ALTER TABLE manhua ENABLE ROW LEVEL SECURITY;
ALTER TABLE manhua_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manhua table
-- Users can only see their own manhua
CREATE POLICY "Users can view own manhua" ON manhua
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own manhua
CREATE POLICY "Users can insert own manhua" ON manhua
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own manhua
CREATE POLICY "Users can update own manhua" ON manhua
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own manhua
CREATE POLICY "Users can delete own manhua" ON manhua
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for manhua_sources table
-- Users can view sources for their own manhua
CREATE POLICY "Users can view sources for own manhua" ON manhua_sources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM manhua
            WHERE manhua.id = manhua_sources.manhua_id
            AND manhua.user_id = auth.uid()
        )
    );

-- Users can insert sources for their own manhua
CREATE POLICY "Users can insert sources for own manhua" ON manhua_sources
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM manhua
            WHERE manhua.id = manhua_sources.manhua_id
            AND manhua.user_id = auth.uid()
        )
    );

-- Users can update sources for their own manhua
CREATE POLICY "Users can update sources for own manhua" ON manhua_sources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM manhua
            WHERE manhua.id = manhua_sources.manhua_id
            AND manhua.user_id = auth.uid()
        )
    );

-- Users can delete sources for their own manhua
CREATE POLICY "Users can delete sources for own manhua" ON manhua_sources
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM manhua
            WHERE manhua.id = manhua_sources.manhua_id
            AND manhua.user_id = auth.uid()
        )
    );

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_manhua_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on manhua changes
DROP TRIGGER IF EXISTS trigger_update_manhua_updated_at ON manhua;
CREATE TRIGGER trigger_update_manhua_updated_at
    BEFORE UPDATE ON manhua
    FOR EACH ROW
    EXECUTE FUNCTION update_manhua_updated_at();
