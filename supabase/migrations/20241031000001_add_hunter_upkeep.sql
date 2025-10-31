-- Add upkeep tracking to hunters table

-- Add upkeep_cost column (calculated based on rank, but stored for performance)
ALTER TABLE hunters ADD COLUMN upkeep_cost INTEGER DEFAULT 0;

-- Add last_upkeep_paid column to track when upkeep was last paid
ALTER TABLE hunters ADD COLUMN last_upkeep_paid TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing hunters with their upkeep costs based on rank
UPDATE hunters
SET upkeep_cost = CASE rank
  WHEN 'D' THEN 1000
  WHEN 'C' THEN 2500
  WHEN 'B' THEN 6000
  WHEN 'A' THEN 15000
  WHEN 'S' THEN 40000
  WHEN 'SS' THEN 100000
  WHEN 'SSS' THEN 250000
  ELSE 1000
END;

-- Make upkeep_cost not null after setting initial values
ALTER TABLE hunters ALTER COLUMN upkeep_cost SET NOT NULL;

-- Create function to calculate total guild upkeep
CREATE OR REPLACE FUNCTION get_guild_total_upkeep(p_guild_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(upkeep_cost), 0)::INTEGER
    FROM hunters
    WHERE guild_id = p_guild_id
      AND is_dead = false  -- Don't count dead hunters' upkeep
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to check if upkeep is due (weekly)
CREATE OR REPLACE FUNCTION is_upkeep_due(p_hunter_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_paid TIMESTAMP WITH TIME ZONE;
  days_since_payment INTEGER;
BEGIN
  SELECT last_upkeep_paid INTO last_paid
  FROM hunters
  WHERE id = p_hunter_id;

  days_since_payment := EXTRACT(EPOCH FROM (NOW() - last_paid)) / 86400;

  -- Upkeep due if 7+ days have passed
  RETURN days_since_payment >= 7;
END;
$$ LANGUAGE plpgsql;

-- Create function to pay hunter upkeep
CREATE OR REPLACE FUNCTION pay_hunter_upkeep(
  p_guild_id UUID,
  p_hunter_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_upkeep_cost INTEGER;
  v_guild_gold INTEGER;
BEGIN
  -- Get hunter upkeep cost
  SELECT upkeep_cost INTO v_upkeep_cost
  FROM hunters
  WHERE id = p_hunter_id AND guild_id = p_guild_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Hunter not found');
  END IF;

  -- Get guild gold
  SELECT gold INTO v_guild_gold
  FROM guilds
  WHERE id = p_guild_id;

  -- Check if guild has enough gold
  IF v_guild_gold < v_upkeep_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient gold');
  END IF;

  -- Deduct gold from guild
  UPDATE guilds
  SET gold = gold - v_upkeep_cost
  WHERE id = p_guild_id;

  -- Update hunter's last upkeep paid
  UPDATE hunters
  SET last_upkeep_paid = NOW()
  WHERE id = p_hunter_id;

  RETURN jsonb_build_object(
    'success', true,
    'cost', v_upkeep_cost,
    'remaining_gold', v_guild_gold - v_upkeep_cost
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to pay all guild upkeep at once
CREATE OR REPLACE FUNCTION pay_all_guild_upkeep(p_guild_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_upkeep INTEGER;
  v_guild_gold INTEGER;
  v_hunters_paid INTEGER := 0;
BEGIN
  -- Calculate total upkeep for all hunters (excluding dead ones)
  SELECT COALESCE(SUM(upkeep_cost), 0)::INTEGER INTO v_total_upkeep
  FROM hunters
  WHERE guild_id = p_guild_id
    AND is_dead = false;

  -- Get guild gold
  SELECT gold INTO v_guild_gold
  FROM guilds
  WHERE id = p_guild_id;

  -- Check if guild has enough gold
  IF v_guild_gold < v_total_upkeep THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient gold',
      'required', v_total_upkeep,
      'available', v_guild_gold
    );
  END IF;

  -- Deduct gold from guild
  UPDATE guilds
  SET gold = gold - v_total_upkeep
  WHERE id = p_guild_id;

  -- Update all hunters' last upkeep paid
  UPDATE hunters
  SET last_upkeep_paid = NOW()
  WHERE guild_id = p_guild_id
    AND is_dead = false;

  GET DIAGNOSTICS v_hunters_paid = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'total_cost', v_total_upkeep,
    'hunters_paid', v_hunters_paid,
    'remaining_gold', v_guild_gold - v_total_upkeep
  );
END;
$$ LANGUAGE plpgsql;
