// Portal Generation based on Kingdom and Region
import type { PortalDifficulty } from '../types';

export interface GeneratedPortal {
  id: string;
  name: string;
  difficulty: PortalDifficulty;
  worldLevel: number;
  isBoss: boolean;
  minLevel: number;
  recommendedHunters: number;
  timeMinutes: number;
  baseGold: number;
  baseExp: number;
  region: string;
}

// Portal locations for each region
const REGION_PORTAL_LOCATIONS: Record<string, string[]> = {
  // Northern Empire
  'frostspire-peaks': ['Crystal Mines', 'Avalanche Pass', 'Frozen Watchtowers', 'Icewolf Dens', 'Windshear Cliffs'],
  'glacial-wastes': ['Frozen Lake', 'Permafrost Catacombs', 'Blizzard Sanctum', 'Auroran Fields', 'Ancient Battlegrounds'],
  'tundra-borderlands': ['Border Forts', 'Thaw Marshes', 'Pine Barrens', 'Contested Valleys', 'Waystation Ruins'],

  // Eastern Dynasty
  'crimson-highlands': ['Vermillion Monastery', 'Dragon\'s Spine Ridge', 'Temple of Ten Thousand Steps', 'Scarlet Gorge', 'Meditation Peaks'],
  'jade-river-valley': ['Bamboo Forests', 'Rice Terrace Villages', 'Lotus Gardens', 'Jade Rapids', 'Ferry Crossing'],
  'shadow-mountains': ['Hidden Valleys', 'Mist Shrouded Peaks', 'Black Iron Mines', 'Hermit\'s Sanctuary', 'Abandoned Strongholds'],

  // Western Kingdom
  'emerald-heartlands': ['Rose Gardens', 'Knights\' Training Grounds', 'Noble Estates', 'Tournament Fields', 'Castle Garrison'],
  'silverpine-forests': ['Ancient Groves', 'Druid Circles', 'Woodcutter Camps', 'Beast Dens', 'Enchanted Glades'],
  'stormcoast': ['Shipwreck Coves', 'Lighthouse Keeps', 'Tidal Caves', 'Cliff Fortresses', 'Kraken\'s Maw'],

  // Southern Tribes
  'scorched-badlands': ['Sandstone Ruins', 'Oasis Camps', 'Bone Fields', 'Sacred Monoliths', 'Dust Devil Territories'],
  'savanna-territories': ['Watering Holes', 'Hunter\'s Grounds', 'Ancestral Burial Sites', 'Tribal Meeting Stones', 'Pride Lands'],
  'red-rock-canyons': ['Echo Caves', 'Sunfall Cliffs', 'War Paint Mesa', 'Natural Bridges', 'Sacred Petroglyphs'],

  // Central Republic
  'irongate-district': ['Factory Floors', 'Steam Works', 'Guild Halls', 'Railway Yards', 'Foundries'],
  'trade-routes': ['Caravan Stops', 'Border Markets', 'Checkpoint Stations', 'Merchant Camps', 'Bandit Crossroads'],
  'coal-valleys': ['Deep Mines', 'Coal Tunnels', 'Company Towns', 'Worker Camps', 'Slag Heaps'],

  // Mystic Enclave
  'aethermoor-heights': ['Spell Labs', 'Floating Libraries', 'Arcane Gardens', 'Crystal Spires', 'Ritual Grounds'],
  'shadowfen': ['Witch Huts', 'Necromancer\'s Isle', 'Alchemical Pools', 'Cursed Groves', 'Corpse Gardens'],
  'runestone-wastes': ['Reality Tears', 'Wild Magic Fields', 'Containment Circles', 'Dimensional Breaches', 'Anomaly Sites'],
};

