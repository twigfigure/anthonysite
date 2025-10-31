-- Migration: Convert hunters table to use kingdom_id/region_id instead of kingdom/region names
-- This enables retroactive updates when admins change kingdom/region names

-- Step 1: Add new columns for IDs
ALTER TABLE hunters
ADD COLUMN IF NOT EXISTS kingdom_id TEXT,
ADD COLUMN IF NOT EXISTS region_id TEXT;

-- Step 2: Migrate existing data from names to IDs
-- Map existing kingdom names to IDs
UPDATE hunters
SET kingdom_id = CASE
  WHEN kingdom = 'Northern Empire' THEN 'northern-empire'
  WHEN kingdom = 'Eastern Dynasty' THEN 'eastern-dynasty'
  WHEN kingdom = 'Western Kingdom' THEN 'western-kingdom'
  WHEN kingdom = 'Southern Tribes' THEN 'southern-tribes'
  WHEN kingdom = 'Central Republic' THEN 'central-republic'
  WHEN kingdom = 'Mystic Enclave' THEN 'mystic-enclave'
  ELSE 'unknown'
END
WHERE kingdom IS NOT NULL;

-- Map existing region names to IDs
UPDATE hunters
SET region_id = CASE
  -- Northern Empire regions
  WHEN region = 'Frostspire Peaks' THEN 'frostspire-peaks'
  WHEN region = 'Glacial Wastes' THEN 'glacial-wastes'
  WHEN region = 'Tundra Borderlands' THEN 'tundra-borderlands'

  -- Eastern Dynasty regions
  WHEN region = 'Crimson Highlands' THEN 'crimson-highlands'
  WHEN region = 'Jade River Valley' THEN 'jade-river-valley'
  WHEN region = 'Shadow Mountains' THEN 'shadow-mountains'

  -- Western Kingdom regions
  WHEN region = 'Emerald Heartlands' THEN 'emerald-heartlands'
  WHEN region = 'Silverpine Forests' THEN 'silverpine-forests'
  WHEN region = 'Stormcoast' THEN 'stormcoast'

  -- Southern Tribes regions
  WHEN region = 'Scorched Badlands' THEN 'scorched-badlands'
  WHEN region = 'Savanna Territories' THEN 'savanna-territories'
  WHEN region = 'Red Rock Canyons' THEN 'red-rock-canyons'

  -- Central Republic regions
  WHEN region = 'Irongate District' THEN 'irongate-district'
  WHEN region = 'Trade Routes' THEN 'trade-routes'
  WHEN region = 'Coal Valleys' THEN 'coal-valleys'

  -- Mystic Enclave regions
  WHEN region = 'Aethermoor Heights' THEN 'aethermoor-heights'
  WHEN region = 'The Shadowfen' THEN 'shadowfen'
  WHEN region = 'Shadowfen' THEN 'shadowfen'
  WHEN region = 'Runestone Wastes' THEN 'runestone-wastes'

  ELSE 'unknown'
END
WHERE region IS NOT NULL;

-- Step 3: Drop old columns (after verifying migration worked)
-- Commented out for safety - uncomment after verifying data
-- ALTER TABLE hunters DROP COLUMN IF EXISTS kingdom;
-- ALTER TABLE hunters DROP COLUMN IF EXISTS region;

-- For now, keep both columns to allow rollback if needed
-- You can manually drop the old columns after confirming everything works:
-- 1. Check that all hunters have kingdom_id and region_id populated
-- 2. Test that the game displays correctly
-- 3. Then run: ALTER TABLE hunters DROP COLUMN kingdom, DROP COLUMN region;