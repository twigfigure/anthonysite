// AsuraComic scraper using CORS proxy
// Note: This may break if AsuraComic changes their HTML structure

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

const ASURA_BASE = 'https://asuracomic.net';

export interface AsuraSearchResult {
  title: string;
  slug: string;
  url: string;
  coverUrl: string | null;
  latestChapter: number | null;
  status: string | null;
}

export interface AsuraChapterInfo {
  chapter: number;
  url: string;
  title: string | null;
  date: string | null;
}

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: {
          'Accept': 'text/html',
        },
      });
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Proxy ${proxy} failed:`, e);
    }
  }
  throw new Error('All CORS proxies failed');
}

function extractChapterNumber(text: string): number | null {
  // Match patterns like "Chapter 123", "Ch. 123", "123"
  const match = text.match(/(?:chapter|ch\.?)\s*(\d+(?:\.\d+)?)/i) || text.match(/^(\d+(?:\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

export const asuraService = {
  async searchManga(query: string): Promise<AsuraSearchResult[]> {
    try {
      const searchUrl = `${ASURA_BASE}/series?name=${encodeURIComponent(query)}`;
      const html = await fetchWithProxy(searchUrl);

      const results: AsuraSearchResult[] = [];

      // Parse the HTML to find series cards
      // AsuraComic uses a grid of cards with series info
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find all series links - adjust selector based on actual HTML structure
      const seriesCards = doc.querySelectorAll('a[href*="/series/"]');
      const seen = new Set<string>();

      seriesCards.forEach((card) => {
        const href = card.getAttribute('href');
        if (!href || !href.includes('/series/')) return;

        const slug = href.split('/series/')[1]?.split('/')[0]?.split('?')[0];
        if (!slug || seen.has(slug)) return;
        seen.add(slug);

        // Try to find title
        const titleEl = card.querySelector('h3, h2, .title, span') || card;
        const title = titleEl.textContent?.trim() || slug.replace(/-/g, ' ');

        // Try to find cover image
        const img = card.querySelector('img');
        const coverUrl = img?.getAttribute('src') || null;

        // Try to find chapter info
        const chapterText = card.textContent || '';
        const latestChapter = extractChapterNumber(chapterText);

        results.push({
          title,
          slug,
          url: `${ASURA_BASE}/series/${slug}`,
          coverUrl,
          latestChapter,
          status: null,
        });
      });

      return results.slice(0, 20);
    } catch (error) {
      console.error('AsuraComic search failed:', error);
      throw error;
    }
  },

  async getSeriesInfo(slugOrUrl: string): Promise<AsuraSearchResult | null> {
    try {
      // Extract slug if full URL provided
      let slug = slugOrUrl;
      if (slugOrUrl.includes('asuracomic.net')) {
        const match = slugOrUrl.match(/\/series\/([^/?]+)/);
        slug = match ? match[1] : slugOrUrl;
      }

      const url = `${ASURA_BASE}/series/${slug}`;
      const html = await fetchWithProxy(url);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find title - usually in h1 or specific class
      const titleEl = doc.querySelector('h1, .series-title, [class*="title"]');
      const title = titleEl?.textContent?.trim() || slug.replace(/-/g, ' ');

      // Find cover
      const coverImg = doc.querySelector('img[src*="cover"], .series-cover img, .thumb img');
      const coverUrl = coverImg?.getAttribute('src') || null;

      // Find latest chapter - look for chapter list
      const chapterLinks = doc.querySelectorAll('a[href*="/chapter-"], a[href*="/ch-"], .chapter-list a');
      let latestChapter: number | null = null;

      chapterLinks.forEach((link) => {
        const text = link.textContent || '';
        const chNum = extractChapterNumber(text);
        if (chNum !== null && (latestChapter === null || chNum > latestChapter)) {
          latestChapter = chNum;
        }
      });

      // Find status
      const statusEl = doc.querySelector('[class*="status"], .series-status');
      const status = statusEl?.textContent?.trim() || null;

      return {
        title,
        slug,
        url,
        coverUrl,
        latestChapter,
        status,
      };
    } catch (error) {
      console.error('Failed to get series info:', error);
      return null;
    }
  },

  async getLatestChapter(slugOrUrl: string): Promise<AsuraChapterInfo | null> {
    try {
      let slug = slugOrUrl;
      if (slugOrUrl.includes('asuracomic.net')) {
        const match = slugOrUrl.match(/\/series\/([^/?]+)/);
        slug = match ? match[1] : slugOrUrl;
      }

      const url = `${ASURA_BASE}/series/${slug}`;
      const html = await fetchWithProxy(url);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find chapter links
      const chapterLinks = Array.from(doc.querySelectorAll('a[href*="/chapter"], .chapter-list a, .chapters a'));

      let latest: AsuraChapterInfo | null = null;

      for (const link of chapterLinks) {
        const href = link.getAttribute('href') || '';
        const text = link.textContent || '';
        const chNum = extractChapterNumber(text);

        if (chNum !== null && (latest === null || chNum > latest.chapter)) {
          latest = {
            chapter: chNum,
            url: href.startsWith('http') ? href : `${ASURA_BASE}${href}`,
            title: text.trim(),
            date: null,
          };
        }
      }

      return latest;
    } catch (error) {
      console.error('Failed to get latest chapter:', error);
      return null;
    }
  },

  // Check multiple series for updates
  async checkUpdates(sources: { id: string; url: string }[]): Promise<Map<string, number | null>> {
    const results = new Map<string, number | null>();

    // Process in batches to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < sources.length; i += batchSize) {
      const batch = sources.slice(i, i + batchSize);
      const promises = batch.map(async ({ id, url }) => {
        try {
          const info = await this.getLatestChapter(url);
          results.set(id, info?.chapter || null);
        } catch {
          results.set(id, null);
        }
      });

      await Promise.all(promises);

      // Small delay between batches
      if (i + batchSize < sources.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  },
};
