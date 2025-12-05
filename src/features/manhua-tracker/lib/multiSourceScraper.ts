// Multi-source scraper for manga/manhua sites
import { SOURCES, type SourceConfig, type DiscoveryCategory } from './sources';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

export interface SearchResult {
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  coverUrl: string | null;
  latestChapter: number | null;
  status: string | null;
}

// Helper to add timeout to fetch
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

async function fetchWithProxy(url: string, timeoutMs = 8000): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetchWithTimeout(
        proxy + encodeURIComponent(url),
        { headers: { 'Accept': 'text/html,application/json' } },
        timeoutMs
      );
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Proxy ${proxy} failed for ${url}:`, e);
    }
  }
  throw new Error('All CORS proxies failed');
}

function extractChapterNumber(text: string): number | null {
  const match = text.match(/(?:chapter|ch\.?|ep\.?|episode)\s*(\d+(?:\.\d+)?)/i)
    || text.match(/(\d+(?:\.\d+)?)\s*$/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

// Extract rating from text (handles various formats: "9.5", "9.5/10", "4.5/5", etc.)
function extractRating(text: string): number | null {
  // Match patterns like "9.5", "9.5/10", "4.5/5", "Rating: 8.7"
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+))?/);
  if (match) {
    const value = parseFloat(match[1]);
    const maxValue = match[2] ? parseFloat(match[2]) : null;

    // Normalize to 10-point scale
    if (maxValue === 5) {
      return Math.round(value * 2 * 10) / 10; // Convert 5-point to 10-point
    } else if (maxValue === 100) {
      return Math.round(value / 10 * 10) / 10; // Convert 100-point to 10-point
    } else if (value <= 10) {
      return Math.round(value * 10) / 10; // Already 10-point scale
    }
  }
  return null;
}

// MangaDex uses official API - no scraping needed
async function searchMangaDex(query: string): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      title: query,
      limit: '15',
      'includes[]': 'cover_art',
      'order[relevance]': 'desc',
    });

    const response = await fetch(`https://api.mangadex.org/manga?${params}`);
    if (!response.ok) throw new Error('MangaDex API error');

    const data = await response.json();
    const results: SearchResult[] = [];

    for (const manga of data.data) {
      const titles = manga.attributes.title;
      const title = titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || 'Unknown';

      const coverRel = manga.relationships.find((r: { type: string; attributes?: { fileName?: string } }) => r.type === 'cover_art');
      const coverUrl = coverRel?.attributes?.fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
        : null;

      const latestChapter = manga.attributes.lastChapter
        ? parseFloat(manga.attributes.lastChapter)
        : null;

      results.push({
        sourceId: 'mangadex',
        sourceName: 'MangaDex',
        title: String(title),
        url: `https://mangadex.org/title/${manga.id}`,
        coverUrl,
        latestChapter: latestChapter && !isNaN(latestChapter) ? latestChapter : null,
        status: manga.attributes.status,
      });
    }

    return results;
  } catch (error) {
    console.error('MangaDex search failed:', error);
    return [];
  }
}

