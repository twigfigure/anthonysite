// Emotion-mon Prompt Generation System

interface EmotionStats {
  health: number;
  mood: number;
  energy: number;
  faith: number;
}

type RarityLevel = 'Normal' | 'Rare' | 'Epic' | 'Lord' | 'Mythic' | 'Constellation';

interface PromptResult {
  prompt: string;
  name: string;
  colorPalette: string;
  primaryTrait: string;
  rarity: RarityLevel;
  title?: string; // For Constellation rarity
}

// Roll for rarity based on defined odds
function rollRarity(): RarityLevel {
  const roll = Math.random() * 100; // 0-100

  if (roll < 60) return 'Normal';      // 60%
  if (roll < 81) return 'Rare';        // 21% (60 + 21 = 81)
  if (roll < 91) return 'Epic';        // 10% (81 + 10 = 91)
  if (roll < 96) return 'Lord';        // 5%  (91 + 5 = 96)
  if (roll < 99) return 'Mythic';      // 3%  (96 + 3 = 99)
  return 'Constellation';              // 1%  (99 + 1 = 100)
}

// Generate a unique title for Constellation rarity mons
function generateConstellationTitle(stats: EmotionStats): string {
  const { health, mood, energy, faith } = stats;

  const titles = [];

  // Faith-based titles
  if (faith > 80) titles.push('The Divine Oracle', 'Keeper of the Sacred Light', 'Herald of Eternity');
  else if (faith < 30) titles.push('The Fallen Star', 'Bearer of Shadows', 'Void Walker');

  // Energy-based titles
  if (energy > 80) titles.push('The Lightning Incarnate', 'Tempest Sovereign', 'Storm Bringer');
  else if (energy < 30) titles.push('The Silent Dreamer', 'Slumbering Ancient', 'The Dormant One');

  // Mood-based titles
  if (mood > 80) titles.push('The Radiant Joy', 'Beacon of Hope', 'The Eternal Smile');
  else if (mood < 30) titles.push('The Sorrowful Wraith', 'Harbinger of Despair', 'The Melancholic');

  // Health-based titles
  if (health > 80) titles.push('The Unbreakable', 'Eternal Guardian', 'The Indomitable');
  else if (health < 30) titles.push('The Fractured Soul', 'The Waning Light', 'Last Breath');

  // Combination titles
  if (energy > 70 && faith > 70) titles.push('The Celestial Fury', 'Divine Tempest', 'Angelic Warrior');
  if (mood < 30 && energy < 30) titles.push('The Forsaken One', 'Shadow of Emptiness', 'The Hollow');

  // Default titles
  titles.push('The Ancient One', 'Star Child', 'Cosmic Wanderer', 'Celestial Being');

  return titles[Math.floor(Math.random() * titles.length)];
}

// Keyword detection for contextual elements
const contextKeywords = {
  food: ['hungry', 'food', 'eat', 'starving', 'appetite', 'craving', 'feast'],
  weather: ['rain', 'rainy', 'storm', 'sunny', 'cloudy', 'snow', 'cold', 'hot'],
  indoor: ['house', 'home', 'inside', 'cozy', 'room', 'bed', 'indoors'],
  outdoor: ['outside', 'outdoors', 'nature', 'park', 'walk', 'hike'],
  tired: ['tired', 'exhausted', 'sleepy', 'lazy', 'rest', 'nap'],
  social: ['lonely', 'friends', 'people', 'alone', 'crowded', 'party'],
  work: ['work', 'busy', 'productive', 'deadline', 'project', 'stress'],
  calm: ['peaceful', 'calm', 'quiet', 'serene', 'tranquil', 'relaxed'],
  anxious: ['anxious', 'worried', 'nervous', 'stress', 'overwhelmed', 'panic'],
  happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'],
  sad: ['sad', 'down', 'depressed', 'upset', 'crying', 'hurt'],
  spiritual: ['pray', 'prayer', 'blessed', 'grateful', 'thankful', 'divine'],
};

