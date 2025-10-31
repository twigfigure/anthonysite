-- Guild Manager Game Schema
-- Solo Leveling inspired guild management game

-- Enable UUID extension (using gen_random_uuid from pgcrypto which is built-in)
-- Note: Supabase uses gen_random_uuid() by default, not gen_random_uuid()

-- Enums for game constants
CREATE TYPE hunter_rank AS ENUM ('F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS');
CREATE TYPE hunter_class AS ENUM ('Fighter', 'Tank', 'Mage', 'Healer', 'Assassin', 'Ranger', 'Support');
CREATE TYPE portal_difficulty AS ENUM ('Blue', 'Green', 'Yellow', 'Orange', 'Red', 'Purple', 'Black');
CREATE TYPE equipment_rarity AS ENUM ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic');
CREATE TYPE equipment_slot AS ENUM ('Weapon', 'Armor', 'Helmet', 'Boots', 'Gloves', 'Accessory', 'Artifact');
CREATE TYPE building_type AS ENUM ('Barracks', 'Training_Ground', 'Blacksmith', 'Infirmary', 'Warehouse', 'Research_Lab', 'Guild_Hall');
CREATE TYPE assignment_status AS ENUM ('Active', 'Completed', 'Failed');

-- Guilds table
CREATE TABLE guilds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Reference to auth.users
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    gold BIGINT DEFAULT 5000,
    crystals INTEGER DEFAULT 0, -- Premium currency
    influence INTEGER DEFAULT 0,
    world_level INTEGER DEFAULT 1 CHECK (world_level >= 1 AND world_level <= 10),
    max_hunters INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunters table
CREATE TABLE hunters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rank hunter_rank NOT NULL,
    class hunter_class NOT NULL,
    level INTEGER DEFAULT 1,
    experience BIGINT DEFAULT 0,

    -- Stats
    strength INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    vitality INTEGER DEFAULT 10,
    luck INTEGER DEFAULT 10,

    -- Combat stats
    max_hp INTEGER DEFAULT 100,
    current_hp INTEGER DEFAULT 100,
    max_mana INTEGER DEFAULT 50,
    current_mana INTEGER DEFAULT 50,
    attack_power INTEGER DEFAULT 10,
    magic_power INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    magic_resistance INTEGER DEFAULT 5,

    -- Death system
    death_count INTEGER DEFAULT 0,
    is_dead BOOLEAN DEFAULT FALSE,
    respawn_at TIMESTAMPTZ,

    -- Special abilities (JSON array of ability IDs)
    innate_abilities JSONB DEFAULT '[]',

    -- Assignment status
    is_assigned BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rarity equipment_rarity NOT NULL,
    slot equipment_slot NOT NULL,

    -- Base stats bonuses
    strength_bonus INTEGER DEFAULT 0,
    agility_bonus INTEGER DEFAULT 0,
    intelligence_bonus INTEGER DEFAULT 0,
    vitality_bonus INTEGER DEFAULT 0,
    luck_bonus INTEGER DEFAULT 0,

    -- Combat bonuses
    hp_bonus INTEGER DEFAULT 0,
    mana_bonus INTEGER DEFAULT 0,
    attack_bonus INTEGER DEFAULT 0,
    magic_bonus INTEGER DEFAULT 0,
    defense_bonus INTEGER DEFAULT 0,
    magic_resist_bonus INTEGER DEFAULT 0,

    -- Special effects (JSON object describing special abilities)
    special_effects JSONB DEFAULT '{}',

    -- Required level to equip
    required_level INTEGER DEFAULT 1,
    required_rank hunter_rank,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunter equipment inventory (junction table)
CREATE TABLE hunter_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunter_id UUID NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT FALSE,
    acquired_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portal templates (base configurations)
