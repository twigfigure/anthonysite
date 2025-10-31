-- Add avatar and splash art image columns to hunters table
-- Migration for Guild Manager image generation feature

ALTER TABLE hunters
ADD COLUMN avatar_url TEXT,
ADD COLUMN splash_art_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN hunters.avatar_url IS 'URL to hunter portrait image (transparent background)';
COMMENT ON COLUMN hunters.splash_art_url IS 'URL to hunter splash art image (transparent background)';
