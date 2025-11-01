-- Add original image URLs
ALTER TABLE hunters
ADD COLUMN IF NOT EXISTS original_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS original_splash_art_url TEXT;

COMMENT ON COLUMN hunters.original_avatar_url IS 'Original avatar image URL (never modified, used as source for cropping)';
COMMENT ON COLUMN hunters.original_splash_art_url IS 'Original splash art image URL (never modified, used as source for cropping)';
COMMENT ON COLUMN hunters.avatar_url IS 'Cropped/framed avatar for display';
COMMENT ON COLUMN hunters.splash_art_url IS 'Cropped/framed splash art for display';
