// Hunter Image Prompt Generation for Gemini API
import type { HunterRank, HunterClass } from '../types';

interface HunterPromptParams {
  name: string;
  rank: HunterRank;
  hunterClass: HunterClass;
}

// Color palettes based on kingdom/region/culture
export const REGION_PALETTES = {
  'Northern Empire': {
    name: 'Northern Empire',
    colors: 'deep navy blues, silver, white, and icy blues',
    theme: 'cold, regal, disciplined military aesthetic',
  },
  'Eastern Dynasty': {
    name: 'Eastern Dynasty',
    colors: 'crimson reds, gold, black, and jade greens',
    theme: 'elegant, traditional, honor-bound warrior aesthetic',
  },
  'Western Kingdom': {
    name: 'Western Kingdom',
    colors: 'royal purples, gold, emerald greens, and white',
    theme: 'noble, chivalrous, classic knight aesthetic',
  },
  'Southern Tribes': {
    name: 'Southern Tribes',
    colors: 'warm oranges, deep browns, terracotta, and bone white',
    theme: 'tribal, natural, primal warrior aesthetic',
  },
  'Central Republic': {
    name: 'Central Republic',
    colors: 'steel grays, brass, dark blues, and burgundy',
    theme: 'industrial, pragmatic, soldier aesthetic',
  },
  'Mystic Enclave': {
    name: 'Mystic Enclave',
    colors: 'deep purples, midnight blues, silver, and arcane cyan',
    theme: 'mysterious, magical, scholarly aesthetic',
  },
} as const;

export type RegionName = keyof typeof REGION_PALETTES;

// Helper to get a random region
export function getRandomRegion(): RegionName {
  const regions = Object.keys(REGION_PALETTES) as RegionName[];
  return regions[Math.floor(Math.random() * regions.length)];
}

// Helper to randomly determine gender
export function getRandomGender(): 'Male' | 'Female' {
  return Math.random() < 0.5 ? 'Male' : 'Female';
}

// Visual themes based on rank
const RANK_THEMES: Record<HunterRank, string> = {
  F: 'worn and practical gear, simple design',
  E: 'basic adventurer equipment, modest appearance',
  D: 'improved gear with some detail, competent look',
  C: 'well-crafted equipment, professional appearance',
  B: 'ornate armor with decorative elements, distinguished look',
  A: 'elegant and refined gear with magical accents, prestigious appearance',
  S: 'legendary equipment with glowing effects, heroic presence',
  SS: 'mythical armor with intricate details and powerful aura, legendary status',
  SSS: 'transcendent equipment radiating divine energy, god-like appearance',
};

// Class-specific appearance details
const CLASS_APPEARANCES: Record<HunterClass, string> = {
  Fighter: 'balanced armor and weapons, versatile warrior stance, sword or dual weapons',
  Tank: 'heavy plate armor, large shield, imposing and protective stance',
  Mage: 'flowing robes or light armor, staff or wand, mystical aura and magical energy',
  Healer: 'elegant robes with holy symbols, gentle expression, healing light or nature magic',
  Assassin: 'sleek leather armor, dual daggers or hidden blades, shadowy and agile pose',
  Ranger: 'light armor with cloak, bow and quiver, nature-themed elements',
  Support: 'practical robes with utility gear, supportive stance, enchantment effects',
};

// Class-specific action poses for splash art
const CLASS_ACTION_POSES: Record<HunterClass, string> = {
  Fighter: 'dynamic combat stance with weapon ready to strike',
  Tank: 'defensive stance with shield raised, protecting allies',
  Mage: 'casting a powerful spell with magical energy swirling around them',
  Healer: 'channeling healing magic with gentle radiant light',
  Assassin: 'poised to strike from shadows, blades drawn',
  Ranger: 'drawing bow with arrow nocked, focused aim',
  Support: 'casting enhancement magic with supportive aura',
};

// Visual effects based on rank
const RANK_EFFECTS: Record<HunterRank, string> = {
  F: 'minimal magical effects',
  E: 'subtle energy wisps',
  D: 'faint magical glow',
  C: 'moderate magical aura',
  B: 'strong magical effects and energy',
  A: 'intense magical power with glowing elements',
  S: 'legendary aura with brilliant light effects',
  SS: 'mythical power radiating from character with intense effects',
  SSS: 'transcendent divine energy, god-like power emanating from entire figure',
};

