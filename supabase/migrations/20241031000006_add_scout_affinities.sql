-- Add affinities and innate_abilities to scouted_hunters table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'scouted_hunters' AND column_name = 'affinities'
    ) THEN
        ALTER TABLE scouted_hunters ADD COLUMN affinities TEXT[] DEFAULT '{}';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'scouted_hunters' AND column_name = 'innate_abilities'
    ) THEN
        ALTER TABLE scouted_hunters ADD COLUMN innate_abilities TEXT[] DEFAULT '{}';
    END IF;
END $$;
