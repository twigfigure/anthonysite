-- Add elemental affinity support to hunters

-- First, update the hunter_rank enum to remove F and E ranks
ALTER TYPE hunter_rank RENAME TO hunter_rank_old;
CREATE TYPE hunter_rank AS ENUM ('D', 'C', 'B', 'A', 'S', 'SS', 'SSS');

-- Update all tables that use hunter_rank
ALTER TABLE hunters ALTER COLUMN rank TYPE hunter_rank USING rank::text::hunter_rank;
ALTER TABLE equipment ALTER COLUMN required_rank TYPE hunter_rank USING required_rank::text::hunter_rank;
ALTER TABLE skill_books ALTER COLUMN rank_requirement TYPE hunter_rank USING rank_requirement::text::hunter_rank;

-- Drop old enum (now safe since all references are updated)
DROP TYPE hunter_rank_old;

-- Create elemental affinity enum
CREATE TYPE elemental_affinity AS ENUM (
  'Fire',      -- Basic
  'Water',     -- Basic
  'Earth',     -- Basic
  'Wind',      -- Basic
  'Ice',       -- Special
  'Metal',     -- Special
  'Holy',      -- Special
  'Dark',      -- Special
  'Lightning', -- Special
  'Anima'      -- Special
);

-- Add affinities column to hunters table
ALTER TABLE hunters ADD COLUMN affinities elemental_affinity[] DEFAULT '{}';

-- Update existing hunters with random affinities based on their rank
-- D, C ranks: 1 basic affinity
UPDATE hunters
SET affinities = ARRAY[
  (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int]
]
WHERE rank IN ('D', 'C') AND affinities = '{}';

-- B rank: 2 basic affinities
UPDATE hunters
SET affinities = (
  SELECT ARRAY_AGG(DISTINCT aff ORDER BY aff)
  FROM (
    SELECT (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int] as aff
    FROM generate_series(1, 3)
  ) sub
  LIMIT 2
)
WHERE rank = 'B' AND affinities = '{}';

-- A rank: 2-3 affinities (guaranteed 2, 40% chance for 3rd, can have special affinities)
UPDATE hunters
SET affinities = (
  SELECT ARRAY_AGG(DISTINCT aff ORDER BY aff)
  FROM (
    SELECT (CASE
      WHEN random() < 0.7 THEN (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int]
      ELSE (ARRAY['Fire', 'Water', 'Earth', 'Wind', 'Ice', 'Metal', 'Holy', 'Dark', 'Lightning', 'Anima']::elemental_affinity[])[floor(random() * 10 + 1)::int]
    END) as aff
    FROM generate_series(1, 4)
  ) sub
  LIMIT (CASE WHEN random() < 0.4 THEN 3 ELSE 2 END)
)
WHERE rank = 'A' AND affinities = '{}';

-- S rank: 3 affinities (guaranteed 3, can have special affinities more commonly)
UPDATE hunters
SET affinities = (
  SELECT ARRAY_AGG(DISTINCT aff ORDER BY aff)
  FROM (
    SELECT (CASE
      WHEN random() < 0.5 THEN (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int]
      ELSE (ARRAY['Fire', 'Water', 'Earth', 'Wind', 'Ice', 'Metal', 'Holy', 'Dark', 'Lightning', 'Anima']::elemental_affinity[])[floor(random() * 10 + 1)::int]
    END) as aff
    FROM generate_series(1, 4)
  ) sub
  LIMIT 3
)
WHERE rank = 'S' AND affinities = '{}';

-- SS rank: 3-4 affinities (guaranteed 3, 50% chance for 4th, very likely to have special affinities)
UPDATE hunters
SET affinities = (
  SELECT ARRAY_AGG(DISTINCT aff ORDER BY aff)
  FROM (
    SELECT (CASE
      WHEN random() < 0.3 THEN (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int]
      ELSE (ARRAY['Fire', 'Water', 'Earth', 'Wind', 'Ice', 'Metal', 'Holy', 'Dark', 'Lightning', 'Anima']::elemental_affinity[])[floor(random() * 10 + 1)::int]
    END) as aff
    FROM generate_series(1, 5)
  ) sub
  LIMIT (CASE WHEN random() < 0.5 THEN 4 ELSE 3 END)
)
WHERE rank = 'SS' AND affinities = '{}';

-- SSS rank: 4 affinities (guaranteed 4, very likely to have special affinities)
UPDATE hunters
SET affinities = (
  SELECT ARRAY_AGG(DISTINCT aff ORDER BY aff)
  FROM (
    SELECT (CASE
      WHEN random() < 0.2 THEN (ARRAY['Fire', 'Water', 'Earth', 'Wind']::elemental_affinity[])[floor(random() * 4 + 1)::int]
      ELSE (ARRAY['Fire', 'Water', 'Earth', 'Wind', 'Ice', 'Metal', 'Holy', 'Dark', 'Lightning', 'Anima']::elemental_affinity[])[floor(random() * 10 + 1)::int]
    END) as aff
    FROM generate_series(1, 5)
  ) sub
  LIMIT 4
)
WHERE rank = 'SSS' AND affinities = '{}';

-- Make affinities required (not null)
ALTER TABLE hunters ALTER COLUMN affinities SET NOT NULL;
