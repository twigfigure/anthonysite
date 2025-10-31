// Guild Manager Game Helper Functions
import type {
  Hunter,
  HunterRank,
  PortalDifficulty,
  EquipmentRarity,
  ElementalAffinity
} from '../types';
import { BASIC_AFFINITIES, SPECIAL_AFFINITIES } from '../types';

// ============================================
// LEVEL AND EXPERIENCE CALCULATIONS
// ============================================

// Get max level for a given rank
export function getMaxLevelForRank(rank: HunterRank): number {
  const maxLevels: Record<HunterRank, number> = {
    D: 40,
    C: 50,
    B: 60,
    A: 80,
    S: 100,
    SS: 110,
    SSS: 120
  };
  return maxLevels[rank];
}

// Get max spell slots for a given rank
export function getMaxSpellSlotsForRank(rank: HunterRank): number {
  const maxSpellSlots: Record<HunterRank, number> = {
    D: 1,
    C: 2,
    B: 3,
    A: 5,
    S: 7,
    SS: 8,
    SSS: 10
  };
  return maxSpellSlots[rank];
}

// Get weekly upkeep cost for a hunter based on rank
export function getWeeklyUpkeepCost(rank: HunterRank): number {
  const upkeepCosts: Record<HunterRank, number> = {
    D: 1000,      // 1,000 gold/week
    C: 2500,      // 2,500 gold/week
    B: 6000,      // 6,000 gold/week
    A: 15000,     // 15,000 gold/week
    S: 40000,     // 40,000 gold/week
    SS: 100000,   // 100,000 gold/week
    SSS: 250000   // 250,000 gold/week
  };
  return upkeepCosts[rank];
}

// Get guaranteed minimum affinities for a given rank
export function getMinAffinitiesForRank(rank: HunterRank): number {
  const minAffinities: Record<HunterRank, number> = {
    D: 1,    // D rank: guaranteed 1
    C: 1,    // C rank: guaranteed 1
    B: 2,    // B rank: guaranteed 2
    A: 2,    // A rank: guaranteed 2
    S: 3,    // S rank: guaranteed 3
    SS: 3,   // SS rank: guaranteed 3
    SSS: 4   // SSS rank: guaranteed 4
  };
  return minAffinities[rank];
}

// Get max possible affinities for a given rank
export function getMaxAffinitiesForRank(rank: HunterRank): number {
  const maxAffinities: Record<HunterRank, number> = {
    D: 1,    // D rank: max 1
    C: 1,    // C rank: max 1
    B: 2,    // B rank: max 2
    A: 3,    // A rank: max 3 (guaranteed 2, might get 3)
    S: 3,    // S rank: max 3
    SS: 4,   // SS rank: max 4 (guaranteed 3, might get 4)
    SSS: 4   // SSS rank: max 4
  };
  return maxAffinities[rank];
}

// Experience required for next level (exponential growth)
export function getExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Get total experience needed to reach a level
export function getTotalExpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getExpForLevel(i);
  }
  return total;
}

// Check if hunter can level up
export function canLevelUp(hunter: Hunter): boolean {
  const expNeeded = getExpForLevel(hunter.level + 1);
  return hunter.experience >= expNeeded;
}

// Calculate level from experience
export function calculateLevelFromExp(experience: number): number {
  let level = 1;
  let expNeeded = 0;

  while (experience >= expNeeded) {
    expNeeded += getExpForLevel(level + 1);
    if (experience >= expNeeded) {
      level++;
    }
  }

  return level;
}

// ============================================
// STAT CALCULATIONS
// ============================================

// Calculate hunter's effective stats with equipment bonuses
export function calculateEffectiveStats(
  hunter: Hunter,
  equippedBonuses: {
    strength_bonus?: number;
    agility_bonus?: number;
    intelligence_bonus?: number;
    vitality_bonus?: number;
    luck_bonus?: number;
    hp_bonus?: number;
    mana_bonus?: number;
    attack_bonus?: number;
    magic_bonus?: number;
    defense_bonus?: number;
    magic_resist_bonus?: number;
  }
) {
  return {
    strength: hunter.strength + (equippedBonuses.strength_bonus || 0),
    agility: hunter.agility + (equippedBonuses.agility_bonus || 0),
    intelligence: hunter.intelligence + (equippedBonuses.intelligence_bonus || 0),
    vitality: hunter.vitality + (equippedBonuses.vitality_bonus || 0),
    luck: hunter.luck + (equippedBonuses.luck_bonus || 0),
    max_hp: hunter.max_hp + (equippedBonuses.hp_bonus || 0),
    max_mana: hunter.max_mana + (equippedBonuses.mana_bonus || 0),
    attack_power: hunter.attack_power + (equippedBonuses.attack_bonus || 0),
    magic_power: hunter.magic_power + (equippedBonuses.magic_bonus || 0),
    defense: hunter.defense + (equippedBonuses.defense_bonus || 0),
    magic_resistance: hunter.magic_resistance + (equippedBonuses.magic_resist_bonus || 0)
  };
}

