e-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('avatar', 'splash_art', 'kingdom', 'equipment', 'custom')),
  base_prompt TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  negative_prompt TEXT,
  settings JSONB DEFAULT '{"width": 1024, "height": 1024}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create image_assets table
CREATE TABLE IF NOT EXISTS image_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt_used TEXT,
  template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prompt_templates_type ON prompt_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_image_assets_category ON image_assets(category);
CREATE INDEX IF NOT EXISTS idx_image_assets_tags ON image_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_image_assets_template_id ON image_assets(template_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for prompt_templates
CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin-only access)
-- Note: For production, you'd want to check against an admin list
CREATE POLICY "Allow all for authenticated users" ON prompt_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON image_assets
  FOR ALL USING (auth.role() = 'authenticated');