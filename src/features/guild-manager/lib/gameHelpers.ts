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
export function calculateCombatPower(hunter: Hunter): number {
  return (
    hunter.attack_power * 2 +
    hunter.magic_power * 2 +
    hunter.defense +
    hunter.magic_resistance +
    Math.floor(hunter.max_hp / 10) +
    Math.floor(hunter.max_mana / 10) +
    hunter.strength +
    hunter.agility +
    hunter.intelligence +
    hunter.vitality
  );
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
// NAME GENERATORS
// ============================================

const FIRST_NAMES = [
  'Jin', 'Sung', 'Min', 'Hae', 'Yuri', 'Kai', 'Aria', 'Leo', 'Nova', 'Zara',
  'Ryu', 'Akira', 'Hana', 'Kira', 'Sora', 'Ren', 'Maya', 'Atlas', 'Luna', 'Orion'
];

const LAST_NAMES = [
  'Woo', 'Kim', 'Park', 'Lee', 'Choi', 'Stone', 'Frost', 'Storm', 'Blade', 'Shadow',
  'Steel', 'Moon', 'Star', 'Wind', 'Fire', 'Rain', 'Night', 'Dawn', 'Wild', 'Hart'
];

export function generateRandomHunterName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
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
  'the Northern Tundra',
  'the Eastern Highlands',
  'the Southern Deserts',
  'the Western Isles',
  'the Imperial Capital',
  'the Frontier Lands',
  'the Ancient Forest Kingdom',
  'the Coastal Cities',
  'the Mountain Strongholds',
  'the Merchant Republics'
];

// Generate random personality trait
export function generatePersonality(): string {
  return PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)];
}

// Generate random region
export function generateRegion(): string {
  return REGIONS[Math.floor(Math.random() * REGIONS.length)];
}

// Generate random gender
export function generateGender(): 'Male' | 'Female' {
  return Math.random() < 0.5 ? 'Male' : 'Female';
}

// Generate backstory based on hunter attributes
export function generateBackstory(
  hunterClass: string,
  rank: HunterRank,
  region: string,
  gender: 'Male' | 'Female',
  personality: string
): string {
  const pronoun = gender === 'Male' ? 'He' : 'She';
  const possessive = gender === 'Male' ? 'his' : 'her';
  const reflexive = gender === 'Male' ? 'himself' : 'herself';
  const verb = 'has';

  // Get sentence count based on rank
  const sentenceCounts: Record<HunterRank, number> = {
    D: 1,
    C: 2,
    B: 2,
    A: 3,
    S: 4,
    SS: 4,
    SSS: 5
  };
  const sentenceCount = sentenceCounts[rank];

  const sentences: string[] = [];

  // Sentence 1: Origin and class introduction (always included)
  const classIntros = {
    Fighter: `Born in ${region}, this ${hunterClass.toLowerCase()} ${verb} proven ${reflexive} in countless battles.`,
    Tank: `Hailing from ${region}, this ${hunterClass.toLowerCase()} stands as an unbreakable wall against any threat.`,
    Mage: `A ${hunterClass.toLowerCase()} from ${region}, wielding arcane powers that few can comprehend.`,
    Healer: `Coming from ${region}, this ${hunterClass.toLowerCase()} ${verb} saved countless lives with ${possessive} miraculous abilities.`,
    Assassin: `From the shadows of ${region}, this ${hunterClass.toLowerCase()} strikes with deadly precision.`,
    Ranger: `A ${hunterClass.toLowerCase()} born in ${region}, tracking prey across impossible terrain.`,
    Support: `Originating from ${region}, this ${hunterClass.toLowerCase()} empowers allies with unmatched tactical insight.`
  };
  sentences.push(classIntros[hunterClass as keyof typeof classIntros] || classIntros.Fighter);

  if (sentenceCount >= 2) {
    // Sentence 2: Personality and notable trait
    const him_her = gender === 'Male' ? 'him' : 'her';
    const personalityLines = [
      `${pronoun} is known for being ${personality}, a trait that has both aided and endangered ${possessive} missions.`,
      `Those who know ${him_her} describe ${him_her} as ${personality}, qualities that define ${possessive} approach to every challenge.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} ${personality} nature has become legendary among fellow hunters.`
    ];
    sentences.push(personalityLines[Math.floor(Math.random() * personalityLines.length)]);
  }

  if (sentenceCount >= 3) {
    // Sentence 3: Achievement or defining moment
    const achievements = [
      `${pronoun} ${verb} survived encounters that would have claimed lesser hunters.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} reputation was forged in the most dangerous portals.`,
      `Many owe ${possessive} lives to ${possessive} quick thinking and decisive action.`,
      `${pronoun} once faced a boss-level threat alone and lived to tell the tale.`
    ];
    sentences.push(achievements[Math.floor(Math.random() * achievements.length)]);
  }

  if (sentenceCount >= 4) {
    // Sentence 4: Motivation or goal
    const motivations = [
      `Driven by a desire to protect the innocent, ${pronoun} continues to grow stronger.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} ultimate goal is to conquer the most perilous dungeons known to humanity.`,
      `Seeking to prove ${reflexive}, ${pronoun} takes on increasingly difficult challenges.`,
      `${pronoun} fights not for glory, but to ensure a safer world for future generations.`
    ];
    sentences.push(motivations[Math.floor(Math.random() * motivations.length)]);
  }

  if (sentenceCount >= 5) {
    // Sentence 5: Legacy or reputation (SSS only)
    const legacies = [
      `Tales of ${possessive} exploits have spread across all regions, inspiring a new generation of hunters.`,
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} name is whispered with reverence in hunter circles worldwide.`,
      `Some say ${pronoun} is destined to become one of the greatest hunters in history.`,
      `Even guild masters seek ${possessive} counsel when facing unprecedented threats.`
    ];
    sentences.push(legacies[Math.floor(Math.random() * legacies.length)]);
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
