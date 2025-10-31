-- Add scout_attempts and last_scout_refresh to guilds table
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS scout_attempts INTEGER DEFAULT 5;
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS last_scout_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create scouted_hunters table (hunters available for recruitment)
CREATE TABLE IF NOT EXISTS scouted_hunters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,

  -- Base Stats
  strength INTEGER NOT NULL,
  agility INTEGER NOT NULL,
  intelligence INTEGER NOT NULL,
  vitality INTEGER NOT NULL,
  luck INTEGER NOT NULL,

  -- Derived Stats
  hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  mana INTEGER NOT NULL,
  max_mana INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  magic INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  magic_resist INTEGER NOT NULL,

  -- Personality & Background
  personality TEXT,
  backstory TEXT,

  -- Abilities & Affinities
  affinities TEXT[] DEFAULT '{}',
  innate_abilities TEXT[] DEFAULT '{}',

  -- Recruitment Info
  signing_fee INTEGER NOT NULL,
  base_salary INTEGER NOT NULL,

  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_scouted_hunters_guild ON scouted_hunters(guild_id);
CREATE INDEX IF NOT EXISTS idx_scouted_hunters_expires ON scouted_hunters(expires_at);

-- Function to generate scouted hunters
CREATE OR REPLACE FUNCTION generate_scouted_hunters(p_guild_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_world_level INTEGER;
  v_result JSONB;
  v_hunter_data JSONB;
  i INTEGER;
BEGIN
  -- Get guild's world level
  SELECT world_level INTO v_world_level FROM guilds WHERE id = p_guild_id;

  -- Delete existing scouted hunters for this guild
  DELETE FROM scouted_hunters WHERE guild_id = p_guild_id;

  -- Generate 5 new hunters
  FOR i IN 1..5 LOOP
    -- Insert will be handled by the application layer which has the generation logic
    -- This function just clears old scouts
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Scouted hunters cleared, ready for new generation'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to recruit a scouted hunter
CREATE OR REPLACE FUNCTION recruit_scouted_hunter(
  p_guild_id UUID,
  p_scouted_hunter_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_scout_data RECORD;
  v_new_hunter_id UUID;
  v_guild_gold INTEGER;
  v_max_hunters INTEGER;
  v_current_hunters INTEGER;
BEGIN
  -- Get scouted hunter data
  SELECT * INTO v_scout_data FROM scouted_hunters
  WHERE id = p_scouted_hunter_id AND guild_id = p_guild_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Scouted hunter not found');
  END IF;

  -- Check if expired
  IF v_scout_data.expires_at < NOW() THEN
    RETURN jsonb_build_object('error', 'This hunter is no longer available');
  END IF;

  -- Check guild gold
  SELECT gold INTO v_guild_gold FROM guilds WHERE id = p_guild_id;
  IF v_guild_gold < v_scout_data.signing_fee THEN
    RETURN jsonb_build_object('error', 'Not enough gold for signing fee');
  END IF;

  -- Check hunter capacity
  SELECT max_hunters INTO v_max_hunters FROM guilds WHERE id = p_guild_id;
  SELECT COUNT(*) INTO v_current_hunters FROM hunters WHERE guild_id = p_guild_id;
  IF v_current_hunters >= v_max_hunters THEN
    RETURN jsonb_build_object('error', 'Guild is at maximum hunter capacity');
  END IF;

  -- Create the hunter
  INSERT INTO hunters (
    guild_id, name, rank, class, level,
    strength, agility, intelligence, vitality, luck,
    current_hp, max_hp, current_mana, max_mana,
    attack_power, magic_power, defense, magic_resistance,
    personality, backstory, affinities, innate_abilities, upkeep_cost
  ) VALUES (
    p_guild_id,
    v_scout_data.name,
    v_scout_data.rank::hunter_rank,
    v_scout_data.class::hunter_class,
    v_scout_data.level,
    v_scout_data.strength,
    v_scout_data.agility,
    v_scout_data.intelligence,
    v_scout_data.vitality,
    v_scout_data.luck,
    v_scout_data.max_hp,
    v_scout_data.max_hp,
    v_scout_data.max_mana,
    v_scout_data.max_mana,
    v_scout_data.attack,
    v_scout_data.magic,
    v_scout_data.defense,
    v_scout_data.magic_resist,
    v_scout_data.personality,
    v_scout_data.backstory,
    v_scout_data.affinities::elemental_affinity[],
    to_jsonb(v_scout_data.innate_abilities),
    v_scout_data.base_salary
  ) RETURNING id INTO v_new_hunter_id;

  -- Deduct signing fee from guild gold
  UPDATE guilds SET gold = gold - v_scout_data.signing_fee WHERE id = p_guild_id;

  -- Remove the scouted hunter
  DELETE FROM scouted_hunters WHERE id = p_scouted_hunter_id;

  RETURN jsonb_build_object(
    'success', true,
    'hunter_id', v_new_hunter_id,
    'signing_fee', v_scout_data.signing_fee
  );
END;
$$ LANGUAGE plpgsql;

-- Function to use a scout attempt
CREATE OR REPLACE FUNCTION use_scout_attempt(p_guild_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_attempts INTEGER;
  v_last_refresh TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current attempts and last refresh
  SELECT scout_attempts, last_scout_refresh
  INTO v_attempts, v_last_refresh
  FROM guilds WHERE id = p_guild_id;

  -- Check if we need to refresh (24 hours passed)
  IF v_last_refresh + INTERVAL '24 hours' < NOW() THEN
    v_attempts := 5;
    v_last_refresh := NOW();
    UPDATE guilds
    SET scout_attempts = 5, last_scout_refresh = NOW()
    WHERE id = p_guild_id;
  END IF;

  -- Check if we have attempts left
  IF v_attempts <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No scout attempts remaining',
      'attempts_remaining', 0,
      'next_refresh', v_last_refresh + INTERVAL '24 hours'
    );
  END IF;

  -- Use one attempt
  UPDATE guilds
  SET scout_attempts = scout_attempts - 1
  WHERE id = p_guild_id;

  RETURN jsonb_build_object(
    'success', true,
    'attempts_remaining', v_attempts - 1,
    'next_refresh', v_last_refresh + INTERVAL '24 hours'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check and auto-refresh scouts weekly
CREATE OR REPLACE FUNCTION check_scout_weekly_refresh()
RETURNS void AS $$
BEGIN
  -- Delete scouted hunters that have expired (7 days old)
  DELETE FROM scouted_hunters WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
