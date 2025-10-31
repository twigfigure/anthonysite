-- Add region column to hunters table for cultural/kingdom color palette variety

ALTER TABLE hunters
ADD COLUMN region TEXT;

-- Add comment for documentation
COMMENT ON COLUMN hunters.region IS 'Kingdom/region/culture origin (affects visual color palette)';