export function generatePortalsForRegion(region: string, worldLevel: number): GeneratedPortal[] {
  const locations = REGION_PORTAL_LOCATIONS[region] || [];
  if (locations.length === 0) {
    // Fallback to generic portals if region not found
    return generateGenericPortals(worldLevel);
  }

  const portals: GeneratedPortal[] = [];
  const regionName = region.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Generate portals based on world level
  // WL 1: 3 easy portals
  if (worldLevel === 1) {
    for (let i = 0; i < Math.min(3, locations.length); i++) {
      portals.push({
        id: `${region}-wl1-${i}`,
        name: `${locations[i]} - ${regionName}`,
        difficulty: 'Blue',
        worldLevel: 1,
        isBoss: false,
        minLevel: 1,
        recommendedHunters: 1 + i,
        timeMinutes: 15 + i * 5,
        baseGold: 100 + i * 50,
        baseExp: 50 + i * 25,
        region
      });
    }

    // Add one boss portal
    portals.push({
      id: `${region}-wl1-boss`,
      name: `${locations[3] || 'Stronghold'} Guardian`,
      difficulty: 'Green',
      worldLevel: 1,
      isBoss: true,
      minLevel: 3,
      recommendedHunters: 3,
      timeMinutes: 45,
      baseGold: 500,
      baseExp: 300,
      region
    });
  }

  // WL 2-5: Scale difficulty and add more portals
  if (worldLevel >= 2 && worldLevel <= 5) {
    const numPortals = Math.min(2 + worldLevel, locations.length);
    const difficulties: PortalDifficulty[] = worldLevel === 2 ? ['Green', 'Yellow'] : worldLevel === 3 ? ['Yellow', 'Orange'] : worldLevel === 4 ? ['Orange', 'Red'] : ['Red', 'Purple'];

    for (let i = 0; i < numPortals - 1; i++) {
      const diffIndex = Math.min(i, difficulties.length - 1);
      portals.push({
        id: `${region}-wl${worldLevel}-${i}`,
        name: `${locations[i]} - ${regionName}`,
        difficulty: difficulties[diffIndex],
        worldLevel,
        isBoss: false,
        minLevel: worldLevel * 5 + i * 2,
        recommendedHunters: 2 + Math.floor(i / 2),
        timeMinutes: 20 + i * 5,
        baseGold: 200 * worldLevel + i * 100,
        baseExp: 100 * worldLevel + i * 50,
        region
      });
    }

    // Boss portal
    portals.push({
      id: `${region}-wl${worldLevel}-boss`,
      name: `${locations[numPortals - 1] || 'Ancient'} - Elite Challenge`,
      difficulty: worldLevel <= 3 ? 'Orange' : 'Red',
      worldLevel,
      isBoss: true,
      minLevel: worldLevel * 5 + 5,
      recommendedHunters: 4 + worldLevel,
      timeMinutes: 60,
      baseGold: 2000 * worldLevel,
      baseExp: 1000 * worldLevel,
      region
    });
  }

  // WL 6+: High-level content
  if (worldLevel >= 6) {
    const numPortals = Math.min(locations.length, 6);

    for (let i = 0; i < numPortals; i++) {
      const isHardcore = i >= numPortals - 2;
      portals.push({
        id: `${region}-wl${worldLevel}-${i}`,
        name: `${locations[i]} - ${regionName}`,
        difficulty: isHardcore ? 'Purple' : worldLevel >= 8 ? 'Red' : 'Orange',
        worldLevel,
        isBoss: isHardcore,
        minLevel: worldLevel * 5 + i * 3,
        recommendedHunters: 3 + i,
        timeMinutes: isHardcore ? 90 : 30 + i * 5,
        baseGold: (isHardcore ? 5000 : 500) * worldLevel,
        baseExp: (isHardcore ? 2500 : 250) * worldLevel,
        region
      });
    }
  }

  return portals;
}

function generateGenericPortals(worldLevel: number): GeneratedPortal[] {
  // Fallback generic portals
  const portals: GeneratedPortal[] = [];

  portals.push({
    id: `generic-wl${worldLevel}-1`,
    name: 'Unknown Portal',
    difficulty: worldLevel === 1 ? 'Blue' : worldLevel <= 3 ? 'Green' : 'Yellow',
    worldLevel,
    isBoss: false,
    minLevel: worldLevel * 5,
    recommendedHunters: 2,
    timeMinutes: 30,
    baseGold: 200 * worldLevel,
    baseExp: 100 * worldLevel,
    region: 'unknown'
  });

  return portals;
}