// Calculate combat power (overall hunter strength)
// Includes equipment bonuses and skill count
export function calculateCombatPower(
  hunter: Hunter,
  equippedBonuses?: {
    strength_bonus?: number;
    agility_bonus?: number;
    intelligence_bonus?: number;
    vitality_bonus?: number;
    luck_bonus?: number;
    hp_bonus?: number;
    mana_bonus?: number;
    attack_bonus?: number;
    magic_bonus?: number;
    defense_bonus?: number;
    magic_resist_bonus?: number;
  },
  learnedSkillCount: number = 0
): number {
  // If equipment bonuses provided, calculate effective stats
  let stats = hunter;
  if (equippedBonuses) {
    const effectiveStats = calculateEffectiveStats(hunter, equippedBonuses);
    stats = {
      ...hunter,
      ...effectiveStats
    };
  }

  // Base combat power from stats
  const baseCp = (
    stats.attack_power * 2 +
    stats.magic_power * 2 +
    stats.defense +
    stats.magic_resistance +
    Math.floor(stats.max_hp / 10) +
    Math.floor(stats.max_mana / 10) +
    stats.strength +
    stats.agility +
    stats.intelligence +
    stats.vitality
  );

  // Add CP for innate abilities (passive skills)
  const innateAbilityBonus = hunter.innate_abilities.length * 50;

  // Add CP for learned skills (each skill adds 100 CP)
  const learnedSkillBonus = learnedSkillCount * 100;

  return baseCp + innateAbilityBonus + learnedSkillBonus;
}

// Calculate stats gained on level up
export function getStatsOnLevelUp(hunterClass: string, rank: HunterRank): {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  luck: number;
} {
  const rankMultiplier = getRankMultiplier(rank);

  const baseGains = {
    Fighter: { strength: 3, agility: 2, intelligence: 1, vitality: 2, luck: 1 },
    Tank: { strength: 2, agility: 1, intelligence: 1, vitality: 4, luck: 1 },
    Mage: { strength: 1, agility: 1, intelligence: 4, vitality: 2, luck: 1 },
    Healer: { strength: 1, agility: 1, intelligence: 3, vitality: 2, luck: 2 },
    Assassin: { strength: 2, agility: 4, intelligence: 1, vitality: 1, luck: 1 },
    Ranger: { strength: 2, agility: 3, intelligence: 1, vitality: 2, luck: 1 },
    Support: { strength: 1, agility: 2, intelligence: 2, vitality: 2, luck: 2 }
  };

  const gains = baseGains[hunterClass as keyof typeof baseGains] || baseGains.Fighter;

  return {
    strength: Math.floor(gains.strength * rankMultiplier),
    agility: Math.floor(gains.agility * rankMultiplier),
    intelligence: Math.floor(gains.intelligence * rankMultiplier),
    vitality: Math.floor(gains.vitality * rankMultiplier),
    luck: Math.floor(gains.luck * rankMultiplier)
  };
}

// Get rank multiplier for stat gains
function getRankMultiplier(rank: HunterRank): number {
  const multipliers: Record<HunterRank, number> = {
    D: 0.9,
    C: 1.0,
    B: 1.2,
    A: 1.5,
    S: 2.0,
    SS: 2.5,
    SSS: 3.0
  };
  return multipliers[rank];
}

// ============================================
// DEATH PENALTY CALCULATIONS
// ============================================

// Calculate respawn time based on death count
export function calculateRespawnTime(deathCount: number): number {
  // Base respawn time: 5 minutes
  // Increases by 5 minutes per death, capped at 60 minutes
  const baseTime = 5;
  const additionalTime = deathCount * 5;
  return Math.min(baseTime + additionalTime, 60);
}

// Calculate experience penalty on death
export function calculateDeathExpPenalty(hunter: Hunter): number {
  // Lose 10% of current experience, increased by 2% per death
  const basePenalty = 0.10;
  const additionalPenalty = hunter.death_count * 0.02;
  const totalPenalty = Math.min(basePenalty + additionalPenalty, 0.5); // Max 50% loss

  return Math.floor(hunter.experience * totalPenalty);
}

// ============================================
// PORTAL/DUNGEON CALCULATIONS
// ============================================

// Calculate portal completion time
export function calculatePortalCompletionTime(
  baseMinutes: number,
  hunterCount: number,
  recommendedCount: number
): number {
  // More hunters = faster completion (up to recommended count)
  // Fewer hunters = slower completion
  const ratio = hunterCount / recommendedCount;
  const multiplier = ratio >= 1 ? Math.max(0.5, 1 - (ratio - 1) * 0.1) : 1 + (1 - ratio);

  return Math.floor(baseMinutes * multiplier);
}

// Calculate success rate for portal
export function calculatePortalSuccessRate(
  hunters: Hunter[],
  portalDifficulty: PortalDifficulty,
  minLevel: number
): number {
  if (hunters.length === 0) return 0;

  // Calculate average combat power
  const avgCombatPower = hunters.reduce((sum, h) => sum + calculateCombatPower(h), 0) / hunters.length;

  // Calculate average level
  const avgLevel = hunters.reduce((sum, h) => sum + h.level, 0) / hunters.length;

  // Difficulty multiplier
  const difficultyMultipliers: Record<PortalDifficulty, number> = {
    Blue: 0.5,
    Green: 1.0,
    Yellow: 1.5,
    Orange: 2.0,
    Red: 3.0,
    Purple: 4.0,
    Black: 5.0
  };

  const difficultyRequirement = difficultyMultipliers[portalDifficulty] * minLevel * 50;
  const levelPenalty = avgLevel < minLevel ? (avgLevel / minLevel) : 1;

  // Success rate calculation
  const baseSuccess = Math.min((avgCombatPower / difficultyRequirement) * levelPenalty, 1);

  // Convert to percentage (30% to 95% range for balanced gameplay)
  return Math.max(30, Math.min(95, Math.floor(baseSuccess * 100)));
}