// Generate creature type suggestions based on stats
function generateCreatureType(stats: EmotionStats): string {
  const { health, mood, energy, faith } = stats;
  const lowStats = [];

  if (health < 40) lowStats.push('health');
  if (mood < 40) lowStats.push('mood');
  if (energy < 40) lowStats.push('energy');
  if (faith < 40) lowStats.push('faith');

  // If multiple stats are low or any is very low, suggest predatory/dangerous creatures
  if (lowStats.length >= 2 || health < 30 || mood < 30 || energy < 30 || faith < 30) {
    const creatureTypes = [
      'dragon-like with scales and claws',
      'wolf or canine predator features',
      'serpent or snake-like qualities',
      'shark or aquatic predator traits',
      'bat or nocturnal creature aspects',
      'reptilian with sharp teeth',
      'feral beast characteristics',
      'dark creature with fangs or spines'
    ];
    return creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
  }

  // High stats get friendly creature suggestions
  if (health > 70 && mood > 70 && energy > 70) {
    return 'friendly blob, round pet, or gentle animal features';
  }

  // Default to neutral creature types
  return 'balanced creature design with simple features';
}

// Generate shape description based on stats
function generateShapeDescription(stats: EmotionStats): string {
  const { health, mood, energy, faith } = stats;

  // Determine primary and secondary shape characteristics
  const shapes: string[] = [];

  // Health affects overall body structure
  if (health > 80) {
    shapes.push('sturdy angular features');
  } else if (health > 60) {
    shapes.push('balanced proportions');
  } else if (health > 40) {
    shapes.push('soft irregular edges');
  } else if (health > 20) {
    shapes.push('wispy delicate forms, sharp defensive features');
  } else {
    shapes.push('fragile thin shapes, dangerous edges');
  }

  // Energy affects pointiness and dynamics
  if (energy > 80) {
    shapes.push('sharp dynamic spikes or points');
  } else if (energy > 60) {
    shapes.push('alert pointed features');
  } else if (energy > 40) {
    shapes.push('smooth flowing curves');
  } else if (energy > 20) {
    shapes.push('drooping soft edges, lurking posture');
  } else {
    shapes.push('flat low profile, coiled or crouched');
  }

  // Faith affects vertical proportions and ethereal features
  if (faith > 80) {
    shapes.push('floating ethereal wisps, vertical accents');
  } else if (faith > 60) {
    shapes.push('upward-reaching elements, light features');
  } else if (faith < 30) {
    shapes.push('grounded compact body, feral stance');
  }

  // Mood affects overall friendliness of shape
  if (mood > 80) {
    shapes.push('friendly rounded accents');
  } else if (mood < 30) {
    shapes.push('jagged irregular angles, aggressive silhouette');
  }

  return shapes.join(', ');
}

// Analyze stats and generate traits
function analyzeStats(stats: EmotionStats) {
  const { health, mood, energy, faith } = stats;

  const traits = {
    // Energy analysis
    energyLevel: energy > 80 ? 'very high' : energy > 60 ? 'high' : energy > 40 ? 'moderate' : energy > 20 ? 'low' : 'very low',
    energyDesc: energy > 80 ? 'vibrant, dynamic pose, bright glowing' :
                energy > 60 ? 'active, alert stance' :
                energy > 40 ? 'calm, steady posture' :
                energy > 20 ? 'tired, slouched' : 'exhausted, resting',

    // Faith analysis
    faithLevel: faith > 80 ? 'very high' : faith > 60 ? 'high' : faith > 40 ? 'moderate' : faith > 20 ? 'low' : 'very low',
    faithDesc: faith > 80 ? 'radiant holy aura, divine glow, peaceful expression' :
               faith > 60 ? 'gentle glow, serene face' :
               faith > 40 ? 'subtle light, contemplative' :
               faith > 20 ? 'dim, uncertain' : 'dark, questioning',

    // Health analysis
    healthLevel: health > 80 ? 'excellent' : health > 60 ? 'good' : health > 40 ? 'fair' : health > 20 ? 'poor' : 'critical',
    healthDesc: health > 80 ? 'strong, sturdy build, vibrant appearance' :
                health > 60 ? 'healthy, solid form' :
                health > 40 ? 'slightly weathered, minor cracks' :
                health > 20 ? 'weakened, fragile appearance' : 'injured, bandaged, struggling',

    // Mood analysis
    moodLevel: mood > 80 ? 'very happy' : mood > 60 ? 'content' : mood > 40 ? 'neutral' : mood > 20 ? 'sad' : 'very sad',
    moodDesc: mood > 80 ? 'big smile, joyful expression, sparkles' :
              mood > 60 ? 'gentle smile, pleasant face' :
              mood > 40 ? 'neutral expression, thoughtful' :
              mood > 20 ? 'frown, downturned eyes' : 'tears, very sad face',
  };

  return traits;
}

