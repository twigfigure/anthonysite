-- Create hunter_equipment table to track equipped items
CREATE TABLE IF NOT EXISTS hunter_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hunter_id UUID NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  slot TEXT NOT NULL,
  equipped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure only one item per slot per hunter
  UNIQUE(hunter_id, slot)
);

-- Create index for faster lookups
CREATE INDEX idx_hunter_equipment_hunter ON hunter_equipment(hunter_id);
CREATE INDEX idx_hunter_equipment_equipment ON hunter_equipment(equipment_id);

-- Function to equip an item to a hunter
CREATE OR REPLACE FUNCTION equip_item_to_hunter(
  p_hunter_id UUID,
  p_equipment_id UUID,
  p_slot TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Insert or update the equipment for this slot
  INSERT INTO hunter_equipment (hunter_id, equipment_id, slot, equipped_at)
  VALUES (p_hunter_id, p_equipment_id, p_slot, NOW())
  ON CONFLICT (hunter_id, slot)
  DO UPDATE SET
    equipment_id = p_equipment_id,
    equipped_at = NOW()
  RETURNING jsonb_build_object(
    'id', id,
    'hunter_id', hunter_id,
    'equipment_id', equipment_id,
    'slot', slot,
    'equipped_at', equipped_at
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function to unequip an item from a hunter
CREATE OR REPLACE FUNCTION unequip_item_from_hunter(
  p_hunter_id UUID,
  p_slot TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM hunter_equipment
  WHERE hunter_id = p_hunter_id AND slot = p_slot;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get all equipped items for a hunter
CREATE OR REPLACE FUNCTION get_hunter_equipped_items(p_hunter_id UUID)
RETURNS TABLE (
  slot TEXT,
  equipment_id UUID,
  equipment_name TEXT,
  equipment_rarity TEXT,
  strength_bonus INTEGER,
  agility_bonus INTEGER,
  intelligence_bonus INTEGER,
  vitality_bonus INTEGER,
  luck_bonus INTEGER,
  hp_bonus INTEGER,
  mana_bonus INTEGER,
  attack_bonus INTEGER,
  magic_bonus INTEGER,
  defense_bonus INTEGER,
  magic_resist_bonus INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    he.slot,
    e.id as equipment_id,
    e.name as equipment_name,
    e.rarity as equipment_rarity,
    e.strength_bonus,
    e.agility_bonus,
    e.intelligence_bonus,
    e.vitality_bonus,
    e.luck_bonus,
    e.hp_bonus,
    e.mana_bonus,
    e.attack_bonus,
    e.magic_bonus,
    e.defense_bonus,
    e.magic_resist_bonus
  FROM hunter_equipment he
  JOIN equipment e ON he.equipment_id = e.id
  WHERE he.hunter_id = p_hunter_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total equipment bonuses for a hunter
CREATE OR REPLACE FUNCTION get_hunter_equipment_bonuses(p_hunter_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_bonuses JSONB;
BEGIN
  SELECT jsonb_build_object(
    'strength_bonus', COALESCE(SUM(e.strength_bonus), 0),
    'agility_bonus', COALESCE(SUM(e.agility_bonus), 0),
    'intelligence_bonus', COALESCE(SUM(e.intelligence_bonus), 0),
    'vitality_bonus', COALESCE(SUM(e.vitality_bonus), 0),
    'luck_bonus', COALESCE(SUM(e.luck_bonus), 0),
    'hp_bonus', COALESCE(SUM(e.hp_bonus), 0),
    'mana_bonus', COALESCE(SUM(e.mana_bonus), 0),
    'attack_bonus', COALESCE(SUM(e.attack_bonus), 0),
    'magic_bonus', COALESCE(SUM(e.magic_bonus), 0),
    'defense_bonus', COALESCE(SUM(e.defense_bonus), 0),
    'magic_resist_bonus', COALESCE(SUM(e.magic_resist_bonus), 0)
  )
  INTO v_bonuses
  FROM hunter_equipment he
  JOIN equipment e ON he.equipment_id = e.id
  WHERE he.hunter_id = p_hunter_id;

  RETURN v_bonuses;
END;
$$ LANGUAGE plpgsql;
