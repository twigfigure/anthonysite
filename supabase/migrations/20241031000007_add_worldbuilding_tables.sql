-- Create worldbuilding tables for kingdoms, regions, and rulers

-- Kingdoms table
CREATE TABLE IF NOT EXISTS kingdoms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  ruler TEXT,
  capital TEXT,
  culture TEXT,
  government TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  climate TEXT,
  terrain TEXT,
  key_features TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rulers table
CREATE TABLE IF NOT EXISTS rulers (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  personality TEXT,
  background TEXT,
  goals TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_regions_kingdom_id ON regions(kingdom_id);
CREATE INDEX IF NOT EXISTS idx_rulers_kingdom_id ON rulers(kingdom_id);

-- Enable RLS (Row Level Security)
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rulers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all authenticated users to read
CREATE POLICY "Allow authenticated users to read kingdoms"
  ON kingdoms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read regions"
  ON regions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read rulers"
  ON rulers FOR SELECT
  TO authenticated
  USING (true);

-- Create policies to allow only admins to modify (you'll need to update this with actual admin check)
-- For now, allowing all authenticated users to modify
CREATE POLICY "Allow authenticated users to insert kingdoms"
  ON kingdoms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update kingdoms"
  ON kingdoms FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete kingdoms"
  ON kingdoms FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert regions"
  ON regions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update regions"
  ON regions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete regions"
  ON regions FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert rulers"
  ON rulers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update rulers"
  ON rulers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete rulers"
  ON rulers FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial seed data
INSERT INTO kingdoms (id, name, description, ruler, capital, culture, government) VALUES
  ('northern-empire', 'Northern Empire', 'A harsh, militaristic empire forged in frozen mountains', 'Emperor Dimitri Blaiddyd', 'Frostspire Keep', 'Germanic/Nordic warrior culture', 'Imperial Monarchy'),
  ('eastern-dynasty', 'Eastern Dynasty', 'Ancient kingdom of honor, martial arts, and mysticism', 'Empress Yuki Crimsonblade', 'Crimson Palace', 'East Asian inspired', 'Imperial Dynasty'),
  ('western-kingdom', 'Western Kingdom', 'Classical chivalric kingdom of knights and nobility', 'King Arthur Renais', 'Silverpine Castle', 'European medieval', 'Feudal Monarchy'),
  ('southern-tribes', 'Southern Tribes', 'Nomadic confederation of desert and savanna warriors', 'Chief Khalid Sunscorched', 'Oasis Council', 'African/Middle Eastern inspired', 'Tribal Confederation'),
  ('central-republic', 'Central Republic', 'Cosmopolitan trading hub and melting pot of cultures', 'Chancellor Marcus Irongate', 'Irongate City', 'Diverse cosmopolitan', 'Democratic Republic'),
  ('mystic-enclave', 'Mystic Enclave', 'Secretive magical society hidden in enchanted forests', 'Archmage Azura Moonwhisper', 'The Shadowfen Tower', 'Arcane/mystical', 'Magocracy')
ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, kingdom_id, name, description, climate, terrain, key_features) VALUES
  ('frostspire-peaks', 'northern-empire', 'Frostspire Peaks', 'Jagged mountain range with eternal snow', 'Arctic', 'Mountains', 'Imperial capital, ancient ice dungeons, dragon nests'),
  ('glacial-wastes', 'northern-empire', 'Glacial Wastes', 'Endless frozen tundra', 'Arctic', 'Tundra', 'Ice golems, frost wyverns, nomadic tribes'),
  ('tundra-borderlands', 'northern-empire', 'Tundra Borderlands', 'Contested frontier zone', 'Subarctic', 'Tundra', 'Military outposts, border conflicts'),
  ('crimson-highlands', 'eastern-dynasty', 'Crimson Highlands', 'Rolling hills with red autumn foliage year-round', 'Temperate', 'Highlands', 'Martial arts monasteries, spirit shrines'),
  ('jade-river-valley', 'eastern-dynasty', 'Jade River Valley', 'Fertile valley with ancient temples', 'Subtropical', 'River Valley', 'Rice terraces, temple complexes, dragon cults'),
  ('shadow-mountains', 'eastern-dynasty', 'Shadow Mountains', 'Mysterious misty peaks', 'Temperate', 'Mountains', 'Ninja villages, hidden fortresses'),
  ('emerald-heartlands', 'western-kingdom', 'Emerald Heartlands', 'Lush green plains', 'Temperate', 'Plains', 'Knights orders, royal estates, jousting tournaments'),
  ('silverpine-forests', 'western-kingdom', 'Silverpine Forests', 'Ancient enchanted woodlands', 'Temperate', 'Forest', 'Elven enclaves, fae portals, witch covens'),
  ('stormcoast', 'western-kingdom', 'Stormcoast', 'Rocky coastal cliffs', 'Maritime', 'Coast', 'Naval bases, pirate havens, sea monster hunting'),
  ('scorched-badlands', 'southern-tribes', 'Scorched Badlands', 'Harsh desert wasteland', 'Arid', 'Desert', 'Sandworm hunting grounds, ancient ruins'),
  ('savanna-territories', 'southern-tribes', 'Savanna Territories', 'Wide grasslands with scattered acacia trees', 'Tropical', 'Savanna', 'Beast taming grounds, tribal gatherings'),
  ('red-rock-canyons', 'southern-tribes', 'Red Rock Canyons', 'Deep canyons with red sandstone', 'Arid', 'Canyons', 'Canyon settlements, rock climbing trials'),
  ('irongate-district', 'central-republic', 'Irongate District', 'Industrial heart of the republic', 'Urban', 'City', 'Trade guilds, airship ports, innovation district'),
  ('trade-routes', 'central-republic', 'Trade Routes', 'Major commercial highways', 'Varied', 'Roads', 'Merchant caravans, toll stations, roadside inns'),
  ('coal-valleys', 'central-republic', 'Coal Valleys', 'Mining region', 'Temperate', 'Valleys', 'Coal mines, industrial towns, steam technology'),
  ('aethermoor-heights', 'mystic-enclave', 'Aethermoor Heights', 'Floating islands of pure magic', 'Magical', 'Sky Islands', 'Mage academies, arcane libraries, ritual sites'),
  ('shadowfen', 'mystic-enclave', 'The Shadowfen', 'Dark swamp shrouded in mystery', 'Humid', 'Swamp', 'Witch circles, forbidden magic, dark experiments'),
  ('runestone-wastes', 'mystic-enclave', 'Runestone Wastes', 'Ancient battlefield turned magical dead zone', 'Wasteland', 'Badlands', 'Rune-carved monoliths, wild magic storms, necromantic research')
ON CONFLICT (id) DO NOTHING;
