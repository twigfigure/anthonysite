-- Add kingdom column to hunters table
ALTER TABLE hunters ADD COLUMN IF NOT EXISTS kingdom TEXT;

-- Update existing hunters to have kingdoms based on their regions
UPDATE hunters
SET kingdom = CASE
  -- Northern Empire
  WHEN region = 'Frostspire Peaks' THEN 'Northern Empire'
  WHEN region = 'Glacial Wastes' THEN 'Northern Empire'
  WHEN region = 'Tundra Borderlands' THEN 'Northern Empire'
  -- Eastern Dynasty
  WHEN region = 'Crimson Highlands' THEN 'Eastern Dynasty'
  WHEN region = 'Jade River Valley' THEN 'Eastern Dynasty'
  WHEN region = 'Shadow Mountains' THEN 'Eastern Dynasty'
  -- Western Kingdom
  WHEN region = 'Emerald Heartlands' THEN 'Western Kingdom'
  WHEN region = 'Silverpine Forests' THEN 'Western Kingdom'
  WHEN region = 'Stormcoast' THEN 'Western Kingdom'
  -- Southern Tribes
  WHEN region = 'Scorched Badlands' THEN 'Southern Tribes'
  WHEN region = 'Savanna Territories' THEN 'Southern Tribes'
  WHEN region = 'Red Rock Canyons' THEN 'Southern Tribes'
  -- Central Republic
  WHEN region = 'Irongate District' THEN 'Central Republic'
  WHEN region = 'Trade Routes' THEN 'Central Republic'
  WHEN region = 'Coal Valleys' THEN 'Central Republic'
  -- Mystic Enclave
  WHEN region = 'Aethermoor Heights' THEN 'Mystic Enclave'
  WHEN region = 'The Shadowfen' THEN 'Mystic Enclave'
  WHEN region = 'Runestone Wastes' THEN 'Mystic Enclave'
  ELSE 'Unknown'
END
WHERE kingdom IS NULL;
