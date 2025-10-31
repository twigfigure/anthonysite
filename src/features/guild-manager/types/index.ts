// Guild Manager Game Types

export type HunterRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export type HunterClass =
  | 'Fighter'
  | 'Tank'
  | 'Mage'
  | 'Healer'
  | 'Assassin'
  | 'Ranger'
  | 'Support';

export type PortalDifficulty =
  | 'Blue'    // Easy
  | 'Green'   // Normal
  | 'Yellow'  // Medium
  | 'Orange'  // Hard
  | 'Red'     // Very Hard
  | 'Purple'  // Special
  | 'Black';  // Disaster

export type EquipmentRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic';

export type EquipmentSlot =
  | 'Weapon'
  | 'Armor'
  | 'Helmet'
  | 'Boots'
  | 'Gloves'
  | 'Accessory'
  | 'Artifact';

export type BuildingType =
  | 'Barracks'
  | 'Training_Ground'
  | 'Blacksmith'
  | 'Infirmary'
  | 'Warehouse'
  | 'Research_Lab'
  | 'Guild_Hall';

export type AssignmentStatus = 'Active' | 'Completed' | 'Failed';

// Guild Interface
export interface Guild {
  id: string;
  user_id: string;
  name: string;
  region: string;
  level: number;
  gold: number;
  crystals: number;
  influence: number;
  world_level: number;
  max_hunters: number;
  created_at: string;
  updated_at: string;
}

// Hunter Interface
export interface Hunter {
  id: string;
  guild_id: string;
  name: string;
  rank: HunterRank;
  class: HunterClass;
  level: number;
  experience: number;
  region?: string; // Kingdom/region/culture origin

  // Images
  avatar_url?: string;
  splash_art_url?: string;

  // Stats
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  luck: number;

  // Combat stats
  max_hp: number;
  current_hp: number;
  max_mana: number;
  current_mana: number;
  attack_power: number;
  magic_power: number;
  defense: number;
  magic_resistance: number;

  // Death system
  death_count: number;
  is_dead: boolean;
  respawn_at?: string;

  // Special abilities
  innate_abilities: string[];

  // Assignment status
  is_assigned: boolean;

  created_at: string;
  updated_at: string;
}

// Equipment Interface
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  rarity: EquipmentRarity;
  slot: EquipmentSlot;

  // Base stats bonuses
  strength_bonus: number;
  agility_bonus: number;
  intelligence_bonus: number;
  vitality_bonus: number;
  luck_bonus: number;

  // Combat bonuses
  hp_bonus: number;
  mana_bonus: number;
  attack_bonus: number;
  magic_bonus: number;
  defense_bonus: number;
  magic_resist_bonus: number;

  // Special effects
  special_effects: Record<string, any>;

  // Requirements
  required_level: number;
  required_rank?: HunterRank;

  created_at: string;
}

// Hunter Equipment (Inventory Item)
export interface HunterEquipment {
  id: string;
  hunter_id: string;
  equipment_id: string;
  is_equipped: boolean;
  acquired_at: string;
  equipment?: Equipment; // Joined data
}

// Portal Template Interface
export interface PortalTemplate {
  id: string;
  name: string;
  difficulty: PortalDifficulty;
  world_level: number;
  is_boss_portal: boolean;
  is_major_boss: boolean;

  // Requirements
  min_hunter_level: number;
  recommended_hunters: number;
  max_hunters: number;

  // Rewards
  base_gold: number;
  base_experience: number;

  // Duration and costs
  completion_time_minutes: number;
  entry_cost: number;

  // Loot
  loot_table: LootEntry[];

  description?: string;
  created_at: string;
}

// Portal Instance Interface
export interface Portal {
  id: string;
  guild_id: string;
  template_id: string;

  // Ownership
  owned_by_guild: boolean;
  ownership_expires_at?: string;

  // Status
  is_active: boolean;
  discovered_at: string;

  created_at: string;

  // Joined data
  template?: PortalTemplate;
}

// Portal Assignment Interface
export interface PortalAssignment {
  id: string;
  portal_id: string;
  hunter_id: string;