// Extract color hints from description text
function extractColorHints(description: string): string[] {
  const colorHints: string[] = [];
  const lowerDesc = description.toLowerCase();

  // Color keywords from emotions/contexts
  const colorKeywords = {
    red: ['angry', 'rage', 'passion', 'love', 'fire', 'hot', 'blood'],
    blue: ['sad', 'calm', 'ocean', 'water', 'cold', 'ice', 'sky'],
    green: ['nature', 'forest', 'envy', 'growth', 'peaceful', 'garden'],
    purple: ['mystery', 'magic', 'dream', 'twilight', 'royal'],
    yellow: ['happy', 'sunny', 'bright', 'joy', 'gold', 'warm'],
    orange: ['excited', 'energetic', 'autumn', 'cozy', 'fire'],
    pink: ['gentle', 'soft', 'sweet', 'tender', 'blush'],
    gray: ['empty', 'void', 'numb', 'foggy', 'cloudy', 'dull'],
    black: ['dark', 'shadow', 'night', 'void', 'empty', 'hollow'],
    white: ['pure', 'clean', 'holy', 'light', 'heaven', 'peace'],
    brown: ['earthy', 'grounded', 'stable', 'comfortable', 'safe'],
  };

  for (const [color, keywords] of Object.entries(colorKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      colorHints.push(color);
    }
  }

  return colorHints;
}

