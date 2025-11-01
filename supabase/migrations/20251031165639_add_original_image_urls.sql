-- Add original image URLs and remove framing parameters
ALTER TABLE hunters
ADD COLUMN IF NOT EXISTS original_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS original_splash_art_url TEXT;

-- Drop the framing parameter columns since we're not using them
ALTER TABLE hunters
DROP COLUMN IF EXISTS splash_art_zoom,
DROP COLUMN IF EXISTS splash_art_offset_x,
DROP COLUMN IF EXISTS splash_art_offset_y,
DROP COLUMN IF EXISTS avatar_zoom,
DROP COLUMN IF EXISTS avatar_offset_x,
DROP COLUMN IF EXISTS avatar_offset_y;

COMMENT ON COLUMN hunters.original_avatar_url IS 'Original avatar image URL (never modified, used as source for cropping)';
COMMENT ON COLUMN hunters.original_splash_art_url IS 'Original splash art image URL (never modified, used as source for cropping)';
COMMENT ON COLUMN hunters.avatar_url IS 'Cropped/framed avatar for display';
COMMENT ON COLUMN hunters.splash_art_url IS 'Cropped/framed splash art for display';