  status: AssignmentStatus;
  started_at: string;
  completed_at?: string;

  // Results
  success?: boolean;
  gold_earned: number;
  experience_earned: number;
  loot_acquired: LootDrop[];

  // Joined data
  portal?: Portal;
  hunter?: Hunter;
}

// Guild Building Interface
export interface GuildBuilding {
  id: string;
  guild_id: string;
  building_type: BuildingType;
  level: number;

  // Effects
  effects: BuildingEffects;

  constructed_at: string;
  upgraded_at: string;
}

// World Boss Interface
export interface WorldBoss {
  id: string;
  name: string;
  world_level: number;
  is_major_boss: boolean;

  // Boss stats
  hp: number;
  attack: number;
  defense: number;

  // Special mechanics
  abilities: BossAbility[];

  description?: string;
  created_at: string;
}

// Boss Defeat Record
export interface BossDefeat {
  id: string;
  guild_id: string;
  boss_id: string;
  defeated_at: string;

  // Participants
  participating_hunters: string[];

  // Joined data
  boss?: WorldBoss;
}

// Material Interface
export interface Material {
  id: string;
  name: string;
  description?: string;
  rarity: EquipmentRarity;
  icon?: string;
  created_at: string;
}

// Guild Material Inventory
export interface GuildMaterial {
  id: string;
  guild_id: string;
  material_id: string;
  quantity: number;

  // Joined data
  material?: Material;
}

// Skill Book Interface
export interface SkillBook {
  id: string;
  name: string;
  description?: string;
  rarity: EquipmentRarity;
  class_requirement?: HunterClass;
  rank_requirement?: HunterRank;

  // Skill effects
  skill_effects: SkillEffects;

  created_at: string;
}

// Hunter Skill (Learned)
export interface HunterSkill {
  id: string;
  hunter_id: string;
  skill_book_id: string;
  learned_at: string;

  // Joined data
  skill_book?: SkillBook;
}

// Supporting Types

export interface LootEntry {
  item_type: 'equipment' | 'material' | 'skill_book' | 'gold';
  item_id?: string;
  drop_rate: number; // 0-1 (0% to 100%)
  min_quantity?: number;
  max_quantity?: number;
}

export interface LootDrop {
  item_type: 'equipment' | 'material' | 'skill_book' | 'gold';
  item_id?: string;
  quantity: number;
}

export interface BuildingEffects {
  hunter_capacity_bonus?: number;
  training_speed_multiplier?: number;
  craft_cost_reduction?: number;
  heal_speed_multiplier?: number;
  storage_capacity_bonus?: number;
  research_speed_multiplier?: number;
  [key: string]: any;
}

export interface BossAbility {
  name: string;
  description: string;
  damage?: number;
  effect_type?: string;
}

export interface SkillEffects {
  damage?: number;
  damage_type?: 'physical' | 'magical';
  cooldown?: number;
  mana_cost?: number;
  buff_stats?: Partial<Record<keyof Hunter, number>>;
  debuff_stats?: Partial<Record<keyof Hunter, number>>;
  [key: string]: any;
}

// Game Constants
export const RANK_ORDER: HunterRank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const DIFFICULTY_ORDER: PortalDifficulty[] = [
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Red',
  'Purple',
  'Black'
];

export const RARITY_ORDER: EquipmentRarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic'
];

// Color mappings for UI
export const RANK_COLORS: Record<HunterRank, string> = {
  F: 'text-gray-500',
  E: 'text-gray-400',
  D: 'text-green-500',
  C: 'text-blue-500',
  B: 'text-purple-500',
  A: 'text-pink-500',
  S: 'text-yellow-500',
  SS: 'text-orange-500',
  SSS: 'text-red-500'
};

export const DIFFICULTY_COLORS: Record<PortalDifficulty, string> = {
  Blue: 'bg-blue-500',
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-500',
  Orange: 'bg-orange-500',
  Red: 'bg-red-500',
  Purple: 'bg-purple-500',
  Black: 'bg-black'
};

export const RARITY_COLORS: Record<EquipmentRarity, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-green-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Legendary: 'text-orange-400',
  Mythic: 'text-pink-400'
};