// Generate color palette based on stats and description
function generateColorPalette(stats: EmotionStats, description: string = ''): string {
  const { health, mood, energy, faith } = stats;
  const colorHints = extractColorHints(description);

  // Color palette pools for different stat combinations
  const palettes: string[] = [];

  // === FAITH-BASED COLORS ===
  if (faith > 80) {
    palettes.push(
      'soft blues, holy whites, gentle gold, angelic',
      'radiant white, celestial blue, divine silver',
      'pale gold, heavenly white, soft pink glow',
      'ethereal lavender, pure white, gentle gold accents'
    );
  } else if (faith > 60) {
    palettes.push(
      'light blue, cream, soft gold highlights',
      'pearl white, gentle cyan, subtle silver',
      'pale yellow, soft white, light blue tones'
    );
  } else if (faith < 30) {
    palettes.push(
      'dark gray, deep purple, shadowy black',
      'charcoal, muted burgundy, dark slate',
      'midnight blue, ashen gray, dim purple'
    );
  }

  // === ENERGY-BASED COLORS ===
  if (energy > 80) {
    palettes.push(
      'electric yellow, vibrant orange, bright red',
      'neon green, hot pink, blazing orange',
      'brilliant white, golden yellow, fiery red',
      'lime green, electric blue, vivid magenta'
    );
  } else if (energy > 60) {
    palettes.push(
      'bright yellow, warm orange, energetic red',
      'sunny gold, coral pink, light orange',
      'cheerful green, amber, bright cyan'
    );
  } else if (energy < 30) {
    palettes.push(
      'dull gray, faded blue, washed out brown',
      'muted olive, dusty gray, pale taupe',
      'tired beige, worn gray, dim earth tones',
      'slate gray, faded purple, dusty blue'
    );
  }

  // === MOOD-BASED COLORS ===
  if (mood > 80) {
    palettes.push(
      'vibrant rainbow, cheerful pastels, bright accents',
      'happy pink, sunny yellow, sky blue',
      'coral, peach, soft gold, gentle cyan',
      'bright lavender, warm orange, cheerful green'
    );
  } else if (mood > 60) {
    palettes.push(
      'warm oranges, soft yellows, cozy browns',
      'gentle pink, cream, light coral',
      'pastel blue, soft peach, pale yellow'
    );
  } else if (mood < 30) {
    palettes.push(
      'deep blue-gray, muted purple, dark tones',
      'stormy blue, slate gray, shadowy indigo',
      'somber navy, charcoal, deep teal',
      'midnight purple, dark gray, moody blue',
      'cold steel, deep indigo, ashen gray'
    );
  } else if (mood < 50) {
    palettes.push(
      'cool blues, gray tones, subdued colors',
      'muted teal, soft gray, pale blue',
      'dusty lavender, medium gray, cool beige'
    );
  }

  // === HEALTH-BASED COLORS ===
  if (health > 80) {
    palettes.push(
      'vibrant green, rich brown, earthy gold',
      'strong red, healthy pink, robust orange',
      'lively emerald, solid brown, bright cream'
    );
  } else if (health < 40) {
    palettes.push(
      'sickly green, pale colors, faded tones',
      'pallid yellow, weak gray, washed out beige',
      'ashen green, faded brown, weak cream',
      'toxic green, bruised purple, sallow yellow'
    );
  } else if (health < 20) {
    palettes.push(
      'bruised purple, sickly yellow, faded black',
      'diseased green, rotting brown, pale death gray',
      'poisonous green, necrotic purple, deathly pale'
    );
  }

  // === SPECIAL COMBINATIONS ===
  // High energy + high faith (divine power)
  if (energy > 80 && faith > 80) {
    palettes.push(
      'bright golden yellow, warm orange, holy white glow',
      'radiant gold, blazing white, celestial orange',
      'divine yellow, pure white, heavenly gold fire'
    );
  }

  // Low everything (depression/darkness)
  if (mood < 30 && energy < 30 && health < 40) {
    palettes.push(
      'pitch black, deep charcoal, shadowy gray',
      'abyssal blue, void black, death gray',
      'hollow gray, empty black, cold dark blue',
      'desolate purple, bleak gray, forsaken black'
    );
  }

  // Low stats for predatory creatures
  if (mood < 40 && (energy < 40 || health < 40)) {
    palettes.push(
      'blood red, shadow black, predator orange',
      'feral brown, hunter green, dangerous red',
      'venomous purple, deadly black, warning yellow',
      'predatory gray, savage red, dark hunter green',
      'shark gray, ocean blue, white teeth accents'
    );
  }

  // === DESCRIPTION-BASED COLOR INFLUENCES ===
  if (colorHints.length > 0) {
    // Randomly pick 1-2 color hints to incorporate
    const selectedHints = colorHints.slice(0, Math.floor(Math.random() * 2) + 1);

    for (const hint of selectedHints) {
      if (hint === 'red') {
        palettes.push(
          'crimson red, deep burgundy, rose accents',
          'scarlet, ruby red, warm pink highlights'
        );
      } else if (hint === 'blue') {
        palettes.push(
          'ocean blue, cyan, deep navy tones',
          'sapphire blue, aqua, twilight indigo'
        );
      } else if (hint === 'green') {
        palettes.push(
          'forest green, moss, emerald accents',
          'jade green, lime, natural earth greens'
        );
      } else if (hint === 'purple') {
        palettes.push(
          'royal purple, violet, lavender highlights',
          'amethyst, deep plum, mystic purple'
        );
      } else if (hint === 'black') {
        palettes.push(
          'obsidian black, charcoal, midnight accents',
          'raven black, shadow gray, dark void'
        );
      }
    }
  }

  // === DEFAULT BALANCED PALETTES ===
  if (palettes.length === 0 || Math.random() < 0.2) {
    // 20% chance to use default even with other options (adds variety)
    palettes.push(
      'balanced earth tones, natural greens, warm browns',
      'neutral beige, soft gray, gentle brown',
      'medium blue, warm tan, soft green',
      'terracotta, sage green, sandy beige'
    );
  }

  // Randomly select one palette from the accumulated options
  return palettes[Math.floor(Math.random() * palettes.length)];
}

// Extract context from description
function extractContext(description: string): string[] {
  const foundContexts: string[] = [];
  const lowerDesc = description.toLowerCase();

  for (const [context, keywords] of Object.entries(contextKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      foundContexts.push(context);
    }
  }

  return foundContexts;
}

