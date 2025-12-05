// Multi-source scraper for manga/manhua sites
import { SOURCES, type SourceConfig } from './sources';

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

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: { 'Accept': 'text/html,application/json' },
      });
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

      const coverRel = manga.relationships.find((r: any) => r.type === 'cover_art');
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
      let results: SearchResult[] = [];

      if (source.id === 'mangadex') {
        results = await searchMangaDex(query);
      } else if (source.id === 'asuracomic') {
        results = await scrapeAsura(query);
      } else if (['manhwatop', 'manhwaclan', 'roliascan', 'kunmanga', 'manhuaus', 'manhuafast', 'thunderscans'].includes(source.id)) {
        results = await scrapeWPManga(source, query);
      } else {
        results = await scrapeGeneric(source, query);
      }

      return results;
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

// Get latest chapter from a specific URL
export async function getLatestChapter(url: string): Promise<number | null> {
  try {
    // Handle MangaDex API
    if (url.includes('mangadex.org')) {
      const match = url.match(/\/title\/([a-f0-9-]+)/);
      if (!match) return null;

      const mangaId = match[1];
      const response = await fetch(
        `https://api.mangadex.org/chapter?manga=${mangaId}&order[chapter]=desc&limit=1`
      );
      if (!response.ok) return null;

      const data = await response.json();
      if (data.data.length > 0) {
        const ch = data.data[0].attributes.chapter;
        return ch ? parseFloat(ch) : null;
      }
      return null;
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

    chapterLinks.forEach((link) => {
      const text = link.textContent || '';
      const ch = extractChapterNumber(text);
      if (ch !== null && (maxChapter === null || ch > maxChapter)) {
        maxChapter = ch;
      }
    });

    return maxChapter;
  } catch (error) {
    console.error('Failed to get latest chapter:', error);
    return null;
  }
}