// ============================================
// LOOT CALCULATIONS
// ============================================

// Roll for loot drops
export function rollLoot(
  lootTable: {
    drop_rate: number;
    min_quantity?: number;
    max_quantity?: number;
    item_type: string;
    item_id?: string;
  }[],
  luckBonus: number = 0
): {
  item_type: string;
  item_id?: string;
  quantity: number;
}[] {
  const drops: {
    item_type: string;
    item_id?: string;
    quantity: number;
  }[] = [];

  lootTable.forEach(entry => {
    const adjustedDropRate = Math.min(entry.drop_rate + (luckBonus * 0.01), 1);
    const roll = Math.random();

    if (roll <= adjustedDropRate) {
      const quantity = entry.min_quantity
        ? Math.floor(
            Math.random() * (entry.max_quantity - entry.min_quantity + 1) + entry.min_quantity
          )
        : 1;

      drops.push({
        item_type: entry.item_type,
        item_id: entry.item_id,
        quantity
      });
    }
  });

  return drops;
}

// ============================================
// RANK/RARITY COMPARISONS
// ============================================

export function compareRanks(rank1: HunterRank, rank2: HunterRank): number {
  const ranks: HunterRank[] = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
  return ranks.indexOf(rank1) - ranks.indexOf(rank2);
}

export function compareRarities(rarity1: EquipmentRarity, rarity2: EquipmentRarity): number {
  const rarities: EquipmentRarity[] = [
    'Common',
    'Uncommon',
    'Rare',
    'Epic',
    'Legendary',
    'Mythic'
  ];
  return rarities.indexOf(rarity1) - rarities.indexOf(rarity2);
}

// ============================================
// NAME GENERATORS - ORGANIZED BY REGION
// ============================================

