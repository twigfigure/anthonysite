// Kingdom and Region Data for Guild Onboarding

export interface KingdomData {
  id: string;
  name: string;
  description: string;
  government: string;
  colorPalette: string;
  theme: string;
  regions: RegionData[];
}

export interface RegionData {
  id: string;
  name: string;
  description: string;
  terrain: string;
  difficulty: 'Beginner-Friendly' | 'Moderate' | 'Challenging';
}

export const KINGDOMS: KingdomData[] = [
  {
    id: 'northern-empire',
    name: 'Northern Empire',
    description: 'A militaristic autocracy forged in ice and iron. Citizens serve mandatory military service. Harsh but fair.',
    government: 'Militaristic Autocracy',
    colorPalette: 'Deep navy blues, silver, white, icy blues',
    theme: 'Cold, disciplined, military strength',
    regions: [
      {
        id: 'frostspire-peaks',
        name: 'Frostspire Peaks',
        description: 'Jagged mountains with eternal snow. Military fortresses guard the passes.',
        terrain: 'Mountains',
        difficulty: 'Challenging'
      },
      {
        id: 'glacial-wastes',
        name: 'Glacial Wastes',
        description: 'Frozen tundra containing ancient ruins and mysteries.',
        terrain: 'Tundra',
        difficulty: 'Challenging'
      },
      {
        id: 'tundra-borderlands',
        name: 'Tundra Borderlands',
        description: 'Contested territory with frequent skirmishes. Good training ground.',
        terrain: 'Border Region',
        difficulty: 'Moderate'
      }
    ]
  },
  {
    id: 'eastern-dynasty',
    name: 'Eastern Dynasty',
    description: 'An 800-year-old empire blending tradition and innovation. Honor, martial arts, and scholarly pursuits define this land.',
    government: 'Imperial Monarchy',
    colorPalette: 'Crimson reds, gold, black, jade greens',
    theme: 'Honor, tradition, cultivation',
    regions: [
      {
        id: 'crimson-highlands',
        name: 'Crimson Highlands',
        description: 'Rolling hills dotted with monasteries. Ideal for training disciples.',
        terrain: 'Highlands',
        difficulty: 'Beginner-Friendly'
      },
      {
        id: 'jade-river-valley',
        name: 'Jade River Valley',
        description: 'Fertile farmlands and peaceful villages. The empire\'s breadbasket.',
        terrain: 'River Valley',
        difficulty: 'Beginner-Friendly'
      },
      {
        id: 'shadow-mountains',
        name: 'Shadow Mountains',
        description: 'Misty peaks where rebels and hermits hide. Dangerous but rewarding.',
        terrain: 'Mountains',
        difficulty: 'Moderate'
      }
    ]
  },
  {
    id: 'western-kingdom',
    name: 'Western Kingdom',
    description: 'A feudal monarchy of knights and nobles. Chivalry, honor, and quests define this traditional kingdom.',
    government: 'Feudal Monarchy',
    colorPalette: 'Royal purples, gold, emerald greens, white',
    theme: 'Chivalry, nobility, quests',
    regions: [
      {
        id: 'emerald-heartlands',
        name: 'Emerald Heartlands',
        description: 'Lush fields and noble estates. Safe and prosperous.',
        terrain: 'Farmlands',
        difficulty: 'Beginner-Friendly'
      },
      {
        id: 'silverpine-forests',
        name: 'Silverpine Forests',
        description: 'Dense woodlands home to rangers and druids.',
        terrain: 'Forest',
        difficulty: 'Moderate'
      },
      {
        id: 'stormcoast',
        name: 'Stormcoast',
        description: 'Rocky coastline with ports and sea monsters.',
        terrain: 'Coastal',
        difficulty: 'Challenging'
      }
    ]
  },
  {
    id: 'southern-tribes',
    name: 'Southern Tribes',
    description: 'A confederation of tribal chiefdoms. Spiritual connection to the land and ancestors guides all.',
    government: 'Tribal Confederation',
    colorPalette: 'Warm oranges, deep browns, terracotta, bone white',
    theme: 'Spiritual, natural, ancestral',
    regions: [
      {
        id: 'scorched-badlands',
        name: 'Scorched Badlands',
        description: 'Desert wasteland with ancient ruins and sacred sites.',
        terrain: 'Desert',
        difficulty: 'Challenging'
      },
      {
        id: 'savanna-territories',
        name: 'Savanna Territories',
        description: 'Vast grasslands where tribes hunt and gather.',
        terrain: 'Savanna',
        difficulty: 'Moderate'
      },
      {
        id: 'red-rock-canyons',
        name: 'Red Rock Canyons',
        description: 'Maze of towering rock formations. Natural strongholds.',
        terrain: 'Canyons',
        difficulty: 'Moderate'
      }
    ]
  },
  {
    id: 'central-republic',
    name: 'Central Republic',
    description: 'A young industrial powerhouse built on innovation and trade. Power through wealth and progress.',
    government: 'Parliamentary Republic',
    colorPalette: 'Steel grays, brass, dark blues, burgundy',
    theme: 'Industrial, pragmatic, progressive',
    regions: [
      {
        id: 'irongate-district',
        name: 'Irongate District',
        description: 'Massive industrial cityscape. Urban hunting grounds.',
        terrain: 'Urban',
        difficulty: 'Moderate'
      },
      {
        id: 'trade-routes',
        name: 'Trade Routes',
        description: 'Network of roads connecting the republic to the world.',
        terrain: 'Roads & Highways',
        difficulty: 'Beginner-Friendly'
      },
      {
        id: 'coal-valleys',
        name: 'Coal Valleys',
        description: 'Mining region. Dangerous underground portals.',
        terrain: 'Mining Region',
        difficulty: 'Challenging'
      }
    ]
  },
  {
    id: 'mystic-enclave',
    name: 'Mystic Enclave',
    description: 'A magocracy ruled by archmages. Pursuit of forbidden knowledge above all. Only for experienced hunters.',
    government: 'Magocracy',
    colorPalette: 'Deep purples, midnight blues, silver, arcane cyan',
    theme: 'Mysterious, magical, scholarly',
    regions: [
      {
        id: 'aethermoor-heights',
        name: 'Aethermoor Heights',
        description: 'Floating islands suspended by magic. Arcane experiments everywhere.',
        terrain: 'Floating Islands',
        difficulty: 'Challenging'
      },
      {
        id: 'shadowfen',
        name: 'The Shadowfen',
        description: 'Mysterious swampland for dark magic research.',
        terrain: 'Swamp',
        difficulty: 'Challenging'
      },
      {
        id: 'runestone-wastes',
        name: 'Runestone Wastes',
        description: 'Scarred land from failed experiments. Extremely dangerous.',
        terrain: 'Wasteland',
        difficulty: 'Challenging'
      }
    ]
  }
];

