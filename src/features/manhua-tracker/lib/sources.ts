// Source configuration for all supported manga/manhua sites

export type DiscoveryCategory = 'popular' | 'latest' | 'trending';

export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  searchUrl: (query: string) => string;
  discoveryUrls?: Partial<Record<DiscoveryCategory, string>>; // URLs for discovery feeds
  // Function to build chapter URL from series URL and chapter number
  chapterUrl?: (seriesUrl: string, chapter: number) => string;
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
    discoveryUrls: {
      latest: 'https://asuracomic.net',
      popular: 'https://asuracomic.net/series?order=rating',
      trending: 'https://asuracomic.net/series?order=update',
    },
    // https://asuracomic.net/series/nano-machine-7561e668/chapter/289
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter/${chapter}`,
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
    discoveryUrls: {
      latest: 'https://www.toongod.org',
    },
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
    discoveryUrls: {
      latest: 'https://manhwatop.com',
      popular: 'https://manhwatop.com/manga/?m_orderby=views',
      trending: 'https://manhwatop.com/manga/?m_orderby=trending',
    },
    // WP-manga pattern: /manga/series-name/chapter-X/
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-red-500/20 text-red-400',
  },
  {
    id: 'manhwaclan',
    name: 'ManhwaClan',
    baseUrl: 'https://manhwaclan.com',
    searchUrl: (q) => `https://manhwaclan.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://manhwaclan.com',
      popular: 'https://manhwaclan.com/manga/?m_orderby=views',
      trending: 'https://manhwaclan.com/manga/?m_orderby=trending',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  {
    id: 'flamescans',
    name: 'FlameScans',
    baseUrl: 'https://flamescans.lol',
    searchUrl: (q) => `https://flamescans.lol/?s=${encodeURIComponent(q)}`,
    discoveryUrls: {
      latest: 'https://flamescans.lol',
    },
    // FlameScans uses different chapter URL patterns - need to verify
    enabled: true,
    color: 'bg-orange-600/20 text-orange-500',
  },
  {
    id: 'roliascan',
    name: 'RoliaScan',
    baseUrl: 'https://roliascan.com',
    searchUrl: (q) => `https://roliascan.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://roliascan.com',
      popular: 'https://roliascan.com/manga/?m_orderby=views',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-pink-500/20 text-pink-400',
  },
  {
    id: 'kunmanga',
    name: 'KunManga',
    baseUrl: 'https://kunmanga.com',
    searchUrl: (q) => `https://kunmanga.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://kunmanga.com',
      popular: 'https://kunmanga.com/manga/?m_orderby=views',
      trending: 'https://kunmanga.com/manga/?m_orderby=trending',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    id: 'manhuaus',
    name: 'ManhuaUS',
    baseUrl: 'https://manhuaus.com',
    searchUrl: (q) => `https://manhuaus.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://manhuaus.com',
      popular: 'https://manhuaus.com/manga/?m_orderby=views',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    id: 'manhuafast',
    name: 'ManhuaFast',
    baseUrl: 'https://manhuafast.net',
    searchUrl: (q) => `https://manhuafast.net/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://manhuafast.net',
      popular: 'https://manhuafast.net/manga/?m_orderby=views',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
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
    discoveryUrls: {
      latest: 'https://demonicscans.org',
    },
    enabled: true,
    color: 'bg-red-600/20 text-red-500',
  },
  {
    id: 'mgeko',
    name: 'Mgeko',
    baseUrl: 'https://www.mgeko.cc',
    searchUrl: (q) => `https://www.mgeko.cc/jumbo/manga/?search=${encodeURIComponent(q)}`,
    discoveryUrls: {
      latest: 'https://www.mgeko.cc/jumbo/manga/',
      popular: 'https://www.mgeko.cc/jumbo/manga/?orderby=views',
    },
    enabled: true,
    color: 'bg-violet-500/20 text-violet-400',
  },
  {
    id: 'thunderscans',
    name: 'ThunderScans',
    baseUrl: 'https://en-thunderscans.com',
    searchUrl: (q) => `https://en-thunderscans.com/?s=${encodeURIComponent(q)}&post_type=wp-manga`,
    discoveryUrls: {
      latest: 'https://en-thunderscans.com',
      popular: 'https://en-thunderscans.com/manga/?m_orderby=views',
    },
    chapterUrl: (seriesUrl, chapter) => `${seriesUrl.replace(/\/$/, '')}/chapter-${chapter}/`,
    enabled: true,
    color: 'bg-sky-500/20 text-sky-400',
  },
  {
    id: 'falconscans',
    name: 'FalconScans',
    baseUrl: 'https://falconscans.com',
    searchUrl: (q) => `https://falconscans.com/manga?q=${encodeURIComponent(q)}`,
    discoveryUrls: {
      latest: 'https://falconscans.com/manga',
      popular: 'https://falconscans.com/manga',
    },
    enabled: true,
    color: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'batoto',
    name: 'Bato.to',
    baseUrl: 'https://bato.to',
    searchUrl: (q) => `https://bato.to/search?word=${encodeURIComponent(q)}`,
    discoveryUrls: {
      latest: 'https://bato.to/latest',
      popular: 'https://bato.to/browse?sort=views_a',
      trending: 'https://bato.to/browse?sort=views_w',
    },
    // https://bato.to/chapter/2892841
    chapterUrl: (seriesUrl, _chapter) => {
      // Bato.to uses chapter IDs not numbers, so we link to series page instead
      return seriesUrl;
    },
    enabled: true,
    color: 'bg-fuchsia-500/20 text-fuchsia-400',
  },
  {
    id: 'comick',
    name: 'ComicK',
    baseUrl: 'https://comick.io',
    searchUrl: (q) => `https://comick.io/search?q=${encodeURIComponent(q)}`,
    discoveryUrls: {
      latest: 'https://comick.io/home2',
      popular: 'https://comick.io/browse?sort=follow',
      trending: 'https://comick.io/browse?sort=view',
    },
    // https://comick.io/comic/solo-leveling/abcde-chapter-1-en
    chapterUrl: (seriesUrl, _chapter) => {
      // ComicK has complex chapter URLs with hashes, link to series instead
      return seriesUrl;
    },
    enabled: false, // Cloudflare protected - can't scrape, manual linking only
    color: 'bg-rose-500/20 text-rose-400',
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
