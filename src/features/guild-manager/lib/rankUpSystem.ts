// Rank-Up System Helper Functions
import type { Hunter, HunterRank, RankUpConfig, RankUpRequirement } from '../types';
import { getMaxLevelForRank } from './gameHelpers';

// ============================================
// RANK-UP CONFIGURATIONS
// ============================================

// Get the next rank for a hunter
export function getNextRank(currentRank: HunterRank): HunterRank | null {
  const rankProgression: Record<HunterRank, HunterRank | null> = {
    D: 'C',
    C: 'B',
    B: 'A',
    A: 'S',
    S: 'SS',
    SS: 'SSS',
    SSS: null // Max rank
  };
  return rankProgression[currentRank];
}

// Check if hunter can attempt rank up
export function canAttemptRankUp(hunter: Hunter): boolean {
  // SSS rank cannot rank up (already max)
  if (hunter.rank === 'SSS') return false;

  // Must be at max level for current rank
  const maxLevel = getMaxLevelForRank(hunter.rank);
  return hunter.level >= maxLevel;
}

// CONFIGURABLE RANK-UP REQUIREMENTS
// TODO: Customize these requirements based on your game design
export function getRankUpConfig(fromRank: HunterRank): RankUpConfig | null {
  const nextRank = getNextRank(fromRank);
  if (!nextRank) return null;

  const configs: Record<HunterRank, RankUpConfig> = {
    // D -> C: Easy rank up, high success rate
    D: {
      from_rank: 'D',
      to_rank: 'C',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 10,000 gold',
          value: 10000
        },
        {
          type: 'portal_completions',
          description: 'Complete 5 portals',
          value: 5,
          metadata: { min_difficulty: 'Green' }
        }
      ],
      success_rate: 0.95 // 95% success rate
    },

    // C -> B: Moderate difficulty
    C: {
      from_rank: 'C',
      to_rank: 'B',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 50,000 gold',
          value: 50000
        },
        {
          type: 'portal_completions',
          description: 'Complete 10 Yellow or higher portals',
          value: 10,
          metadata: { min_difficulty: 'Yellow' }
        },
        {
          type: 'combat_power',
          description: 'Reach 500 combat power',
          value: 500
        }
      ],
      success_rate: 0.85, // 85% success rate
      failure_penalty: {
        lose_experience: true,
        lose_gold: 10000
      }
    },

    // B -> A: Multiplicatively harder
    B: {
      from_rank: 'B',
      to_rank: 'A',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 200,000 gold',
          value: 200000
        },
        {
          type: 'crystal_cost',
          description: 'Pay 50 crystals',
          value: 50
        },
        {
          type: 'portal_completions',
          description: 'Complete 20 Orange or higher portals',
          value: 20,
          metadata: { min_difficulty: 'Orange' }
        },
        {
          type: 'boss_defeats',
          description: 'Defeat 3 world bosses',
          value: 3
        },
        {
          type: 'combat_power',
          description: 'Reach 1,000 combat power',
          value: 1000
        }
      ],
      success_rate: 0.70, // 70% success rate
      failure_penalty: {
        lose_experience: true,
        lose_gold: 50000,
        death_chance: 0.10 // 10% chance of death on failure
      }
    },

    // A -> S: Very difficult
    A: {
      from_rank: 'A',
      to_rank: 'S',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 1,000,000 gold',
          value: 1000000
        },
        {
          type: 'crystal_cost',
          description: 'Pay 200 crystals',
          value: 200
        },
        {
          type: 'portal_completions',
          description: 'Complete 30 Red or higher portals',
          value: 30,
          metadata: { min_difficulty: 'Red' }
        },
        {
          type: 'boss_defeats',
          description: 'Defeat 10 world bosses',
          value: 10
        },
        {
          type: 'skill_count',
          description: 'Learn 5 skills',
          value: 5
        },
        {
          type: 'combat_power',
          description: 'Reach 2,500 combat power',
          value: 2500
        }
      ],
      success_rate: 0.50, // 50% success rate
      failure_penalty: {
        lose_experience: true,
        lose_gold: 200000,
        death_chance: 0.25 // 25% chance of death on failure
      }
    },

    // S -> SS: Extremely difficult
    S: {
      from_rank: 'S',
      to_rank: 'SS',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 5,000,000 gold',
          value: 5000000
        },
        {
          type: 'crystal_cost',
          description: 'Pay 500 crystals',
          value: 500
        },
        {
          type: 'portal_completions',
          description: 'Complete 50 Purple or Black portals',
          value: 50,
          metadata: { min_difficulty: 'Purple' }
        },
        {
          type: 'boss_defeats',
          description: 'Defeat 20 world bosses (including 5 major bosses)',
          value: 20,
          metadata: { major_bosses: 5 }
        },
        {
          type: 'skill_count',
          description: 'Master 7 skills',
          value: 7
        },
        {
          type: 'combat_power',
          description: 'Reach 5,000 combat power',
          value: 5000
        }
      ],
      success_rate: 0.30, // 30% success rate
      failure_penalty: {
        lose_experience: true,
        lose_gold: 1000000,
        death_chance: 0.40 // 40% chance of death on failure
      }
    },

    // SS -> SSS: Nearly impossible
    SS: {
      from_rank: 'SS',
      to_rank: 'SSS',
      requirements: [
        {
          type: 'gold_cost',
          description: 'Pay 20,000,000 gold',
          value: 20000000
        },
        {
          type: 'crystal_cost',
          description: 'Pay 2,000 crystals',
          value: 2000
        },
        {
          type: 'portal_completions',
          description: 'Complete 100 Black portals',
          value: 100,
          metadata: { min_difficulty: 'Black' }
        },
        {
          type: 'boss_defeats',
          description: 'Defeat 50 world bosses (including 15 major bosses)',
          value: 50,
          metadata: { major_bosses: 15 }
        },
        {
          type: 'skill_count',
          description: 'Master all 10 skill slots',
          value: 10
        },
        {
          type: 'equipment_tier',
          description: 'Equip full set of Legendary or Mythic gear',
          value: 7,
          metadata: { min_rarity: 'Legendary' }
        },
        {
          type: 'combat_power',
          description: 'Reach 10,000 combat power',
          value: 10000
        }
      ],
      success_rate: 0.15, // 15% success rate
      failure_penalty: {
        lose_experience: true,
        lose_gold: 5000000,
        death_chance: 0.50 // 50% chance of death on failure
      }
    },

    // SSS cannot rank up
    SSS: {
      from_rank: 'SSS',
      to_rank: 'SSS', // Placeholder
      requirements: [],
      success_rate: 0
    }
  };

  return configs[fromRank];
}

