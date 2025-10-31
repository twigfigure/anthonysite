// Passive Ability Generation for Hunters
// Inspired by Fire Emblem Three Houses - grounded combat abilities
import type { HunterRank, HunterClass } from '../types';

interface PassiveAbility {
  name: string;
  description: string;
  effect: string; // Mechanical effect description
}

// Base ability pools for each class
const CLASS_BASE_ABILITIES: Record<HunterClass, string[]> = {
  Fighter: [
    'Weapon Mastery',
    'Combat Focus',
    'Battle Hardened',
    'Swift Strikes',
    'Tactical Advantage',
    'Relentless Assault',
    'Veteran Reflexes',
    'Warrior\'s Pride',
  ],
  Tank: [
    'Iron Wall',
    'Bulwark',
    'Guardian\'s Resolve',
    'Defensive Stance',
    'Unbreakable',
    'Fortress Mind',
    'Shieldbearer',
    'Immovable Object',
  ],
  Mage: [
    'Magical Affinity',
    'Spell Precision',
    'Arcane Efficiency',
    'Focus Mastery',
    'Mana Conservation',
    'Spell Amplification',
    'Tactical Caster',
    'Arcane Insight',
  ],
  Healer: [
    'Healing Touch',
    'Recovery Boost',
    'Blessed Presence',
    'Triage Expert',
    'Soothing Aura',
    'Medical Expertise',
    'Life Bond',
    'Restoration Mastery',
  ],
  Assassin: [
    'Shadow Step',
    'Critical Eye',
    'Lethal Precision',
    'Evasion',
    'Silent Movement',
    'Vital Strike',
    'Quick Reflexes',
    'Deadly Finisher',
  ],
  Ranger: [
    'Deadeye',
    'Quick Draw',
    'Eagle Eye',
    'Marksman',
    'Survival Instinct',
    'Long Range',
    'Steady Aim',
    'Hunter\'s Focus',
  ],
  Support: [
    'Rallying Cry',
    'Team Coordination',
    'Morale Boost',
    'Strategic Mind',
    'Encouraging Presence',
    'Tactical Support',
    'Inspiration',
    'Squad Leader',
  ],
};

// Rank-based effect scaling (how powerful the ability is)
const RANK_EFFECT_MODIFIERS: Record<HunterRank, { prefix: string; multiplier: number }> = {
  F: { prefix: 'Minor', multiplier: 1.05 },
  E: { prefix: 'Slight', multiplier: 1.08 },
  D: { prefix: 'Basic', multiplier: 1.12 },
  C: { prefix: 'Improved', multiplier: 1.15 },
  B: { prefix: 'Enhanced', multiplier: 1.20 },
  A: { prefix: 'Advanced', multiplier: 1.25 },
  S: { prefix: 'Superior', multiplier: 1.35 },
  SS: { prefix: 'Elite', multiplier: 1.50 },
  SSS: { prefix: 'Legendary', multiplier: 1.75 },
};

