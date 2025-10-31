-- Add gender, personality, and backstory to hunters table

-- Create gender enum
CREATE TYPE hunter_gender AS ENUM ('Male', 'Female');

-- Add new columns to hunters table
ALTER TABLE hunters
  ADD COLUMN IF NOT EXISTS gender hunter_gender,
  ADD COLUMN IF NOT EXISTS personality TEXT,
  ADD COLUMN IF NOT EXISTS backstory TEXT;

-- Add comments for documentation
COMMENT ON COLUMN hunters.gender IS 'Hunter''s gender for pronoun usage in backstory';
COMMENT ON COLUMN hunters.personality IS 'Personality trait description (e.g., brave and fearless)';
COMMENT ON COLUMN hunters.backstory IS 'Generated backstory (1-5 sentences based on rank)';