// Regional name pools grouped by kingdom/region and gender
const REGIONAL_NAMES = {
  // Northern Empire - Germanic/Nordic inspired, harsh cold climate
  northern: {
    maleNames: [
      'Ephraim', 'Dimitri', 'Ike', 'Hector', 'Soren',
      'Viktor', 'Flik', 'Georg', 'Eike', 'Josef', 'Bruno', 'Hodrick', 'Rolf',
      'Gunther', 'Klaus', 'Lars', 'Bjorn', 'Ragnar', 'Olaf', 'Sven', 'Erik'
    ],
    femaleNames: [
      'Eirika', 'Edelgard', 'Micaiah',
      'Freya', 'Astrid', 'Ingrid', 'Elsa', 'Sigrid', 'Helga', 'Brunhilde', 'Greta', 'Hilda'
    ],
    lastNames: [
      'Blaiddyd', 'Hresvelg', 'Galatea', 'Greil', 'Daein', 'Crimea', 'Eisner',
      'Ironhelm', 'Elfhelm', 'Drakengard', 'Drakenhold', 'Frostborne', 'Wintermane', 'Stormforge'
    ]
  },

  // Eastern Dynasty - Chinese/Japanese inspired
  eastern: {
    maleNames: [
      'Zhao', 'Guan', 'Zhang', 'Zhuge', 'Cao', 'Liu', 'Sun', 'Zhou', 'Xiahou', 'Sima',
      'Lu', 'Ma', 'Huang', 'Wei', 'Gan', 'Xu', 'Dian', 'Pang', 'Jiang',
      'Akira', 'Haruto', 'Ren', 'Kaito', 'Riku', 'Takeshi', 'Kenji', 'Masato', 'Hiroshi', 'Ryota'
    ],
    femaleNames: [
      'Diao', 'Yuki', 'Hana', 'Sakura', 'Mei', 'Sora',
      'Ayame', 'Yuri', 'Hikari', 'Natsuki', 'Ai', 'Yui', 'Rin', 'Kasumi'
    ],
    lastNames: [
      'Yun', 'Bei', 'Liang', 'Quan', 'Meng', 'Wen', 'Long', 'Feng', 'Shan', 'Xing',
      'Hayashi', 'Tanaka', 'Fujiwara', 'Takahashi', 'Nakamura', 'Yamamoto', 'Kobayashi', 'Watanabe',
      'Hoshido', 'Crimsonblade', 'Shadowpeak', 'Jadewing'
    ]
  },

  // Western Kingdom - Classic European fantasy
  western: {
    maleNames: [
      'Marth', 'Roy', 'Alm', 'Chrom', 'Robin', 'Corrin', 'Byleth',
      'Cloud', 'Ramza', 'Alain', 'Clive', 'Travis',
      'Arthur', 'Percival', 'Tristan', 'Lancelot', 'Galahad', 'Edmund', 'Frederick'
    ],
    femaleNames: [
      'Lyn', 'Celica', 'Lucina',
      'Celes', 'Terra', 'Tifa', 'Aerith', 'Lightning', 'Ashe',
      'Scarlett', 'Berenice', 'Melisandre', 'Rosalinde', 'Virginia', 'Tatiana',
      'Gwendolyn', 'Isolde', 'Guinevere', 'Elaine', 'Vivienne'
    ],
    lastNames: [
      'Renais', 'Riegan', 'Lowell', 'Ostia', 'Pherae', 'Caelin', 'Grado', 'Frelia', 'Leonster', 'Chalphy',
      'Strife', 'Lockhart', 'Gainsborough', 'Highwind', 'Leonhart', 'Almasy', 'Trepe',
      'Corvin', 'Valmore', 'Rossini', 'Gloucester', 'Bastoria', 'Sanctum', 'Silverpine', 'Stormwatch'
    ]
  },

  // Southern Tribes - African/Middle Eastern inspired
  southern: {
    maleNames: [
      'Kofi', 'Jabari', 'Kwame', 'Thabo',
      'Zahir', 'Rashid', 'Malik', 'Khalid', 'Tariq',
      'Adeyemi', 'Nkrumah', 'Tendai', 'Chinua', 'Kamau', 'Omar', 'Hassan', 'Karim'
    ],
    femaleNames: [
      'Amara', 'Zuri', 'Nia', 'Aisha', 'Imani', 'Chioma',
      'Soraya', 'Farah', 'Amira', 'Leyla', 'Zara',
      'Sanaa', 'Zola', 'Dessa', 'Fatima', 'Layla', 'Yasmin'
    ],
    lastNames: [
      'Mbeki', 'Okonkwo', 'Adeyemi', 'Nkrumah', 'Chinua', 'Tendai', 'Okoro', 'Mwangi', 'Bantu', 'Koroma',
      'al-Rashid', 'al-Zahir', 'ibn-Malik', 'al-Noor', 'al-Qamar', 'al-Shams', 'ibn-Tariq', 'al-Farid',
      'Sunscorched', 'Sandstrider', 'Dustwalker', 'Oasisborn'
    ]
  },

  // Central Republic - Diverse melting pot, cosmopolitan
  central: {
    maleNames: [
      'Vaan', 'Balthier', 'Noctis', 'Ignis', 'Prompto', 'Gladio', 'Zidane', 'Vivi', 'Tidus', 'Auron',
      'Lazlo', 'Jowy', 'Riou', 'Thomas', 'Hugo', 'Chris', 'Nash',
      'Arjun', 'Ravi', 'Vikram', 'Kiran', 'Indra', 'Rohan',
      'Marcus', 'Dimitri', 'Adrian', 'Sebastian'
    ],
    femaleNames: [
      'Fran', 'Yuna',
      'Nanami', 'Lucia',
      'Priya', 'Maya', 'Anjali', 'Kavya',
      'Elena', 'Sofia', 'Natasha', 'Isabella', 'Valentina'
    ],
    lastNames: [
      'Beoulve', 'Ashelia', 'Bunansa', 'Nabaat', 'Caelum', 'Argentum', 'Scientia', 'Amicitia', 'Izunia',
      'McDohl', 'Atreides', 'Silverberg', 'Blight', 'Falenas', 'Harmonia', 'Toran', 'Dunan',
      'Patel', 'Sharma', 'Kumar', 'Singh', 'Rao', 'Mehta', 'Gupta',
      'Irongate', 'Coalworth', 'Tradeway', 'Crossroads'
    ]
  },

  // Mystic Enclave - Arcane/magical, mysterious origins
  mystic: {
    maleNames: [
      'Claude', 'Gremio', 'Futch', 'Kahn',
      'Adel', 'Lhinalagos', 'Elgor', 'Morard',
      'Tenoch', 'Atl', 'Cualli',
      'Thales', 'Zephyr', 'Orpheus', 'Morpheus'
    ],
    femaleNames: [
      'Lysithea', 'Odessa', 'Kasumi', 'Valeria', 'Lorelai',
      'Primm', 'Dinah', 'Yunifi',
      'Itzal', 'Xochitl', 'Citlali', 'Nenetl', 'Yaretzi', 'Tlalli', 'Zyanya',
      'Azura', 'Nyx', 'Mystral', 'Arcana', 'Selene', 'Circe'
    ],
    lastNames: [
      'Valla', 'Nohr', 'Zexen', 'Karaya',
      'Xolotl', 'Tepeyac', 'Tonalli', 'Mixtli', 'Nahuatl', 'Coatl', 'Itzel', 'Yaotl', 'Necalli', 'Tlatoani',
      'Farrell', 'Tribal', 'Crescent',
      'Aethermoor', 'Shadowfen', 'Runestone', 'Voidwalker', 'Starweaver', 'Moonwhisper'
    ]
  }
};

// Helper function to get all first names by gender (for backward compatibility)
function getAllFirstNames(gender?: 'Male' | 'Female'): string[] {
  if (gender === 'Male') {
    return Object.values(REGIONAL_NAMES).flatMap(region => region.maleNames);
  } else if (gender === 'Female') {
    return Object.values(REGIONAL_NAMES).flatMap(region => region.femaleNames);
  }
  // If no gender specified, return all names
  return Object.values(REGIONAL_NAMES).flatMap(region => [...region.maleNames, ...region.femaleNames]);
}

// Helper function to get all last names (for backward compatibility)
function getAllLastNames(): string[] {
  return Object.values(REGIONAL_NAMES).flatMap(region => region.lastNames);
}