// Generic WordPress Manga theme scraper (many sites use this)
async function scrapeWPManga(source: SourceConfig, query: string): Promise<SearchResult[]> {
  try {
    const html = await fetchWithProxy(source.searchUrl(query));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: SearchResult[] = [];
    const seen = new Set<string>();

    // Common selectors for WP Manga themes
    const cards = doc.querySelectorAll('.c-tabs-item__content, .page-item-detail, .manga-item, .bsx, article');

    cards.forEach((card) => {
      const linkEl = card.querySelector('a[href*="/manga/"], a[href*="/series/"], a[href*="/comic/"], h3 a, h4 a, .post-title a');
      if (!linkEl) return;

      const href = linkEl.getAttribute('href');
      if (!href || seen.has(href)) return;
      seen.add(href);

      const titleEl = card.querySelector('.post-title, .series-title, h3, h4, .tt') || linkEl;
      const title = titleEl.textContent?.trim() || '';
      if (!title) return;

      const img = card.querySelector('img');
      let coverUrl = img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || img?.getAttribute('src') || null;

      // Fix relative URLs
      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = new URL(coverUrl, source.baseUrl).href;
      }

      const chapterEl = card.querySelector('.chapter, .latest-chap, .epxs, span[class*="chapter"]');
      const chapterText = chapterEl?.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        title,
        url: href.startsWith('http') ? href : new URL(href, source.baseUrl).href,
        coverUrl,
        latestChapter,
        status: null,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error(`${source.name} search failed:`, error);
    return [];
  }
}

// Generic scraper for other sites
async function scrapeGeneric(source: SourceConfig, query: string): Promise<SearchResult[]> {
  try {
    const html = await fetchWithProxy(source.searchUrl(query));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: SearchResult[] = [];
    const seen = new Set<string>();

    // Try various common selectors
    const links = doc.querySelectorAll('a[href*="/series/"], a[href*="/manga/"], a[href*="/comic/"], a[href*="/title/"], .manga-item a, .series-item a');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || seen.has(href)) return;

      // Skip navigation/utility links
      if (href.includes('/login') || href.includes('/register') || href.includes('/page/')) return;

      seen.add(href);

      // Try to find title
      const titleEl = link.querySelector('h3, h4, .title, span') || link;
      let title = titleEl.textContent?.trim() || '';

      // Clean up title
      title = title.replace(/Chapter\s*\d+.*/i, '').trim();
      if (!title || title.length < 2) return;

      // Try to find cover in parent or sibling
      const container = link.closest('article, .item, .card, div[class*="manga"], div[class*="series"]') || link.parentElement;
      const img = container?.querySelector('img') || link.querySelector('img');
      let coverUrl = img?.getAttribute('data-src') || img?.getAttribute('src') || null;

      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = new URL(coverUrl, source.baseUrl).href;
      }

      // Try to find chapter info
      const chapterText = container?.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        title,
        url: href.startsWith('http') ? href : new URL(href, source.baseUrl).href,
        coverUrl,
        latestChapter,
        status: null,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error(`${source.name} search failed:`, error);
    return [];
  }
}