export function getKingdomById(id: string): KingdomData | undefined {
  return KINGDOMS.find(k => k.id === id);
}

export function getRegionById(kingdomId: string, regionId: string): RegionData | undefined {
  const kingdom = getKingdomById(kingdomId);
  return kingdom?.regions.find(r => r.id === regionId);
}

// Name pools by kingdom for culturally appropriate hunter names
const KINGDOM_NAMES: Record<string, { first: string[], last: string[] }> = {
  'northern-empire': {
    first: ['Katya', 'Viktor', 'Anya', 'Dmitri', 'Sasha', 'Erik', 'Irina', 'Nikolai', 'Svetlana', 'Boris'],
    last: ['Volkov', 'Petrov', 'Sokolov', 'Kuznetsov', 'Ivanov', 'Frost', 'Storm', 'Iron', 'Steel', 'Winter']
  },
  'eastern-dynasty': {
    first: ['Li', 'Wei', 'Chen', 'Yuki', 'Sakura', 'Kenji', 'Mei', 'Takeshi', 'Hua', 'Ryu'],
    last: ['Zhang', 'Wang', 'Liu', 'Tanaka', 'Sato', 'Yang', 'Huang', 'Zhao', 'Suzuki', 'Wu']
  },
  'western-kingdom': {
    first: ['Edmund', 'Isabella', 'Roland', 'Elise', 'Arthur', 'Margaret', 'William', 'Eleanor', 'Richard', 'Victoria'],
    last: ['Lancaster', 'Sterling', 'Blackwood', 'Ashford', 'Thornton', 'Fairfax', 'Whitehall', 'Kingsley', 'Redford', 'Windsor']
  },
  'southern-tribes': {
    first: ['Zuri', 'Kwame', 'Nia', 'Thabo', 'Amara', 'Rashid', 'Makena', 'Jabari', 'Aisha', 'Kofi'],
    last: ['Okafor', 'Mwangi', 'Diallo', 'Khumalo', 'Nkosi', 'Tembo', 'Adeyemi', 'Kamau', 'Mensah', 'Banda']
  },
  'central-republic': {
    first: ['Viktor', 'Amira', 'Jackson', 'Leyla', 'Marcus', 'Sofia', 'Arjun', 'Emma', 'Chen', 'Isabella'],
    last: ['Steel', 'Brooks', 'Hayes', 'Rivera', 'Patel', 'Martinez', 'Anderson', 'Kim', 'Silva', 'Cohen']
  },
  'mystic-enclave': {
    first: ['Indra', 'Khalid', 'Soraya', 'Ravi', 'Zara', 'Akira', 'Nyx', 'Cyrus', 'Luna', 'Theron'],
    last: ['Shadowmere', 'Stormweaver', 'Voidcaller', 'Moonwhisper', 'Stargazer', 'Runehart', 'Spellborn', 'Nightshade', 'Arclight', 'Fateseeker']
  }
};

// Generate a random name appropriate for the kingdom
export function generateKingdomName(kingdomId: string): string {
  const namePool = KINGDOM_NAMES[kingdomId] || KINGDOM_NAMES['central-republic'];
  const firstName = namePool.first[Math.floor(Math.random() * namePool.first.length)];
  const lastName = namePool.last[Math.floor(Math.random() * namePool.last.length)];
  return `${firstName} ${lastName}`;
}