// Ability descriptions based on class and effect type
const ABILITY_EFFECTS: Record<string, (rank: HunterRank, mult: number) => string> = {
  // Fighter abilities
  'Weapon Mastery': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% damage with all weapons`,
  'Combat Focus': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% critical hit chance`,
  'Battle Hardened': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% HP`,
  'Swift Strikes': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% attack speed`,
  'Tactical Advantage': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% damage when attacking first`,
  'Relentless Assault': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% attack power after consecutive hits`,
  'Veteran Reflexes': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% agility in combat`,
  'Warrior\'s Pride': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% all stats when HP below 50%`,

  // Tank abilities
  'Iron Wall': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% defense`,
  'Bulwark': (rank, mult) => `Reduces damage taken by ${Math.floor((mult - 1) * 100)}%`,
  'Guardian\'s Resolve': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% defense when protecting allies`,
  'Defensive Stance': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% physical resistance`,
  'Unbreakable': (rank, mult) => `Ignore ${Math.floor((mult - 1) * 100)}% of armor penetration`,
  'Fortress Mind': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% magic resistance`,
  'Shieldbearer': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% effectiveness when using shields`,
  'Immovable Object': (rank, mult) => `Cannot be knocked back; +${Math.floor((mult - 1) * 100)}% vitality`,

  // Mage abilities
  'Magical Affinity': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% magic power`,
  'Spell Precision': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% spell accuracy`,
  'Arcane Efficiency': (rank, mult) => `Reduces mana cost by ${Math.floor((mult - 1) * 100)}%`,
  'Focus Mastery': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% intelligence`,
  'Mana Conservation': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% max mana`,
  'Spell Amplification': (rank, mult) => `Spells deal +${Math.floor((mult - 1) * 100)}% damage`,
  'Tactical Caster': (rank, mult) => `Reduces spell cooldown by ${Math.floor((mult - 1) * 100)}%`,
  'Arcane Insight': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% spell critical chance`,

  // Healer abilities
  'Healing Touch': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% healing effectiveness`,
  'Recovery Boost': (rank, mult) => `Heals restore +${Math.floor((mult - 1) * 100)}% additional HP`,
  'Blessed Presence': (rank, mult) => `Nearby allies regenerate ${Math.floor((mult - 1) * 5)}% HP per turn`,
  'Triage Expert': (rank, mult) => `Healing spells cost ${Math.floor((mult - 1) * 100)}% less mana`,
  'Soothing Aura': (rank, mult) => `Reduces party damage taken by ${Math.floor((mult - 1) * 50)}%`,
  'Medical Expertise': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% status ailment recovery`,
  'Life Bond': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% vitality for self and nearby allies`,
  'Restoration Mastery': (rank, mult) => `Healing over time effects ${Math.floor((mult - 1) * 100)}% stronger`,

  // Assassin abilities
  'Shadow Step': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% evasion`,
  'Critical Eye': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% critical damage`,
  'Lethal Precision': (rank, mult) => `Attacks ignore ${Math.floor((mult - 1) * 100)}% of enemy defense`,
  'Evasion': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% dodge chance`,
  'Silent Movement': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% agility`,
  'Vital Strike': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% damage to weak points`,
  'Quick Reflexes': (rank, mult) => `Strike first ${Math.floor((mult - 1) * 100)}% more often`,
  'Deadly Finisher': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% damage to low HP enemies`,

  // Ranger abilities
  'Deadeye': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% ranged damage`,
  'Quick Draw': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% attack speed with ranged weapons`,
  'Eagle Eye': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% critical chance with ranged attacks`,
  'Marksman': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% accuracy at long range`,
  'Survival Instinct': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% evasion in open terrain`,
  'Long Range': (rank, mult) => `Increases effective range by ${Math.floor((mult - 1) * 100)}%`,
  'Steady Aim': (rank, mult) => `Ignores ${Math.floor((mult - 1) * 100)}% of evasion`,
  'Hunter\'s Focus': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% damage after not moving`,

  // Support abilities
  'Rallying Cry': (rank, mult) => `Nearby allies gain +${Math.floor((mult - 1) * 100)}% attack power`,
  'Team Coordination': (rank, mult) => `Party gains +${Math.floor((mult - 1) * 50)}% to all stats`,
  'Morale Boost': (rank, mult) => `Restores ${Math.floor((mult - 1) * 5)}% HP to party each turn`,
  'Strategic Mind': (rank, mult) => `+${Math.floor((mult - 1) * 100)}% intelligence for self and allies`,
  'Encouraging Presence': (rank, mult) => `Nearby allies gain +${Math.floor((mult - 1) * 100)}% critical chance`,
  'Tactical Support': (rank, mult) => `Reduces party skill cooldowns by ${Math.floor((mult - 1) * 100)}%`,
  'Inspiration': (rank, mult) => `Party deals +${Math.floor((mult - 1) * 50)}% damage`,
  'Squad Leader': (rank, mult) => `+${Math.floor((mult - 1) * 50)}% effectiveness for all party abilities`,
};

/**
 * Generates a passive ability for a hunter based on their rank and class
 */
export function generatePassiveAbility(rank: HunterRank, hunterClass: HunterClass): PassiveAbility {
  // Get ability pool for this class
  const abilityPool = CLASS_BASE_ABILITIES[hunterClass];

  // Randomly select one ability from the pool
  const baseAbilityName = abilityPool[Math.floor(Math.random() * abilityPool.length)];

  // Get rank modifier
  const rankModifier = RANK_EFFECT_MODIFIERS[rank];

  // Generate full ability name with rank prefix (for C+ ranks)
  const rankIndex = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'].indexOf(rank);
  const fullName = rankIndex >= 3 ? `${rankModifier.prefix} ${baseAbilityName}` : baseAbilityName;

  // Generate effect description
  const effectGenerator = ABILITY_EFFECTS[baseAbilityName];
  const effect = effectGenerator(rank, rankModifier.multiplier);

  // Generate flavor description based on class and ability
  const description = generateAbilityDescription(baseAbilityName, hunterClass, rank);

  return {
    name: fullName,
    description,
    effect,
  };
}

/**
 * Generates a flavor description for the ability
 */
function generateAbilityDescription(abilityName: string, hunterClass: HunterClass, rank: HunterRank): string {
  const descriptions: Record<string, string> = {
    // Fighter
    'Weapon Mastery': 'Years of training have honed this hunter\'s weapon skills to perfection.',
    'Combat Focus': 'Maintains unwavering focus in battle, spotting openings others would miss.',
    'Battle Hardened': 'Countless battles have toughened this hunter\'s body and resolve.',
    'Swift Strikes': 'Trained to strike with blinding speed, overwhelming foes with rapid attacks.',
    'Tactical Advantage': 'Excels at seizing the initiative and striking first.',
    'Relentless Assault': 'Builds momentum with each successful strike, becoming deadlier over time.',
    'Veteran Reflexes': 'Combat experience has sharpened reflexes to supernatural levels.',
    'Warrior\'s Pride': 'Refuses to fall, fighting hardest when pushed to the brink.',

    // Tank
    'Iron Wall': 'A steadfast defender whose armor and resolve are equally impenetrable.',
    'Bulwark': 'Trained to absorb and deflect incoming attacks with minimal damage.',
    'Guardian\'s Resolve': 'Strength doubles when protecting others from harm.',
    'Defensive Stance': 'Masters the art of defensive positioning and damage mitigation.',
    'Unbreakable': 'Physical fortitude allows shrugging off attacks that would fell lesser warriors.',
    'Fortress Mind': 'Mental discipline provides exceptional resistance to magical attacks.',
    'Shieldbearer': 'Shield techniques refined to an art form through dedicated practice.',
    'Immovable Object': 'Possesses the stance and strength to stand firm against any force.',

    // Mage
    'Magical Affinity': 'Natural talent for magic allows spells to flow with greater power.',
    'Spell Precision': 'Careful study ensures each spell hits its mark with deadly accuracy.',
    'Arcane Efficiency': 'Optimizes mana usage through superior magical understanding.',
    'Focus Mastery': 'Exceptional mental discipline enhances all magical abilities.',
    'Mana Conservation': 'Efficient mana circulation allows for extended spellcasting.',
    'Spell Amplification': 'Deep understanding of arcane theory amplifies spell potency.',
    'Tactical Caster': 'Quick thinking reduces time between successive spells.',
    'Arcane Insight': 'Intuitive grasp of magic reveals critical weaknesses in defenses.',

    // Healer
    'Healing Touch': 'Gentle hands and focused will make healing magic more effective.',
    'Recovery Boost': 'Specialized training in restorative magic enhances recovery rates.',
    'Blessed Presence': 'Calming aura promotes natural healing in nearby allies.',
    'Triage Expert': 'Emergency training allows efficient use of healing resources.',
    'Soothing Aura': 'Protective presence lessens the impact of attacks on the party.',
    'Medical Expertise': 'Extensive knowledge of ailments speeds recovery from status effects.',
    'Life Bond': 'Shares vitality with allies, strengthening the entire party.',
    'Restoration Mastery': 'Advanced healing techniques provide sustained recovery over time.',

    // Assassin
    'Shadow Step': 'Moves like a shadow, incredibly difficult to hit in combat.',
    'Critical Eye': 'Trained to identify and exploit vital weak points for devastating damage.',
    'Lethal Precision': 'Strikes with surgical precision, bypassing armor and defenses.',
    'Evasion': 'Lightning reflexes and agility make attacks difficult to land.',
    'Silent Movement': 'Moves with preternatural grace and speed.',
    'Vital Strike': 'Expert knowledge of anatomy reveals fatal vulnerabilities.',
    'Quick Reflexes': 'Often strikes before opponents can even react.',
    'Deadly Finisher': 'Excels at delivering the killing blow to weakened enemies.',

    // Ranger
    'Deadeye': 'Exceptional marksmanship makes every shot count.',
    'Quick Draw': 'Lightning-fast weapon handling allows rapid successive shots.',
    'Eagle Eye': 'Keen vision spots critical weak points from great distances.',
    'Marksman': 'Years of practice ensure accuracy even at extreme ranges.',
    'Survival Instinct': 'Natural awareness helps avoid danger in open combat.',
    'Long Range': 'Specialized training extends effective combat range.',
    'Steady Aim': 'Unwavering focus ensures shots land true despite evasion.',
    'Hunter\'s Focus': 'Patient, calculated shots from a stable position hit hardest.',

    // Support
    'Rallying Cry': 'Inspiring words and presence bolster allies\' offensive capabilities.',
    'Team Coordination': 'Natural leadership improves party cohesion and effectiveness.',
    'Morale Boost': 'Uplifting presence helps allies recover stamina and health.',
    'Strategic Mind': 'Tactical thinking enhances the party\'s decision-making.',
    'Encouraging Presence': 'Allies feel emboldened to take risks and strike decisively.',
    'Tactical Support': 'Coordinates party abilities for maximum efficiency.',
    'Inspiration': 'Leadership by example drives allies to fight harder.',
    'Squad Leader': 'Command experience makes the entire party more effective.',
  };

  return descriptions[abilityName] || 'A unique combat ability honed through experience.';
}
