import { supabase } from '@/lib/supabase';

export interface Kingdom {
  id: string;
  name: string;
  description: string;
  ruler: string;
  capital: string;
  culture: string;
  government: string;
}

export interface Region {
  id: string;
  kingdom_id: string;
  name: string;
  description: string;
  climate: string;
  terrain: string;
  key_features: string;
}

// Cache for worldbuilding data
let kingdomsCache: Kingdom[] | null = null;
let regionsCache: Region[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getKingdoms(forceRefresh = false): Promise<Kingdom[]> {
  const now = Date.now();

  if (!forceRefresh && kingdomsCache && (now - lastFetch) < CACHE_DURATION) {
    return kingdomsCache;
  }

  const { data, error } = await supabase
    .from('kingdoms')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching kingdoms:', error);
    return kingdomsCache || [];
  }

  kingdomsCache = data || [];
  lastFetch = now;
  return kingdomsCache;
}

export async function getRegions(forceRefresh = false): Promise<Region[]> {
  const now = Date.now();

  if (!forceRefresh && regionsCache && (now - lastFetch) < CACHE_DURATION) {
    return regionsCache;
  }

  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching regions:', error);
    return regionsCache || [];
  }

  regionsCache = data || [];
  return regionsCache;
}

export async function getRegionsByKingdom(kingdomId: string): Promise<Region[]> {
  const regions = await getRegions();
  return regions.filter(r => r.kingdom_id === kingdomId);
}

export async function getKingdomByRegion(regionName: string): Promise<Kingdom | null> {
  const regions = await getRegions();
  const region = regions.find(r => r.name === regionName);

  if (!region) return null;

  const kingdoms = await getKingdoms();
  return kingdoms.find(k => k.id === region.kingdom_id) || null;
}

export function clearCache() {
  kingdomsCache = null;
  regionsCache = null;
  lastFetch = 0;
}

// Helper function to get kingdom name from ID
export async function getKingdomNameById(kingdomId: string): Promise<string> {
  const kingdoms = await getKingdoms();
  const kingdom = kingdoms.find(k => k.id === kingdomId);
  return kingdom?.name || kingdomId; // Fallback to ID if not found
}

// Helper function to get region name from ID
export async function getRegionNameById(regionId: string): Promise<string> {
  const regions = await getRegions();
  const region = regions.find(r => r.id === regionId);
  return region?.name || regionId; // Fallback to ID if not found
}

// Helper function to get kingdom ID from region ID
export async function getKingdomIdByRegionId(regionId: string): Promise<string | null> {
  const regions = await getRegions();
  const region = regions.find(r => r.id === regionId);
  return region?.kingdom_id || null;
}