// ============================================
// REQUIREMENT CHECKING
// ============================================

// Check if hunter meets a specific requirement
// TODO: Implement actual checking logic when you have the data available
export async function checkRequirement(
  hunter: Hunter,
  requirement: RankUpRequirement,
  guildData?: { gold: number; crystals: number }
): Promise<{ met: boolean; current: number; required: number }> {
  switch (requirement.type) {
    case 'gold_cost':
      return {
        met: (guildData?.gold || 0) >= requirement.value,
        current: guildData?.gold || 0,
        required: requirement.value
      };

    case 'crystal_cost':
      return {
        met: (guildData?.crystals || 0) >= requirement.value,
        current: guildData?.crystals || 0,
        required: requirement.value
      };

    case 'combat_power':
      const combatPower = hunter.attack_power * 2 + hunter.magic_power * 2 +
                          hunter.defense + hunter.magic_resistance +
                          Math.floor(hunter.max_hp / 10) + Math.floor(hunter.max_mana / 10) +
                          hunter.strength + hunter.agility + hunter.intelligence + hunter.vitality;
      return {
        met: combatPower >= requirement.value,
        current: combatPower,
        required: requirement.value
      };

    // Placeholder for requirements that need database queries
    case 'portal_completions':
    case 'boss_defeats':
    case 'skill_count':
    case 'equipment_tier':
    case 'material_cost':
      // TODO: Implement actual checking when portal/boss/skill systems are ready
      return {
        met: false,
        current: 0,
        required: requirement.value
      };

    default:
      return {
        met: false,
        current: 0,
        required: requirement.value
      };
  }
}

// Check all requirements for a rank up
export async function checkAllRequirements(
  hunter: Hunter,
  guildData?: { gold: number; crystals: number }
): Promise<{
  canRankUp: boolean;
  requirements: Array<RankUpRequirement & { met: boolean; current: number; required: number }>;
}> {
  const config = getRankUpConfig(hunter.rank);
  if (!config) {
    return { canRankUp: false, requirements: [] };
  }

  const results = await Promise.all(
    config.requirements.map(async (req) => {
      const check = await checkRequirement(hunter, req, guildData);
      return {
        ...req,
        met: check.met,
        current: check.current,
        required: check.required
      };
    })
  );

  const allMet = results.every(r => r.met);

  return {
    canRankUp: allMet,
    requirements: results
  };
}

// ============================================
// RANK-UP ATTEMPT
// ============================================

// Attempt a rank up
export function attemptRankUp(config: RankUpConfig): {
  success: boolean;
  rolled: number;
  required: number;
} {
  const roll = Math.random();
  const success = roll <= config.success_rate;

  return {
    success,
    rolled: Math.floor(roll * 100),
    required: Math.floor(config.success_rate * 100)
  };
}

// Get rank up status text
export function getRankUpStatusText(hunter: Hunter): string {
  if (hunter.rank === 'SSS') {
    return 'Maximum rank achieved';
  }

  const maxLevel = getMaxLevelForRank(hunter.rank);
  if (hunter.level < maxLevel) {
    return `Reach level ${maxLevel} to attempt rank up`;
  }

  const nextRank = getNextRank(hunter.rank);
  return `Ready to attempt ${nextRank}-rank promotion`;
}
