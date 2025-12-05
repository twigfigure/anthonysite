// Source configuration for all supported manga/manhua sites

export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  searchUrl: (query: string) => string;
  enabled: boolean;
  hasApi?: boolean; // If true, uses API instead of scraping
  color: string; // For UI badge
}

export const SOURCES: SourceConfig[] = [
  {
    id: 'asuracomic',
    name: 'AsuraComic',
    baseUrl: 'https://asuracomic.net',
    searchUrl: (q) => `https://asuracomic.net/series?name=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'mangadex',
    name: 'MangaDex',
    baseUrl: 'https://mangadex.org',
    searchUrl: (q) => `https://api.mangadex.org/manga?title=${encodeURIComponent(q)}&limit=15&includes[]=cover_art`,
    enabled: true,
    hasApi: true,
    color: 'bg-orange-500/20 text-orange-400',
  },
  {
    id: 'toongod',
    name: 'ToonGod',
    baseUrl: 'https://www.toongod.org',
    searchUrl: (q) => `https://www.toongod.org/?s=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'webtoons',
    name: 'Webtoons',
    baseUrl: 'https://www.webtoons.com',
    searchUrl: (q) => `https://www.webtoons.com/en/search?keyword=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-green-500/20 text-green-400',
  },
  {
    id: 'manhwatop',
    name: 'ManhwaTop',
    baseUrl: 'https://manhwatop.com',
    searchUrl: (q) => `https://manhwatop.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-red-500/20 text-red-400',
  },
  {
    id: 'manhwaclan',
    name: 'ManhwaClan',
    baseUrl: 'https://manhwaclan.com',
    searchUrl: (q) => `https://manhwaclan.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  {
    id: 'flamescans',
    name: 'FlameScans',
    baseUrl: 'https://flamescans.lol',
    searchUrl: (q) => `https://flamescans.lol/?s=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-orange-600/20 text-orange-500',
  },
  {
    id: 'roliascan',
    name: 'RoliaScan',
    baseUrl: 'https://roliascan.com',
    searchUrl: (q) => `https://roliascan.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-pink-500/20 text-pink-400',
  },
  {
    id: 'kunmanga',
    name: 'KunManga',
    baseUrl: 'https://kunmanga.com',
    searchUrl: (q) => `https://kunmanga.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    id: 'manhuaus',
    name: 'ManhuaUS',
    baseUrl: 'https://manhuaus.com',
    searchUrl: (q) => `https://manhuaus.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    id: 'manhuafast',
    name: 'ManhuaFast',
    baseUrl: 'https://manhuafast.net',
    searchUrl: (q) => `https://manhuafast.net/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-teal-500/20 text-teal-400',
  },
  {
    id: 'mangaforest',
    name: 'MangaForest',
    baseUrl: 'https://mangaforest.com',
    searchUrl: (q) => `https://mangaforest.com/search?q=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'demonicscans',
    name: 'DemonicScans',
    baseUrl: 'https://demonicscans.org',
    searchUrl: (q) => `https://demonicscans.org/?s=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-red-600/20 text-red-500',
  },
  {
    id: 'mgeko',
    name: 'Mgeko',
    baseUrl: 'https://www.mgeko.cc',
    searchUrl: (q) => `https://www.mgeko.cc/jumbo/manga/?search=${encodeURIComponent(q)}`,
    enabled: true,
    color: 'bg-violet-500/20 text-violet-400',
  },
  {
    id: 'thunderscans',
    name: 'ThunderScans',
    baseUrl: 'https://en-thunderscans.com',
    searchUrl: (q) => `https://en-thunderscans.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    enabled: true,
    color: 'bg-sky-500/20 text-sky-400',
  },
];

export function getSourceById(id: string): SourceConfig | undefined {
  return SOURCES.find(s => s.id === id);
}

export function getSourceByUrl(url: string): SourceConfig | undefined {
  return SOURCES.find(s => url.includes(new URL(s.baseUrl).hostname));
}

export function getEnabledSources(): SourceConfig[] {
  return SOURCES.filter(s => s.enabled);
}

// Local storage key for user's source preferences
const SOURCE_PREFS_KEY = 'peakscroll_source_preferences';

export function getSourcePreferences(): string[] {
  const saved = localStorage.getItem(SOURCE_PREFS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  // Default to all sources
  return SOURCES.map(s => s.id);
}

export function saveSourcePreferences(sourceIds: string[]): void {
  localStorage.setItem(SOURCE_PREFS_KEY, JSON.stringify(sourceIds));
}
