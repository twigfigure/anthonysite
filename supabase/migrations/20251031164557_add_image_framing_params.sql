-- Add framing parameters for splash art and avatar
ALTER TABLE hunters
ADD COLUMN IF NOT EXISTS splash_art_zoom DECIMAL(4,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS splash_art_offset_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS splash_art_offset_y INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_zoom DECIMAL(4,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS avatar_offset_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_offset_y INTEGER DEFAULT 0;

COMMENT ON COLUMN hunters.splash_art_zoom IS 'Zoom level for splash art display (1.0 = 100%)';
COMMENT ON COLUMN hunters.splash_art_offset_x IS 'Horizontal offset in pixels for splash art framing';
COMMENT ON COLUMN hunters.splash_art_offset_y IS 'Vertical offset in pixels for splash art framing';
COMMENT ON COLUMN hunters.avatar_zoom IS 'Zoom level for avatar display (1.0 = 100%)';
COMMENT ON COLUMN hunters.avatar_offset_x IS 'Horizontal offset in pixels for avatar framing';
COMMENT ON COLUMN hunters.avatar_offset_y IS 'Vertical offset in pixels for avatar framing';
