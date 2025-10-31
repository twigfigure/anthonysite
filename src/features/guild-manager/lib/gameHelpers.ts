// Guild Manager Game Helper Functions
import type {
  Hunter,
  HunterRank,
  PortalDifficulty,
  EquipmentRarity,
  RANK_ORDER,
  DIFFICULTY_ORDER
} from '../types';

// ============================================
// LEVEL AND EXPERIENCE CALCULATIONS
// ============================================

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
export function calculateEffectiveStats(hunter: Hunter, equippedBonuses: any) {
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
    F: 0.5,
    E: 0.7,
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
export function rollLoot(lootTable: any[], luckBonus: number = 0): any[] {
  const drops: any[] = [];

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
  const ranks: HunterRank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
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