// Generate a name from a specific region and gender
export function generateNameFromRegion(
  regionKey: 'northern' | 'eastern' | 'western' | 'southern' | 'central' | 'mystic',
  gender?: 'Male' | 'Female'
): string {
  const region = REGIONAL_NAMES[regionKey];

  // Select appropriate name pool based on gender
  let firstNamePool: string[];
  if (gender === 'Male') {
    firstNamePool = region.maleNames;
  } else if (gender === 'Female') {
    firstNamePool = region.femaleNames;
  } else {
    // Random gender if not specified
    firstNamePool = Math.random() < 0.5 ? region.maleNames : region.femaleNames;
  }

  const firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
  const lastName = region.lastNames[Math.floor(Math.random() * region.lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Map region names to region keys
function getRegionKeyFromName(regionName: string): 'northern' | 'eastern' | 'western' | 'southern' | 'central' | 'mystic' {
  // Check which kingdom/region group the region belongs to
  if (regionName.includes('Frostspire') || regionName.includes('Glacial') || regionName.includes('Tundra')) {
    return 'northern';
  } else if (regionName.includes('Crimson') || regionName.includes('Jade') || regionName.includes('Shadow Mountains')) {
    return 'eastern';
  } else if (regionName.includes('Emerald') || regionName.includes('Silverpine') || regionName.includes('Stormcoast')) {
    return 'western';
  } else if (regionName.includes('Scorched') || regionName.includes('Savanna') || regionName.includes('Red Rock')) {
    return 'southern';
  } else if (regionName.includes('Irongate') || regionName.includes('Trade Routes') || regionName.includes('Coal')) {
    return 'central';
  } else if (regionName.includes('Aethermoor') || regionName.includes('Shadowfen') || regionName.includes('Runestone')) {
    return 'mystic';
  }
  // Default to random region
  const regions: Array<'northern' | 'eastern' | 'western' | 'southern' | 'central' | 'mystic'> =
    ['northern', 'eastern', 'western', 'southern', 'central', 'mystic'];
  return regions[Math.floor(Math.random() * regions.length)];
}

// Generate random hunter name (region and gender-aware)
export function generateRandomHunterName(region?: string, gender?: 'Male' | 'Female'): string {
  if (region) {
    const regionKey = getRegionKeyFromName(region);
    return generateNameFromRegion(regionKey, gender);
  }

  // If no region provided, use all names
  const allFirstNames = getAllFirstNames(gender);
  const allLastNames = getAllLastNames();
  const firstName = allFirstNames[Math.floor(Math.random() * allFirstNames.length)];
  const lastName = allLastNames[Math.floor(Math.random() * allLastNames.length)];
  return `${firstName} ${lastName}`;
}

// ============================================
// TIME FORMATTING
// ============================================

export function formatTimeRemaining(date: string | Date): string {
  const now = new Date().getTime();
  const target = new Date(date).getTime();
  const diff = target - now;

  if (diff <= 0) return 'Ready';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// ============================================
// NUMBER FORMATTING
// ============================================

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format gold with commas
export function formatGold(gold: number): string {
  return gold.toLocaleString();
}

// ============================================
// PERSONALITY AND BACKSTORY GENERATION
// ============================================

const PERSONALITY_TRAITS = [
  'brave and fearless',
  'cunning and strategic',
  'kind-hearted and compassionate',
  'hot-headed and impulsive',
  'calm and calculating',
  'cheerful and optimistic',
  'mysterious and reserved',
  'arrogant and confident',
  'humble and dedicated',
  'witty and charismatic',
  'stoic and determined',
  'playful and mischievous',
  'serious and disciplined',
  'adventurous and reckless',
  'protective and loyal',
  'ambitious and driven',
  'wise and thoughtful',
  'energetic and enthusiastic',
  'cold and ruthless',
  'gentle yet fierce'
];

const REGIONS = [
  // Northern Empire
  'Frostspire Peaks',
  'Glacial Wastes',
  'Tundra Borderlands',
  // Eastern Dynasty
  'Crimson Highlands',
  'Jade River Valley',
  'Shadow Mountains',
  // Western Kingdom
  'Emerald Heartlands',
  'Silverpine Forests',
  'Stormcoast',
  // Southern Tribes
  'Scorched Badlands',
  'Savanna Territories',
  'Red Rock Canyons',
  // Central Republic
  'Irongate District',
  'Trade Routes',
  'Coal Valleys',
  // Mystic Enclave
  'Aethermoor Heights',
  'The Shadowfen',
  'Runestone Wastes'
];

// Map regions to their kingdoms
const REGION_TO_KINGDOM: Record<string, string> = {
  // Northern Empire
  'Frostspire Peaks': 'Northern Empire',
  'Glacial Wastes': 'Northern Empire',
  'Tundra Borderlands': 'Northern Empire',
  // Eastern Dynasty
  'Crimson Highlands': 'Eastern Dynasty',
  'Jade River Valley': 'Eastern Dynasty',
  'Shadow Mountains': 'Eastern Dynasty',
  // Western Kingdom
  'Emerald Heartlands': 'Western Kingdom',
  'Silverpine Forests': 'Western Kingdom',
  'Stormcoast': 'Western Kingdom',
  // Southern Tribes
  'Scorched Badlands': 'Southern Tribes',
  'Savanna Territories': 'Southern Tribes',
  'Red Rock Canyons': 'Southern Tribes',
  // Central Republic
  'Irongate District': 'Central Republic',
  'Trade Routes': 'Central Republic',
  'Coal Valleys': 'Central Republic',
  // Mystic Enclave
  'Aethermoor Heights': 'Mystic Enclave',
  'The Shadowfen': 'Mystic Enclave',
  'Runestone Wastes': 'Mystic Enclave'
};

// Generate random personality trait
export function generatePersonality(): string {
  return PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)];
}

// Generate random region
export function generateRegion(): string {
  return REGIONS[Math.floor(Math.random() * REGIONS.length)];
}

// Get kingdom from region
export function getKingdomFromRegion(region: string): string {
  return REGION_TO_KINGDOM[region] || 'Unknown';
}

// Generate random gender
export function generateGender(): 'Male' | 'Female' {
  return Math.random() < 0.5 ? 'Male' : 'Female';
}

// Generate backstory based on hunter attributes
export function generateBackstory(
  name: string,
  hunterClass: string,
  rank: HunterRank,
  region: string,
  gender: 'Male' | 'Female',
  personality: string
): string {
  const pronoun = gender === 'Male' ? 'He' : 'She';
  const possessive = gender === 'Male' ? 'his' : 'her';
  const reflexive = gender === 'Male' ? 'himself' : 'herself';
  const objective = gender === 'Male' ? 'him' : 'her';

  // Parse personality traits
  const traits = personality.split(' and ').map(t => t.trim().toLowerCase());
  const trait1 = traits[0] || 'determined';
  const trait2 = traits[1] || 'skilled';

  // Get sentence count based on rank
  const sentenceCounts: Record<HunterRank, number> = {
    D: 2,
    C: 2,
    B: 3,
    A: 3,
    S: 4,
    SS: 4,
    SSS: 5
  };
  const sentenceCount = sentenceCounts[rank];

  const sentences: string[] = [];

  // Sentence 1: Specific origin story showing personality through action
  const origins = [
    `${name} first awakened in ${region} during a catastrophic portal breach. While others fled, ${pronoun} ${trait1 === 'brave' || trait1 === 'reckless' ? 'charged into the fray' : trait1 === 'cautious' || trait1 === 'analytical' ? 'carefully studied the monster patterns before striking' : trait1 === 'compassionate' || trait1 === 'kind' ? 'stayed behind to evacuate civilians' : 'demonstrated exceptional skill'}.`,
    `Born in ${region}, ${name} lost ${possessive} mentor to a C-rank portal collapse. ${pronoun} ${trait1 === 'vengeful' || trait1 === 'determined' ? 'vowed that day to become strong enough that no one else would suffer the same fate' : trait1 === 'cautious' ? 'became obsessed with understanding dungeon mechanics to prevent future tragedies' : trait1 === 'optimistic' ? 'chose to honor their memory by saving others' : 'never stopped training after that day'}.`,
    `${name} was a ${hunterClass.toLowerCase()} from ${region} who once ${trait1 === 'adventurous' || trait1 === 'reckless' ? 'volunteered for a suicide mission into an S-rank portal, returning with impossible loot and a wild grin' : trait1 === 'loyal' || trait1 === 'compassionate' ? `sacrificed ${possessive} chance at a legendary drop to save a fallen party member` : trait1 === 'greedy' || trait1 === 'ambitious' ? `betrayed ${possessive} original guild to claim a rare artifact, earning both power and infamy` : `proved ${reflexive} in the Trials of Ascension`}.`,
    `In ${region}, ${name} earned ${possessive} awakening through an unusual ritual. ${pronoun} ${trait2 === 'creative' || trait2 === 'innovative' ? 'developed a unique fighting style that veteran hunters still study' : trait2 === 'disciplined' ? 'trained for three years without missing a single day' : trait2 === 'lucky' ? `stumbled into a hidden dungeon and emerged with an artifact that chose ${objective}` : `mastered ${possessive} craft through relentless practice`}.`
  ];
  sentences.push(origins[Math.floor(Math.random() * origins.length)]);

  if (sentenceCount >= 2) {
    // Sentence 2: Specific action or incident showing second personality trait
    const incidents = [
      `During the ${region} Siege, ${pronoun} ${trait2 === 'strategic' || trait2 === 'analytical' ? 'identified a structural weakness in the boss monster and coordinated a precise strike team' : trait2 === 'selfless' || trait2 === 'brave' ? `used ${reflexive} as bait, drawing aggro while ${possessive} team escaped with critical intelligence` : trait2 === 'ruthless' || trait2 === 'pragmatic' ? 'made the hard call to seal the portal, trapping three hunters inside but saving the entire district' : 'turned the tide of battle with a single devastating combo'}.`,
      `${pronoun} once tracked a rare boss through ${region}'s treacherous terrain for five days. ${trait2 === 'patient' || trait2 === 'persistent' ? `The hunt tested ${possessive} endurance, but ${pronoun} refused to give up until the contract was fulfilled` : trait2 === 'impulsive' || trait2 === 'aggressive' ? `When it finally appeared, ${pronoun} attacked immediately, nearly dying but claiming the bounty` : trait2 === 'clever' ? `Rather than fighting, ${pronoun} lured it into a trap using stolen bait` : 'The confrontation became legendary among local hunters'}.`,
      `A novice guild in ${region} hired ${name} for a routine dungeon clear. ${pronoun} ${trait2 === 'protective' || trait2 === 'compassionate' ? 'spent the entire mission teaching them survival techniques, refusing payment afterward' : trait2 === 'arrogant' || trait2 === 'proud' ? `soloed the entire dungeon to prove ${possessive} superiority, embarrassing the rookies` : trait2 === 'methodical' ? 'created a detailed tactical plan that ensured zero casualties' : `impressed them with ${possessive} unconventional methods`}.`,
      `When a corrupted A-rank portal appeared near ${region}, ${name} ${trait2 === 'fearless' || trait2 === 'reckless' ? 'was the first to volunteer for the scouting party, despite warnings from guild masters' : trait2 === 'cautious' || trait2 === 'wise' ? 'convinced the raid leader to wait for reinforcements, saving countless lives' : trait2 === 'mercenary' || trait2 === 'pragmatic' ? 'negotiated triple hazard pay before accepting the contract' : 'joined the response team without hesitation'}.`
    ];
    sentences.push(incidents[Math.floor(Math.random() * incidents.length)]);
  }

  if (sentenceCount >= 3) {
    // Sentence 3: Reputation or notable characteristic
    const reputations = [
      `Other hunters from ${region} ${trait1 === 'arrogant' || trait1 === 'proud' ? `resent ${possessive} boastful attitude, but nobody can deny the results` : trait1 === 'humble' || trait1 === 'modest' ? `speak highly of ${objective}, praising ${possessive} willingness to help less experienced hunters` : trait1 === 'mysterious' || trait1 === 'secretive' ? `whisper about ${possessive} past, but ${pronoun} never discusses it` : `recognize ${objective} by reputation alone`}.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} signature move—${hunterClass === 'Fighter' ? 'a devastating three-strike combo' : hunterClass === 'Mage' ? 'a spell-chaining technique' : hunterClass === 'Tank' ? 'an immovable defensive stance' : hunterClass === 'Assassin' ? 'a shadow-step assassination' : hunterClass === 'Ranger' ? 'a impossible long-range shot' : hunterClass === 'Healer' ? 'an area-wide regeneration field' : 'a tactical maneuver'}—has been ${trait1 === 'creative' || trait1 === 'innovative' ? 'copied by dozens of aspiring hunters' : trait1 === 'proud' || trait1 === 'arrogant' ? `patented and trademarked, with ${name} suing imitators` : 'documented in several hunter academies'}.`,
      `${pronoun} carries ${hunterClass === 'Fighter' ? 'a notched blade' : hunterClass === 'Mage' ? 'a cracked spellbook' : hunterClass === 'Tank' ? 'a dented shield' : hunterClass === 'Assassin' ? 'twin daggers' : hunterClass === 'Ranger' ? 'a modified bow' : hunterClass === 'Healer' ? 'a ritual staff' : 'worn equipment'} from ${possessive} first successful raid in ${region}. ${pronoun} ${trait1 === 'sentimental' || trait1 === 'loyal' ? 'refuses to replace it despite offers for legendary gear' : trait1 === 'practical' || trait1 === 'pragmatic' ? 'keeps it as a backup weapon, never letting sentiment cloud judgment' : 'maintains it obsessively'}.`,
      `Guild recruiters from ${region} ${trait1 === 'independent' || trait1 === 'stubborn' ? `have stopped approaching ${objective}—${pronoun} made it clear ${pronoun} works alone` : trait1 === 'sociable' || trait1 === 'friendly' ? `compete aggressively for ${possessive} services, knowing ${pronoun} elevates any team` : trait1 === 'mercenary' || trait1 === 'greedy' ? `bid against each other for ${possessive} contract, driving up ${possessive} rates` : `recognize ${possessive} value`}.`
    ];
    sentences.push(reputations[Math.floor(Math.random() * reputations.length)]);
  }

  if (sentenceCount >= 4) {
    // Sentence 4: Current status or recent achievement
    const currentStatus = [
      `Most recently, ${name} ${rank === 'S' || rank === 'SS' || rank === 'SSS' ? `cleared an SS-rank portal solo, a feat that earned ${objective} recognition from the International Hunter Association` : rank === 'A' ? 'led a successful raid against an A-rank boss that had claimed seven parties' : rank === 'B' ? 'completed seventeen consecutive contracts without a single casualty' : 'survived a portal that was misclassified as C-rank'}.`,
      `${pronoun} currently ${trait2 === 'ambitious' || trait2 === 'driven' ? `seeks to challenge the legendary ${region} Guardian Dungeon, where even S-ranks fear to tread` : trait2 === 'methodical' || trait2 === 'patient' ? `documents every monster weakness ${pronoun} encounters, building a comprehensive bestiary` : trait2 === 'compassionate' ? 'runs a free training program for awakened hunters from disadvantaged backgrounds' : 'takes on increasingly difficult contracts'}.`,
      `After ${rank === 'SSS' || rank === 'SS' ? 'conquering the Abyssal Spire' : rank === 'S' || rank === 'A' ? `surviving the Portal Cascade of ${region}` : `clearing ${possessive} hundredth dungeon`}, ${name} ${trait2 === 'humble' ? `returned to ${region} to mentor young hunters, refusing to let success corrupt ${objective}` : trait2 === 'ambitious' ? 'immediately signed up for the next impossible challenge' : trait2 === 'cautious' ? 'took a month to recover and analyze what went wrong' : 'celebrated for exactly one night before returning to training'}.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} last contract in ${region} ${trait1 === 'lucky' ? `somehow succeeded despite everything going wrong—a building collapsed, ${possessive} equipment failed, and the boss mutated` : trait1 === 'strategic' ? 'became a case study in optimal resource management and risk assessment' : trait1 === 'aggressive' ? `ended three hours early because ${pronoun} speedran the entire dungeon` : 'left an impression on everyone who witnessed it'}.`
    ];
    sentences.push(currentStatus[Math.floor(Math.random() * currentStatus.length)]);
  }

  if (sentenceCount >= 5) {
    // Sentence 5: Future trajectory or philosophical stance (high ranks only)
    const future = [
      `Some say ${name} will eventually ${trait1 === 'ambitious' || trait1 === 'arrogant' ? 'challenge for the title of World\'s Strongest Hunter' : trait1 === 'mysterious' || trait1 === 'secretive' ? `reveal the true purpose behind ${possessive} relentless hunting` : trait1 === 'protective' || trait1 === 'heroic' ? 'become the shield that protects all of humanity' : 'reach the absolute pinnacle of power'}. ${pronoun} ${trait2 === 'determined' ? 'shows no signs of slowing down' : trait2 === 'philosophical' ? 'remains silent on the matter, focused only on the next hunt' : 'neither confirms nor denies it'}.`,
      `When asked about ${possessive} ultimate goal, ${name} ${trait2 === 'mysterious' ? 'simply smiled and changed the subject' : trait2 === 'honest' || trait2 === 'direct' ? `said: "I hunt because I can. Someone has to."` : trait2 === 'ambitious' ? `declared ${pronoun} would conquer every SS-rank portal in existence` : trait2 === 'humble' ? `shrugged and said ${pronoun} was just doing ${possessive} job` : 'gave no answer'}.`,
      `Legends say ${pronoun} ${trait1 === 'cursed' || trait1 === 'haunted' ? `is pursued by something from ${possessive} past, something that drives ${objective} to grow stronger` : trait1 === 'blessed' || trait1 === 'fated' ? 'was chosen by an ancient artifact that appears only once per generation' : trait1 === 'obsessed' ? `seeks something deep in the highest-ranked portals, though ${pronoun} never speaks of it` : 'will be remembered for generations'}. Whatever the truth, ${name}'s story is far from over.`,
      `The international hunter community ${trait2 === 'controversial' ? `remains divided on ${possessive} methods, but results speak louder than ethics debates` : trait2 === 'respected' ? `universally acknowledges ${objective} as one of the finest hunters of this generation` : trait2 === 'feared' ? `whispers ${possessive} name with a mixture of awe and terror` : `watches ${possessive} career with great interest`}. ${pronoun} continues to push the boundaries of what hunters can achieve.`
    ];
    sentences.push(future[Math.floor(Math.random() * future.length)]);
  }

  return sentences.join(' ');
}

// ============================================
// AFFINITY GENERATION
// ============================================

// Generate random affinities based on rank
export function generateAffinities(rank: HunterRank): ElementalAffinity[] {
  const minAffinities = getMinAffinitiesForRank(rank);
  const maxAffinities = getMaxAffinitiesForRank(rank);
  const affinities: ElementalAffinity[] = [];

  // Determine actual number of affinities (guaranteed min, chance for more)
  let targetCount = minAffinities;

  // Chance to get bonus affinities above minimum
  const bonusAffinityChance: Record<HunterRank, number> = {
    D: 0,     // No bonus possible (max = min)
    C: 0,     // No bonus possible (max = min)
    B: 0,     // No bonus possible (max = min)
    A: 0.4,   // 40% chance to get 3rd affinity
    S: 0,     // No bonus possible (max = min)
    SS: 0.5,  // 50% chance to get 4th affinity
    SSS: 0    // No bonus possible (max = min)
  };

  // Roll for bonus affinities
  while (targetCount < maxAffinities && Math.random() < bonusAffinityChance[rank]) {
    targetCount++;
  }

  // Special affinity probability based on rank (per affinity slot)
  const specialAffinityChance: Record<HunterRank, number> = {
    D: 0,     // No special affinities
    C: 0,     // No special affinities
    B: 0,     // No special affinities
    A: 0.3,   // 30% chance per affinity
    S: 0.5,   // 50% chance per affinity
    SS: 0.7,  // 70% chance per affinity
    SSS: 0.8  // 80% chance per affinity
  };

  const specialChance = specialAffinityChance[rank];

  // Generate unique affinities
  while (affinities.length < targetCount) {
    let affinity: ElementalAffinity;

    // For ranks that can have special affinities, roll for special vs basic
    if (specialChance > 0 && Math.random() < specialChance) {
      // Pick a special affinity
      const availableSpecial = SPECIAL_AFFINITIES.filter(a => !affinities.includes(a));
      if (availableSpecial.length > 0) {
        affinity = availableSpecial[Math.floor(Math.random() * availableSpecial.length)];
      } else {
        // No special affinities left, pick basic
        const availableBasic = BASIC_AFFINITIES.filter(a => !affinities.includes(a));
        if (availableBasic.length === 0) break;
        affinity = availableBasic[Math.floor(Math.random() * availableBasic.length)];
      }
    } else {
      // Pick a basic affinity
      const availableBasic = BASIC_AFFINITIES.filter(a => !affinities.includes(a));
      if (availableBasic.length === 0) {
        // No basic affinities left, pick from special
        const availableSpecial = SPECIAL_AFFINITIES.filter(a => !affinities.includes(a));
        if (availableSpecial.length === 0) break;
        affinity = availableSpecial[Math.floor(Math.random() * availableSpecial.length)];
      } else {
        affinity = availableBasic[Math.floor(Math.random() * availableBasic.length)];
      }
    }

    if (!affinities.includes(affinity)) {
      affinities.push(affinity);
    }
  }

  return affinities;
}
