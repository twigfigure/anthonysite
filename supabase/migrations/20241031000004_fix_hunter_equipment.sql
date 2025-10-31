-- Add slot column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hunter_equipment' AND column_name = 'slot'
    ) THEN
        ALTER TABLE hunter_equipment ADD COLUMN slot TEXT NOT NULL DEFAULT 'Weapon';
        -- Remove the default after adding the column
        ALTER TABLE hunter_equipment ALTER COLUMN slot DROP DEFAULT;
    END IF;
END $$;

-- Add equipped_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hunter_equipment' AND column_name = 'equipped_at'
    ) THEN
        ALTER TABLE hunter_equipment ADD COLUMN equipped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'hunter_equipment' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE hunter_equipment ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Recreate the unique constraint if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'hunter_equipment_hunter_id_slot_key'
    ) THEN
        ALTER TABLE hunter_equipment
        ADD CONSTRAINT hunter_equipment_hunter_id_slot_key
        UNIQUE(hunter_id, slot);
    END IF;
END $$;

-- Recreate functions (these will replace existing ones)
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