// Generate contextual elements for prompt
function generateContextualElements(contexts: string[]): string {
  const elements: string[] = [];

  if (contexts.includes('food')) {
    elements.push('holding or surrounded by food items, dreamy food bubbles');
  }
  if (contexts.includes('weather')) {
    elements.push('weather elements like raindrops or sun rays');
  }
  if (contexts.includes('indoor') || contexts.includes('tired')) {
    elements.push('cozy, comfortable, relaxed pose');
  }
  if (contexts.includes('outdoor')) {
    elements.push('nature elements, leaves, flowers');
  }
  if (contexts.includes('social') || contexts.includes('anxious')) {
    elements.push('expressive body language');
  }
  if (contexts.includes('spiritual')) {
    elements.push('prayer hands, divine symbols, holy motifs');
  }

  return elements.length > 0 ? elements.join(', ') : 'simple, clean design';
}

// Generate creature name - single word, creature-like
function generateCreatureName(stats: EmotionStats, contexts: string[]): string {
  const { health, mood, energy, faith } = stats;

  // Prefixes based on stats and contexts
  const prefixes = [];

  // Faith-based prefixes (celestial/ethereal)
  if (faith > 80) prefixes.push('Lumi', 'Astra', 'Auri', 'Seren', 'Celest');
  else if (faith > 60) prefixes.push('Nim', 'Opal', 'Crys', 'Pris');
  else if (faith < 30) prefixes.push('Echo', 'Umbra', 'Nyx', 'Obsid');

  // Energy-based prefixes (motion/elements)
  if (energy > 80) prefixes.push('Zeph', 'Flux', 'Volta', 'Vivi', 'Kinet', 'Aero');
  else if (energy > 60) prefixes.push('Curr', 'Ripple', 'Breez', 'Eddy');
  else if (energy < 30) prefixes.push('Lull', 'Moss', 'Dew', 'Lichen', 'Fern');

  // Mood-based prefixes (colors/textures/nature)
  if (mood > 80) prefixes.push('Coral', 'Amber', 'Sol', 'Citri', 'Saffr', 'Iris');
  else if (mood > 60) prefixes.push('Opal', 'Pearl', 'Cream', 'Honey');
  else if (mood < 30) prefixes.push('Ash', 'Slate', 'Ind', 'Nebul', 'Graphi');
  else if (mood < 50) prefixes.push('Mist', 'Fog', 'Cirrus', 'Haze');

  // Health-based prefixes (materials/geology)
  if (health > 80) prefixes.push('Quartz', 'Onyx', 'Gran', 'Basalt', 'Marble');
  else if (health < 30) prefixes.push('Wisp', 'Petal', 'Silk', 'Gossam', 'Thistl');

  // Context-based prefixes (more abstract)
  if (contexts.includes('food')) prefixes.push('Morsel', 'Crum', 'Berry', 'Acorn');
  if (contexts.includes('tired')) prefixes.push('Lull', 'Velv', 'Plush');
  if (contexts.includes('weather')) prefixes.push('Nimb', 'Cirr', 'Stratus', 'Cumul');
  if (contexts.includes('spiritual')) prefixes.push('Psalm', 'Vesper', 'Chant');
  if (contexts.includes('anxious')) prefixes.push('Quiver', 'Flicker', 'Spark');
  if (contexts.includes('happy')) prefixes.push('Trill', 'Chime', 'Lark');

  // Suffixes that make creature-like names
  const suffixes = [
    'ax', 'ix', 'ox', 'ex', 'ux',
    'or', 'ar', 'er', 'ir',
    'on', 'an', 'en', 'in',
    'el', 'al', 'il', 'ol',
    'yx', 'yx',
    'us', 'is', 'os', 'as',
    'wing', 'tail', 'paw', 'claw',
    'ling', 'let', 'kin', 'bit',
    'ith', 'ath', 'eth', 'oth',
    'ara', 'ora', 'ira', 'uma',
    'eon', 'ion', 'aon',
  ];

  // Pick prefix based on dominant stat
  let prefix;
  if (prefixes.length === 0) {
    // Fallback if no conditions match
    prefix = ['Crea', 'Bein', 'Spir', 'Enti'][Math.floor(Math.random() * 4)];
  } else {
    prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  // Pick suffix - prefer certain ones based on stats
  let suffix;
  if (faith > 70) {
    suffix = ['or', 'on', 'ara', 'el', 'eon'][Math.floor(Math.random() * 5)];
  } else if (energy > 70) {
    suffix = ['ix', 'ax', 'wing', 'yx', 'ex'][Math.floor(Math.random() * 5)];
  } else if (mood < 30) {
    suffix = ['oth', 'eth', 'us', 'um', 'en'][Math.floor(Math.random() * 5)];
  } else if (health < 30) {
    suffix = ['ling', 'let', 'kin', 'it', 'el'][Math.floor(Math.random() * 5)];
  } else {
    suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  // Combine prefix and suffix
  return prefix + suffix;
}

// Main prompt generation function
export function generateEmotionMonPrompt(
  stats: EmotionStats,
  description: string = '',
  forcedRarity?: RarityLevel
): PromptResult {
  const traits = analyzeStats(stats);
  const contexts = extractContext(description);
  const contextualElements = generateContextualElements(contexts);
  const name = generateCreatureName(stats, contexts);
  const shapeDescription = generateShapeDescription(stats);
  const creatureType = generateCreatureType(stats);

  // Roll for rarity or use forced rarity for testing
  const rarity = forcedRarity || rollRarity();

  // Generate color palettes based on rarity
  let colorPalette: string;
  if (rarity === 'Normal') {
    colorPalette = generateColorPalette(stats, description);
  } else if (rarity === 'Rare') {
    const palette1 = generateColorPalette(stats, description);
    const palette2 = generateColorPalette(stats, description);
    colorPalette = `Primary: ${palette1} | Secondary: ${palette2}`;
  } else {
    // Epic, Lord, Mythic, Constellation all use 3 palettes
    const palette1 = generateColorPalette(stats, description);
    const palette2 = generateColorPalette(stats, description);
    const palette3 = generateColorPalette(stats, description);
    colorPalette = `Primary: ${palette1} | Secondary: ${palette2} | Accent: ${palette3}`;
  }

  // Determine background based on rarity
  let background: string;
  if (rarity === 'Lord') {
    background = 'PURPLE BACKGROUND (#8B5CF6), rich royal purple, no transparency, no gradients';
  } else if (rarity === 'Mythic') {
    background = 'GOLD BACKGROUND (#FFD700), radiant golden yellow, no transparency, no gradients';
  } else if (rarity === 'Constellation') {
    background = 'BRIGHT HOLOGRAPHIC BACKGROUND with VIVID iridescent rainbow shimmer (vibrant cyan, magenta, yellow shifts), cosmic sparkles, prismatic light effects, HIGHLY SATURATED colors, luminous glow, NO opaque layers, NO desaturation, PURE vibrant holographic effect';
  } else {
    background = 'PURE WHITE BACKGROUND (#FFFFFF), completely white, no transparency, no gradients';
  }

  // Build rarity-specific features
  let rarityFeatures = '';
  if (rarity === 'Epic' || rarity === 'Lord' || rarity === 'Mythic') {
    rarityFeatures += '- GLOWING AURA surrounding the creature, radiant energy, mystical glow\n';
  }
  if (rarity === 'Constellation') {
    rarityFeatures += '- SUBTLE GLOWING AURA close to the creature body, thin radiant outline, does NOT obscure or cover the background, translucent edge glow only\n';
  }
  if (rarity === 'Lord' || rarity === 'Mythic' || rarity === 'Constellation') {
    rarityFeatures += '- ORNATE ARMOR pieces, decorative plating, royal guard aesthetic\n';
  }
  if (rarity === 'Mythic' || rarity === 'Constellation') {
    // Generate random weapon type for variety
    const weaponTypes = [
      'LEGENDARY SWORD with ornate blade and decorative hilt',
      'LEGENDARY AXE with double-headed blade and intricate handle',
      'LEGENDARY MACE with spiked head and royal design',
      'LEGENDARY SPEAR with decorative tip and ceremonial shaft',
      'LEGENDARY BOW with elegant curves and mystical string',
      'LEGENDARY STAFF with magical orb or crystal top',
      'LEGENDARY WAND with glowing tip and runic engravings',
      'LEGENDARY TOME or magical book radiating power',
      'LEGENDARY HAMMER with massive ornate head',
      'LEGENDARY SCYTHE with curved blade and ritual decorations',
      'LEGENDARY DAGGERS paired blades with mystical glow',
      'LEGENDARY LANCE with pointed tip and noble banners'
    ];
    const selectedWeapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    rarityFeatures += `- ${selectedWeapon} held or equipped by the creature\n`;
  }

  // Generate constellation title if needed
  const title = rarity === 'Constellation' ? generateConstellationTitle(stats) : undefined;

  // Build rarity descriptor for style (not to be rendered as text)
  let rarityStyleDesc = '';
  if (rarity === 'Rare') {
    rarityStyleDesc = 'Enhanced details, more intricate design.';
  } else if (rarity === 'Epic') {
    rarityStyleDesc = 'Highly detailed, visually striking, impressive presence.';
  } else if (rarity === 'Lord') {
    rarityStyleDesc = 'Majestic, commanding presence, royal quality.';
  } else if (rarity === 'Mythic') {
    rarityStyleDesc = 'Legendary appearance, awe-inspiring, masterwork quality.';
  } else if (rarity === 'Constellation') {
    rarityStyleDesc = 'Divine, celestial being, transcendent quality, otherworldly magnificence.';
  }

  // Build the prompt
  const prompt = `
Create a 16-bit pixel art creature in retro RPG sprite style with clean pixel art lines and vibrant shading.
Character design shown from front-facing view. ${rarityStyleDesc}

This is a ${creatureType.toLowerCase()} type creature.

Physical appearance:
Build - ${traits.healthDesc}
Expression - ${traits.moodDesc}
Posture - ${traits.energyDesc}
Energy field - ${traits.faithDesc}

Shape design: ${shapeDescription}

Color scheme: ${colorPalette}

Environmental elements: ${contextualElements}

${rarityFeatures ? `Special visual features:\n${rarityFeatures}` : ''}
Art style: Clean pixel art at 64x64 sprite resolution, reminiscent of Pokemon, Final Fantasy, and Earthbound.
Friendly character design with clear silhouette and professional game sprite quality.

Visual guidelines:
Creature or monster design similar to Kirby, Totoro, blob creatures, or animal-like beings.
Avoid human-like proportions, humanoid bodies, mummy wrappings, or overly human silhouettes.
Simple cute forms encouraged such as chibi bodies, round shapes, and chubby designs.
Can have limbs and stand upright but must look distinctly creature-like, not human-like.

Background setting: ${background}
${rarity === 'Constellation' ? 'IMPORTANT: The holographic background must remain FULLY VISIBLE and VIBRANT throughout the entire image. Any auras or glows should be minimal and should NOT create opaque layers or desaturate the background.' : ''}

Technical specifications: Sharp pixels with no blur, solid colors with dithering for shading effects.

Critical requirement: Do not include any text, letters, words, numbers, or typography in the image.
The background color must be exactly as specified above.
`.trim();

  // Determine primary trait
  const maxStat = Math.max(stats.health, stats.mood, stats.energy, stats.faith);
  let primaryTrait = 'Balanced';
  if (maxStat === stats.faith && stats.faith > 70) primaryTrait = 'Divine';
  else if (maxStat === stats.energy && stats.energy > 70) primaryTrait = 'Energetic';
  else if (maxStat === stats.mood && stats.mood > 70) primaryTrait = 'Joyful';
  else if (maxStat === stats.health && stats.health > 70) primaryTrait = 'Robust';

  return {
    prompt,
    name,
    colorPalette,
    primaryTrait,
    rarity,
    title,
  };
}

// Export the RarityLevel type for use in other files
export type { RarityLevel };

// Example usage:
// const result = generateEmotionMonPrompt(
//   { health: 80, mood: 60, energy: 100, faith: 100 },
//   "I am so hungry, but too lazy to leave the house because it is raining today."
// );
// console.log(result.name); // Single-word name like "Luminix", "Blazeon", "Coziling"
// console.log(result.prompt); // Full AI prompt