// Background gradients based on rank (matching UI display)
const RANK_BACKGROUNDS: Record<HunterRank, string> = {
  F: 'dark gray gradient background (from gray to darker gray)',
  E: 'dark stone gradient background (from stone gray to slate)',
  D: 'gray gradient background (from slate to zinc)',
  C: 'green gradient background (from vibrant green to teal)',
  B: 'blue gradient background (from bright blue to cyan)',
  A: 'purple gradient background (from deep purple to blue)',
  S: 'golden gradient background (from bright yellow to orange)',
  SS: 'vibrant pink-purple gradient background (from purple to pink to red)',
  SSS: 'holographic galactic background with cosmic nebula effects, deep space purples, blues, and magentas with shimmering starlight, iridescent holographic shimmer overlays creating a transcendent divine atmosphere',
};

// Generate unified prompt for both avatar and splash art in one image
export function generateHunterCombinedPrompt(params: HunterPromptParams, region?: RegionName, gender?: 'Male' | 'Female'): string {
  const { name, rank, hunterClass } = params;

  // If no region specified, pick a random one
  const selectedRegion = region || getRandomRegion();
  const regionData = REGION_PALETTES[selectedRegion];

  // If no gender specified, pick a random one
  const selectedGender = gender || getRandomGender();

  const palette = regionData.colors;
  const culturalTheme = regionData.theme;
  const rankTheme = RANK_THEMES[rank];
  const appearance = CLASS_APPEARANCES[hunterClass];
  const actionPose = CLASS_ACTION_POSES[hunterClass];
  const effects = RANK_EFFECTS[rank];
  const backgroundGradient = RANK_BACKGROUNDS[rank];

  return `Create a dual-view character sheet for ${name}, a ${selectedGender} ${rank}-rank ${hunterClass} hunter. This image must contain TWO distinct views of the SAME character side-by-side.

CRITICAL LAYOUT REQUIREMENTS:
- Create a WIDE horizontal image (landscape orientation, 2:1 ratio ideal)
- Split the image EXACTLY down the middle into two equal halves
- LEFT HALF (50% of total width): Portrait/Avatar view ONLY - character must fit entirely within this left half
- RIGHT HALF (50% of total width): Full-body splash art ONLY - character must fit entirely within this right half
- Both views show the EXACT SAME CHARACTER with identical features, outfit, and design
- BACKGROUND: ${backgroundGradient} - MUST fill the ENTIRE canvas from edge to edge, top to bottom
- The gradient background MUST extend to ALL FOUR EDGES of the image canvas
- Background should be behind the character, filling every pixel of the image
- The gradient should be smooth, professional, and NEVER have black bars or cutoffs
- Clear vertical line dividing the two halves at the exact center
- The character design MUST be consistent between both sides
- IMPORTANT: Each character must stay COMPLETELY within their respective half - no overlap across the center line

STYLE: Korean manhwa-inspired digital art, premium game character reveal quality

LEFT HALF - PORTRAIT/AVATAR (EXACTLY 50% of image width):
- Portrait MUST fit entirely within the LEFT 50% of the image
- Neck-up close portrait (head and shoulders only)
- Character facing slightly to the side (3/4 view)
- Detailed facial features with determined expression
- Show helmet/headgear and upper armor/clothing details
- Sharp focus on face and character identity
- Dramatic portrait lighting
- Keep all parts of the portrait within the left boundary

RIGHT HALF - SPLASH ART (EXACTLY 50% of image width):
- Full body MUST fit entirely within the RIGHT 50% of the image
- Full body character in epic action pose
- ${actionPose}
- Show complete equipment and weapons
- Dynamic perspective and dramatic angle
- Battle-ready heroic composition
- Keep all parts of the character within the right boundary

CHARACTER DESIGN (MUST BE IDENTICAL ON BOTH SIDES):
- ${appearance}
- Equipment quality: ${rankTheme}
- Cultural style: ${culturalTheme}
- Color palette: ${palette}
- Equipment and clothing match ${hunterClass} class and ${selectedRegion} cultural aesthetic
- Same facial features, hair style, and distinctive elements on both sides
- Visual design should reflect origin from ${selectedRegion}

VISUAL EFFECTS:
- ${effects}
- Magical or elemental effects matching ${hunterClass} abilities
- Energy particles or aura (especially on right side)
- Consistent lighting and color scheme across both views

QUALITY REQUIREMENTS:
- Ultra-high quality professional illustration
- Sharp details and clean lines throughout
- Seamless character consistency between both views
- Transparent background is MANDATORY
- No background elements, only the character
- Clear visual distinction between portrait and full-body sections

This dual-view must showcase the same ${rank}-rank ${hunterClass} hunter from both portrait and action perspectives, maintaining perfect character consistency.`;
}