// Specific scrapers for sites with unique structures
async function scrapeAsura(query: string): Promise<SearchResult[]> {
  const source = SOURCES.find(s => s.id === 'asuracomic')!;
  try {
    const html = await fetchWithProxy(source.searchUrl(query));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: SearchResult[] = [];
    const seen = new Set<string>();

    const seriesCards = doc.querySelectorAll('a[href*="/series/"]');

    seriesCards.forEach((card) => {
      const href = card.getAttribute('href');
      if (!href || !href.includes('/series/')) return;

      const slug = href.split('/series/')[1]?.split('/')[0]?.split('?')[0];
      if (!slug || seen.has(slug)) return;
      seen.add(slug);

      const titleEl = card.querySelector('h3, h2, .title, span') || card;
      const title = titleEl.textContent?.trim() || slug.replace(/-/g, ' ');

      const img = card.querySelector('img');
      const coverUrl = img?.getAttribute('src') || null;

      const chapterText = card.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      results.push({
        sourceId: 'asuracomic',
        sourceName: 'AsuraComic',
        title,
        url: `https://asuracomic.net/series/${slug}`,
        coverUrl,
        latestChapter,
        status: null,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error('AsuraComic search failed:', error);
    return [];
  }
}

// Bato.to scraper
async function scrapeBatoto(query: string): Promise<SearchResult[]> {
  const source = SOURCES.find(s => s.id === 'batoto')!;
  try {
    const html = await fetchWithProxy(source.searchUrl(query));
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: SearchResult[] = [];
    const seen = new Set<string>();

    // Bato.to uses /series/{id}/{slug} URLs
    const seriesLinks = doc.querySelectorAll('a[href*="/series/"]');

    seriesLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.includes('/series/')) return;

      // Extract series ID to dedupe
      const match = href.match(/\/series\/(\d+)/);
      if (!match || seen.has(match[1])) return;
      seen.add(match[1]);

      // Find title - could be in the link itself or in parent
      const container = link.closest('.item, .item-text, div') || link;
      const titleEl = container.querySelector('h3, h4, .item-title, .title') || link;
      let title = titleEl.textContent?.trim() || '';

      // Clean up title
      title = title.replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2) return;

      // Find cover image
      const parent = link.closest('.item, .series-item, div');
      const img = parent?.querySelector('img') || link.querySelector('img');
      let coverUrl = img?.getAttribute('data-src') || img?.getAttribute('src') || null;

      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = new URL(coverUrl, source.baseUrl).href;
      }

      // Try to find chapter info
      const chapterEl = parent?.querySelector('.item-volch, .chapter, span[class*="chapter"]');
      const chapterText = chapterEl?.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      results.push({
        sourceId: 'batoto',
        sourceName: 'Bato.to',
        title,
        url: href.startsWith('http') ? href : `https://bato.to${href}`,
        coverUrl,
        latestChapter,
        status: null,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error('Bato.to search failed:', error);
    return [];
  }
}

// Bato.to discovery scraper
async function scrapeDiscoveryBatoto(url: string): Promise<DiscoveryResult[]> {
  const source = SOURCES.find(s => s.id === 'batoto')!;
  try {
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: DiscoveryResult[] = [];
    const seen = new Set<string>();

    // Bato.to listing pages
    const items = doc.querySelectorAll('.item, .item-text, a[href*="/series/"]');
    let rank = 1;

    items.forEach((item) => {
      const link = item.tagName === 'A' ? item : item.querySelector('a[href*="/series/"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || !href.includes('/series/')) return;

      const match = href.match(/\/series\/(\d+)/);
      if (!match || seen.has(match[1])) return;
      seen.add(match[1]);

      const titleEl = item.querySelector('h3, h4, .item-title, .title, a');
      let title = titleEl?.textContent?.trim() || '';
      title = title.replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2) return;

      const img = item.querySelector('img');
      let coverUrl = img?.getAttribute('data-src') || img?.getAttribute('src') || null;

      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = new URL(coverUrl, source.baseUrl).href;
      }

      const chapterEl = item.querySelector('.item-volch, .chapter');
      const chapterText = chapterEl?.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      results.push({
        sourceId: 'batoto',
        sourceName: 'Bato.to',
        title,
        url: href.startsWith('http') ? href : `https://bato.to${href}`,
        coverUrl,
        latestChapter,
        status: null,
        rank: rank++,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error('Bato.to discovery failed:', error);
    return [];
  }
}

// Main search function that queries multiple sources
export async function searchMultipleSources(
  query: string,
  sourceIds: string[]
): Promise<SearchResult[]> {
  const enabledSources = SOURCES.filter(s => sourceIds.includes(s.id));
  const allResults: SearchResult[] = [];

  // Create promises for all sources
  const promises = enabledSources.map(async (source) => {
    try {
      if (source.id === 'mangadex') {
        return await searchMangaDex(query);
      } else if (source.id === 'asuracomic') {
        return await scrapeAsura(query);
      } else if (source.id === 'batoto') {
        return await scrapeBatoto(query);
      } else if (['manhwatop', 'manhwaclan', 'roliascan', 'kunmanga', 'manhuaus', 'manhuafast', 'thunderscans'].includes(source.id)) {
        return await scrapeWPManga(source, query);
      } else {
        return await scrapeGeneric(source, query);
      }
    } catch (error) {
      console.error(`Failed to search ${source.name}:`, error);
      return [];
    }
  });

  // Wait for all with timeout
  const results = await Promise.all(
    promises.map(p =>
      Promise.race([
        p,
        new Promise<SearchResult[]>(resolve => setTimeout(() => resolve([]), 10000))
      ])
    )
  );

  results.forEach(r => allResults.push(...r));

  return allResults;
}

export interface ChapterInfo {
  chapter: number | null;
  updatedAt: string | null; // ISO date string of when the chapter was released
}

// Parse relative time strings like "2 hours ago", "3 days ago" to ISO date
function parseRelativeTime(text: string): string | null {
  const now = new Date();
  const lowerText = text.toLowerCase().trim();

  // Match patterns like "2 hours ago", "3 days ago", "1 week ago"
  const match = lowerText.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/i);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    const date = new Date(now);
    switch (unit) {
      case 'second':
        date.setSeconds(date.getSeconds() - amount);
        break;
      case 'minute':
        date.setMinutes(date.getMinutes() - amount);
        break;
      case 'hour':
        date.setHours(date.getHours() - amount);
        break;
      case 'day':
        date.setDate(date.getDate() - amount);
        break;
      case 'week':
        date.setDate(date.getDate() - amount * 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - amount);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - amount);
        break;
    }
    return date.toISOString();
  }

  // Try to parse as a date string
  const parsed = Date.parse(text);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }

  return null;
}

// Get latest chapter from a specific URL
export async function getLatestChapter(url: string): Promise<ChapterInfo> {
  try {
    // Handle MangaDex API
    if (url.includes('mangadex.org')) {
      const match = url.match(/\/title\/([a-f0-9-]+)/);
      if (!match) return { chapter: null, updatedAt: null };

      const mangaId = match[1];
      const response = await fetchWithTimeout(
        `https://api.mangadex.org/chapter?manga=${mangaId}&order[chapter]=desc&limit=1&translatedLanguage[]=en`,
        {},
        5000
      );
      if (!response.ok) return { chapter: null, updatedAt: null };

      const data = await response.json();
      if (data.data.length > 0) {
        const ch = data.data[0].attributes.chapter;
        const publishAt = data.data[0].attributes.publishAt || data.data[0].attributes.createdAt;
        return {
          chapter: ch ? parseFloat(ch) : null,
          updatedAt: publishAt || null,
        };
      }
      return { chapter: null, updatedAt: null };
    }

    // For other sites, fetch and parse
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Look for chapter links
    const chapterLinks = doc.querySelectorAll(
      'a[href*="/chapter"], a[href*="/ch-"], .chapter-list a, .chapters a, .eph-num a, li[class*="chapter"] a'
    );

    let maxChapter: number | null = null;
    let latestChapterElement: Element | null = null;

    chapterLinks.forEach((link) => {
      const text = link.textContent || '';
      const ch = extractChapterNumber(text);
      if (ch !== null && (maxChapter === null || ch > maxChapter)) {
        maxChapter = ch;
        latestChapterElement = link;
      }
    });

    // Try to find the update time near the latest chapter
    let updatedAt: string | null = null;
    if (latestChapterElement) {
      // Look for time element or date text in parent/sibling
      const container = latestChapterElement.closest('li, .chapter-item, .wp-manga-chapter, .eph-num, tr, div[class*="chapter"]');
      if (container) {
        // Try common date selectors
        const timeEl = container.querySelector('time, .chapter-release-date, .chapter-time, span[class*="date"], span[class*="time"], .chapterdate, i');
        if (timeEl) {
          const timeText = timeEl.getAttribute('datetime') || timeEl.textContent?.trim() || '';
          updatedAt = parseRelativeTime(timeText);
        }
      }
    }

    return { chapter: maxChapter, updatedAt };
  } catch (error) {
    console.error('Failed to get latest chapter:', error);
    return { chapter: null, updatedAt: null };
  }
}

// ============ DISCOVERY FUNCTIONS ============

export interface DiscoveryResult extends SearchResult {
  rank?: number;
  updateTime?: string;
  rating?: number; // Rating out of 10 (if available from source)
}

// Scrape homepage/listing page for discovery
async function scrapeDiscoveryWPManga(source: SourceConfig, url: string): Promise<DiscoveryResult[]> {
  try {
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: DiscoveryResult[] = [];
    const seen = new Set<string>();

    // Try multiple selectors for different WP Manga themes
    const cards = doc.querySelectorAll(
      '.page-item-detail, .c-tabs-item__content, .manga-item, .bsx, ' +
      '.latest-updates .item, .popular-item, .trending-item, ' +
      'article, .manga, .series-item, .listupd .bs'
    );

    let rank = 1;
    cards.forEach((card) => {
      const linkEl = card.querySelector('a[href*="/manga/"], a[href*="/series/"], a[href*="/comic/"], h3 a, h4 a, .post-title a, .tt a');
      if (!linkEl) return;

      const href = linkEl.getAttribute('href');
      if (!href || seen.has(href)) return;
      seen.add(href);

      const titleEl = card.querySelector('.post-title, .series-title, h3, h4, .tt, .bigor .title') || linkEl;
      const title = titleEl.textContent?.trim() || '';
      if (!title || title.length < 2) return;

      const img = card.querySelector('img');
      let coverUrl = img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || img?.getAttribute('src') || null;

      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = new URL(coverUrl, source.baseUrl).href;
      }

      const chapterEl = card.querySelector('.chapter, .latest-chap, .epxs, span[class*="chapter"], .adds .epxs');
      const chapterText = chapterEl?.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      const timeEl = card.querySelector('.post-on, time, .chapter-date, .newchap span');
      const updateTime = timeEl?.textContent?.trim() || undefined;

      // Try to extract rating from various common selectors
      const ratingEl = card.querySelector('.score, .rating, .rate, .numscore, [class*="rating"], [class*="score"], .total_votes, .rt');
      let rating: number | null = null;
      if (ratingEl) {
        const ratingText = ratingEl.textContent?.trim() || '';
        rating = extractRating(ratingText);
      }

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        title,
        url: href.startsWith('http') ? href : new URL(href, source.baseUrl).href,
        coverUrl,
        latestChapter,
        status: null,
        rank: rank++,
        updateTime,
        rating,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error(`${source.name} discovery failed:`, error);
    return [];
  }
}

// Asura-specific discovery
async function scrapeDiscoveryAsura(url: string): Promise<DiscoveryResult[]> {
  try {
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: DiscoveryResult[] = [];
    const seen = new Set<string>();

    // For homepage, look for popular/trending sections
    const seriesCards = doc.querySelectorAll('a[href*="/series/"]');

    let rank = 1;
    seriesCards.forEach((card) => {
      const href = card.getAttribute('href');
      if (!href || !href.includes('/series/')) return;

      const slug = href.split('/series/')[1]?.split('/')[0]?.split('?')[0];
      if (!slug || seen.has(slug)) return;
      seen.add(slug);

      const titleEl = card.querySelector('h3, h2, .title, span') || card;
      const title = titleEl.textContent?.trim() || slug.replace(/-/g, ' ');
      if (!title || title.length < 2) return;

      const img = card.querySelector('img');
      const coverUrl = img?.getAttribute('src') || null;

      const chapterText = card.textContent || '';
      const latestChapter = extractChapterNumber(chapterText);

      // Asura shows ratings as "9.5" in card text - look for rating pattern
      // Ratings are typically shown as decimal numbers like 9.9, 9.8, etc.
      let rating: number | null = null;
      const cardText = card.textContent || '';
      const ratingMatch = cardText.match(/\b(\d\.\d)\b/);
      if (ratingMatch) {
        const val = parseFloat(ratingMatch[1]);
        if (val >= 1 && val <= 10) {
          rating = val;
        }
      }

      results.push({
        sourceId: 'asuracomic',
        sourceName: 'AsuraComic',
        title,
        url: `https://asuracomic.net/series/${slug}`,
        coverUrl,
        latestChapter,
        status: null,
        rank: rank++,
        rating,
      });
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error('AsuraComic discovery failed:', error);
    return [];
  }
}

// MangaDex discovery using API
async function discoverMangaDex(category: DiscoveryCategory): Promise<DiscoveryResult[]> {
  try {
    const params = new URLSearchParams({
      limit: '20',
      'includes[]': 'cover_art',
    });

    // Different ordering based on category
    if (category === 'popular') {
      params.append('order[followedCount]', 'desc');
    } else if (category === 'latest') {
      params.append('order[latestUploadedChapter]', 'desc');
    } else if (category === 'trending') {
      params.append('order[rating]', 'desc');
    }

    const response = await fetch(`https://api.mangadex.org/manga?${params}`);
    if (!response.ok) throw new Error('MangaDex API error');

    const data = await response.json();
    const results: DiscoveryResult[] = [];

    // Collect manga IDs to fetch ratings
    const mangaIds = data.data.map((m: { id: string }) => m.id);

    // Fetch ratings from statistics API
    const ratingsMap: Record<string, number> = {};
    if (mangaIds.length > 0) {
      try {
        const statsParams = new URLSearchParams();
        mangaIds.forEach((id: string) => statsParams.append('manga[]', id));
        const statsResponse = await fetch(`https://api.mangadex.org/statistics/manga?${statsParams}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          for (const [id, stats] of Object.entries(statsData.statistics || {}) as [string, { rating?: { bayesian?: number; average?: number } }][]) {
            const rating = stats?.rating?.bayesian || stats?.rating?.average;
            if (rating) {
              ratingsMap[id] = Math.round(rating * 10) / 10;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch MangaDex ratings:', e);
      }
    }

    let rank = 1;
    for (const manga of data.data) {
      const titles = manga.attributes.title;
      const title = titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || 'Unknown';

      const coverRel = manga.relationships.find((r: { type: string; attributes?: { fileName?: string } }) => r.type === 'cover_art');
      const coverUrl = coverRel?.attributes?.fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
        : null;

      const latestChapter = manga.attributes.lastChapter
        ? parseFloat(manga.attributes.lastChapter)
        : null;

      results.push({
        sourceId: 'mangadex',
        sourceName: 'MangaDex',
        title: String(title),
        url: `https://mangadex.org/title/${manga.id}`,
        coverUrl,
        latestChapter: latestChapter && !isNaN(latestChapter) ? latestChapter : null,
        status: manga.attributes.status,
        rank: rank++,
        rating: ratingsMap[manga.id] || undefined,
      });
    }

    return results;
  } catch (error) {
    console.error('MangaDex discovery failed:', error);
    return [];
  }
}

// Main discovery function
export async function discoverFromSources(
  category: DiscoveryCategory,
  sourceIds: string[]
): Promise<DiscoveryResult[]> {
  const enabledSources = SOURCES.filter(
    s => sourceIds.includes(s.id) && s.discoveryUrls?.[category]
  );

  // Include MangaDex if selected (uses API)
  const includeMangaDex = sourceIds.includes('mangadex');

  const promises: Promise<DiscoveryResult[]>[] = [];

  // Add MangaDex API call
  if (includeMangaDex) {
    promises.push(discoverMangaDex(category));
  }

  // Add scraping calls for other sources
  for (const source of enabledSources) {
    const url = source.discoveryUrls?.[category];
    if (!url) continue;

    if (source.id === 'asuracomic') {
      promises.push(scrapeDiscoveryAsura(url));
    } else if (source.id === 'batoto') {
      promises.push(scrapeDiscoveryBatoto(url));
    } else {
      promises.push(scrapeDiscoveryWPManga(source, url));
    }
  }

  // Wait for all with timeout
  const results = await Promise.all(
    promises.map(p =>
      Promise.race([
        p,
        new Promise<DiscoveryResult[]>(resolve => setTimeout(() => resolve([]), 10000))
      ])
    )
  );

  // Flatten and return
  return results.flat();
}

// Get sources that support a specific discovery category
export function getSourcesWithDiscovery(category: DiscoveryCategory): SourceConfig[] {
  const sources = SOURCES.filter(s => s.discoveryUrls?.[category]);
  // MangaDex supports all categories via API
  const mangadex = SOURCES.find(s => s.id === 'mangadex');
  if (mangadex && !sources.includes(mangadex)) {
    sources.unshift(mangadex);
  }
  return sources;
}
