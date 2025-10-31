-- Add visual theme columns to kingdoms table for image generation
ALTER TABLE kingdoms
ADD COLUMN IF NOT EXISTS colors TEXT,
ADD COLUMN IF NOT EXISTS theme TEXT;

-- Update existing kingdoms with their visual themes
UPDATE kingdoms SET colors = 'deep navy blues, silver, white, and icy blues', theme = 'cold, regal, disciplined military aesthetic' WHERE id = 'northern-empire';
UPDATE kingdoms SET colors = 'crimson reds, gold, black, and jade greens', theme = 'elegant, traditional, honor-bound warrior aesthetic' WHERE id = 'eastern-dynasty';
UPDATE kingdoms SET colors = 'royal purples, gold, emerald greens, and white', theme = 'noble, chivalrous, classic knight aesthetic' WHERE id = 'western-kingdom';
UPDATE kingdoms SET colors = 'warm oranges, deep browns, terracotta, and bone white', theme = 'tribal, natural, primal warrior aesthetic' WHERE id = 'southern-tribes';
UPDATE kingdoms SET colors = 'steel grays, brass, dark blues, and burgundy', theme = 'industrial, pragmatic, soldier aesthetic' WHERE id = 'central-republic';
UPDATE kingdoms SET colors = 'deep purples, midnight blues, silver, and arcane cyan', theme = 'mysterious, magical, scholarly aesthetic' WHERE id = 'mystic-enclave';