CREATE TABLE portal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    difficulty portal_difficulty NOT NULL,
    world_level INTEGER NOT NULL CHECK (world_level >= 1 AND world_level <= 10),
    is_boss_portal BOOLEAN DEFAULT FALSE,
    is_major_boss BOOLEAN DEFAULT FALSE,

    -- Requirements
    min_hunter_level INTEGER DEFAULT 1,
    recommended_hunters INTEGER DEFAULT 1,
    max_hunters INTEGER DEFAULT 5,

    -- Rewards
    base_gold INTEGER DEFAULT 100,
    base_experience INTEGER DEFAULT 50,

    -- Duration and costs
    completion_time_minutes INTEGER DEFAULT 30,
    entry_cost INTEGER DEFAULT 0,

    -- Loot table reference
    loot_table JSONB DEFAULT '[]',

    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active portals (instances)
CREATE TABLE portals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES portal_templates(id),

    -- Portal ownership/rights
    owned_by_guild BOOLEAN DEFAULT FALSE,
    ownership_expires_at TIMESTAMPTZ,

    -- Portal instance data
    is_active BOOLEAN DEFAULT TRUE,
    discovered_at TIMESTAMPTZ DEFAULT NOW(),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portal assignments (hunters assigned to portals)
CREATE TABLE portal_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_id UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
    hunter_id UUID NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,

    status assignment_status DEFAULT 'Active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Results
    success BOOLEAN,
    gold_earned INTEGER DEFAULT 0,
    experience_earned INTEGER DEFAULT 0,
    loot_acquired JSONB DEFAULT '[]', -- Array of equipment IDs and materials

    UNIQUE(hunter_id, portal_id, started_at)
);

-- Guild buildings
CREATE TABLE guild_buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    building_type building_type NOT NULL,
    level INTEGER DEFAULT 1,

    -- Building effects (JSON describing bonuses)
    effects JSONB DEFAULT '{}',

    constructed_at TIMESTAMPTZ DEFAULT NOW(),
    upgraded_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(guild_id, building_type)
);

-- World bosses
CREATE TABLE world_bosses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    world_level INTEGER NOT NULL CHECK (world_level >= 1 AND world_level <= 10),
    is_major_boss BOOLEAN DEFAULT FALSE,

    -- Boss stats
    hp BIGINT NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,

    -- Special mechanics
    abilities JSONB DEFAULT '[]',

    -- Defeat tracking per guild
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boss defeats (tracking which guilds defeated which bosses)
CREATE TABLE boss_defeats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    boss_id UUID NOT NULL REFERENCES world_bosses(id) ON DELETE CASCADE,
    defeated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Participants
    participating_hunters JSONB DEFAULT '[]', -- Array of hunter IDs

    UNIQUE(guild_id, boss_id)
);

-- Materials and resources
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rarity equipment_rarity NOT NULL,
    icon VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guild material inventory
CREATE TABLE guild_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,

    UNIQUE(guild_id, material_id)
);

-- Skill books
CREATE TABLE skill_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rarity equipment_rarity NOT NULL,
    class_requirement hunter_class,
    rank_requirement hunter_rank,

    -- Skill effects
    skill_effects JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunter skills (learned skills)
CREATE TABLE hunter_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunter_id UUID NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
    skill_book_id UUID NOT NULL REFERENCES skill_books(id) ON DELETE CASCADE,
    learned_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(hunter_id, skill_book_id)
);

-- Create indexes for performance
CREATE INDEX idx_guilds_user_id ON guilds(user_id);
CREATE INDEX idx_hunters_guild_id ON hunters(guild_id);
CREATE INDEX idx_hunters_rank ON hunters(rank);
CREATE INDEX idx_hunters_is_assigned ON hunters(is_assigned);
CREATE INDEX idx_portals_guild_id ON portals(guild_id);
CREATE INDEX idx_portal_assignments_hunter_id ON portal_assignments(hunter_id);
CREATE INDEX idx_portal_assignments_portal_id ON portal_assignments(portal_id);
CREATE INDEX idx_portal_assignments_status ON portal_assignments(status);
CREATE INDEX idx_hunter_equipment_hunter_id ON hunter_equipment(hunter_id);
CREATE INDEX idx_guild_buildings_guild_id ON guild_buildings(guild_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_guilds_updated_at BEFORE UPDATE ON guilds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hunters_updated_at BEFORE UPDATE ON hunters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
