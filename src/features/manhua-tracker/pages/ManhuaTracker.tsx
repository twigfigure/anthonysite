import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, BookOpen, Filter, ArrowLeft, RefreshCw, Library, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManhuaCard } from '../components/ManhuaCard';
import { ManhuaDialog } from '../components/ManhuaDialog';
import { SourceSearch } from '../components/SourceSearch';
import { DiscoveryPanel } from '../components/DiscoveryPanel';
import { ManhuaCarousel } from '../components/ManhuaCarousel';
import { localManhuaService, localSourceService } from '../lib/localStorage';
import { getLatestChapter, searchMultipleSources, type SearchResult, type DiscoveryResult } from '../lib/multiSourceScraper';
import { getSourcePreferences } from '../lib/sources';
import { getSourceByUrl } from '../lib/sources';
import type { ManhuaWithSources, ManhuaStatus, CreateSourceInput } from '../types';
import { STATUS_LABELS } from '../types';

type SortOption = 'updated' | 'title' | 'rating' | 'progress';
type FilterStatus = ManhuaStatus | 'all';

export default function ManhuaTracker() {
  const { toast } = useToast();

  const [manhuaList, setManhuaList] = useState<ManhuaWithSources[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManhua, setEditingManhua] = useState<ManhuaWithSources | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [sourceSearchOpen, setSourceSearchOpen] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadManhua();
  }, []);

  const loadManhua = () => {
    setLoading(true);
    try {
      const data = localManhuaService.getAllManhua();
      setManhuaList(data);
    } catch (error) {
      console.error('Failed to load manhua:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your manhua collection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedManhua = useMemo(() => {
    let result = [...manhuaList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'progress': {
          const aProgress = a.total_chapters ? a.current_chapter / a.total_chapters : 0;
          const bProgress = b.total_chapters ? b.current_chapter / b.total_chapters : 0;
          return bProgress - aProgress;
        }
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return result;
  }, [manhuaList, searchQuery, statusFilter, sortBy]);

  const handleAddNew = () => {
    setEditingManhua(null);
    setDialogOpen(true);
  };

  const handleEdit = (manhua: ManhuaWithSources) => {
    setEditingManhua(manhua);
    setDialogOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    cover_image_url: string | null;
    description: string | null;
    status: ManhuaStatus;
    current_chapter: number;
    total_chapters: number | null;
    rating: number | null;
    notes: string | null;
  }) => {
    try {
      if (editingManhua) {
        localManhuaService.updateManhua(editingManhua.id, data);
        toast({ title: 'Updated', description: 'Manhua updated successfully' });
      } else {
        localManhuaService.createManhua(data);
        toast({ title: 'Added', description: 'New manhua added to your collection' });
      }
      loadManhua();
    } catch (error) {
      console.error('Failed to save manhua:', error);
      toast({
        title: 'Error',
        description: 'Failed to save manhua',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      localManhuaService.deleteManhua(id);
      setDeleteConfirmId(null);
      toast({ title: 'Deleted', description: 'Manhua removed from your collection' });
      loadManhua();
    } catch (error) {
      console.error('Failed to delete manhua:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete manhua',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateChapter = (id: string, chapter: number) => {
    try {
      localManhuaService.updateManhua(id, { current_chapter: chapter });
      setManhuaList((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, current_chapter: chapter, updated_at: new Date().toISOString() } : m
        )
      );
    } catch (error) {
      console.error('Failed to update chapter:', error);
      toast({
        title: 'Error',
        description: 'Failed to update chapter',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRating = (id: string, rating: number) => {
    try {
      localManhuaService.updateManhua(id, { rating });
      setManhuaList((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, rating, updated_at: new Date().toISOString() } : m
        )
      );
    } catch (error) {
      console.error('Failed to update rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rating',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = (id: string, status: ManhuaStatus) => {
    try {
      localManhuaService.updateManhua(id, { status });
      setManhuaList((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleAddSource = async (input: Omit<CreateSourceInput, 'manhua_id'>) => {
    if (!editingManhua) return;
    try {
      localSourceService.addSource({
        ...input,
        manhua_id: editingManhua.id,
      });
      const updated = localManhuaService.getManhuaById(editingManhua.id);
      if (updated) {
        setEditingManhua(updated);
        setManhuaList((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      }
      toast({ title: 'Source Added', description: 'New source added successfully' });
    } catch (error) {
      console.error('Failed to add source:', error);
      toast({
        title: 'Error',
        description: 'Failed to add source',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSource = async (id: string, data: Partial<CreateSourceInput>) => {
    try {
      localSourceService.updateSource(id, data);
      if (editingManhua) {
        const updated = localManhuaService.getManhuaById(editingManhua.id);
        if (updated) {
          setEditingManhua(updated);
          setManhuaList((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      }
    } catch (error) {
      console.error('Failed to update source:', error);
      toast({
        title: 'Error',
        description: 'Failed to update source',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      localSourceService.deleteSource(id);
      if (editingManhua) {
        const updated = localManhuaService.getManhuaById(editingManhua.id);
        if (updated) {
          setEditingManhua(updated);
          setManhuaList((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      }
      toast({ title: 'Source Removed', description: 'Source removed successfully' });
    } catch (error) {
      console.error('Failed to delete source:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete source',
        variant: 'destructive',
      });
    }
  };

  // Normalize title for comparison (lowercase, remove special chars)
  const normalizeTitle = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Common words to ignore when matching titles
  const STOP_WORDS = new Set(['the', 'a', 'an', 'of', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'is', 'raw', 'manga', 'manhua', 'manhwa', 'comic', 'webtoon']);

  // Get significant tokens from a title (excluding stop words)
  const getTokens = (title: string): Set<string> => {
    const normalized = normalizeTitle(title);
    const words = normalized.split(' ').filter(w => w.length > 1 && !STOP_WORDS.has(w));
    return new Set(words);
  };

  // Check if two titles match using token overlap
  const titlesMatch = (title1: string, title2: string): boolean => {
    const normalized1 = normalizeTitle(title1);
    const normalized2 = normalizeTitle(title2);

    // Exact match after normalization
    if (normalized1 === normalized2) return true;

    // One contains the other
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

    // Token-based matching: check if significant words overlap
    const tokens1 = getTokens(title1);
    const tokens2 = getTokens(title2);

    if (tokens1.size === 0 || tokens2.size === 0) return false;

    // Count matching tokens
    let matches = 0;
    for (const token of tokens1) {
      if (tokens2.has(token)) matches++;
    }

    // Require at least 80% of the smaller set to match
    const minSize = Math.min(tokens1.size, tokens2.size);
    return matches >= minSize * 0.8;
  };

  // Find existing manhua with similar title
  const findExistingManhua = (title: string): ManhuaWithSources | undefined => {
    return manhuaList.find((m) => titlesMatch(m.title, title));
  };

  // Handle adding from source search - adds all matching sources automatically
  const handleAddFromSearch = (result: SearchResult, allResults: SearchResult[]) => {
    // Find all results with similar titles to add as sources
    // BUT only include one result per source (to avoid adding 20 Bato.to results)
    const matchingResults = allResults.filter((r) => titlesMatch(r.title, result.title));

    // Dedupe by source - keep the one closest in chapter count or first one
    const seenSources = new Set<string>();
    const dedupedResults: SearchResult[] = [];

    // Always add the clicked result first
    dedupedResults.push(result);
    seenSources.add(result.sourceId);

    // Then add one from each other source
    for (const matchResult of matchingResults) {
      if (!seenSources.has(matchResult.sourceId)) {
        seenSources.add(matchResult.sourceId);
        dedupedResults.push(matchResult);
      }
    }

    // Check if manhua with similar title already exists
    const existingManhua = findExistingManhua(result.title);

    if (existingManhua) {
      // Add all new sources to existing manhua
      let addedCount = 0;
      for (const matchResult of dedupedResults) {
        const sourceExists = existingManhua.sources.some(
          (s) => s.website_url === matchResult.url
        );

        if (!sourceExists) {
          const source = getSourceByUrl(matchResult.url);
          localSourceService.addSource({
            manhua_id: existingManhua.id,
            website_name: source?.name || matchResult.sourceName,
            website_url: matchResult.url,
            latest_chapter: matchResult.latestChapter || 0,
            last_updated: new Date().toISOString(),
          });
          addedCount++;
        }
      }

      // Update cover if existing doesn't have one
      if (!existingManhua.cover_image_url && result.coverUrl) {
        localManhuaService.updateManhua(existingManhua.id, {
          cover_image_url: result.coverUrl,
        });
      }

      if (addedCount > 0) {
        toast({
          title: 'Sources Added',
          description: `${addedCount} source${addedCount > 1 ? 's' : ''} added to "${existingManhua.title}"`,
        });
      } else {
        toast({
          title: 'Already Added',
          description: `All sources already exist for "${existingManhua.title}"`,
        });
      }
    } else {
      // Create new manhua with the best cover available
      const bestCover = dedupedResults.find(r => r.coverUrl)?.coverUrl || result.coverUrl;
      const newManhua = localManhuaService.createManhua({
        title: result.title,
        cover_image_url: bestCover,
        status: 'plan_to_read',
        current_chapter: 0,
      });

      // Add all deduped results as sources (one per source site)
      for (const matchResult of dedupedResults) {
        const source = getSourceByUrl(matchResult.url);
        localSourceService.addSource({
          manhua_id: newManhua.id,
          website_name: source?.name || matchResult.sourceName,
          website_url: matchResult.url,
          latest_chapter: matchResult.latestChapter || 0,
          last_updated: new Date().toISOString(),
        });
      }

      toast({
        title: 'Added',
        description: `${result.title} added with ${dedupedResults.length} source${dedupedResults.length > 1 ? 's' : ''}`,
      });
    }

    loadManhua();
  };

  // Handle linking search result to an existing manhua
  const handleLinkToExisting = (result: SearchResult, existingManhuaId: string, allResults: SearchResult[]) => {
    const existingManhua = manhuaList.find(m => m.id === existingManhuaId);
    if (!existingManhua) return;

    // Find all results with similar titles to add as sources
    // BUT only include one result per source (to avoid adding 20 Bato.to results)
    const matchingResults = allResults.filter((r) => titlesMatch(r.title, result.title));

    // Dedupe by source - keep one per source site
    const seenSources = new Set<string>();
    const dedupedResults: SearchResult[] = [];

    // Always add the clicked result first
    dedupedResults.push(result);
    seenSources.add(result.sourceId);

    // Then add one from each other source
    for (const matchResult of matchingResults) {
      if (!seenSources.has(matchResult.sourceId)) {
        seenSources.add(matchResult.sourceId);
        dedupedResults.push(matchResult);
      }
    }

    // Add all new sources to existing manhua
    let addedCount = 0;
    for (const matchResult of dedupedResults) {
      const sourceExists = existingManhua.sources.some(
        (s) => s.website_url === matchResult.url
      );

      if (!sourceExists) {
        const source = getSourceByUrl(matchResult.url);
        localSourceService.addSource({
          manhua_id: existingManhua.id,
          website_name: source?.name || matchResult.sourceName,
          website_url: matchResult.url,
          latest_chapter: matchResult.latestChapter || 0,
          last_updated: new Date().toISOString(),
        });
        addedCount++;
      }
    }

    // Update cover if existing doesn't have one
    if (!existingManhua.cover_image_url && result.coverUrl) {
      localManhuaService.updateManhua(existingManhua.id, {
        cover_image_url: result.coverUrl,
      });
    }

    loadManhua();
  };

  // Handle adding from discovery - searches all sources for matching titles
  const handleAddFromDiscovery = async (result: DiscoveryResult, _allResults: DiscoveryResult[]) => {
    // Show a toast that we're searching for sources
    toast({
      title: 'Searching Sources',
      description: `Finding all sources for "${result.title}"...`,
    });

    // Search all enabled sources for this title
    const enabledSources = getSourcePreferences();
    const searchResults = await searchMultipleSources(result.title, enabledSources);

    // Find all results with similar titles
    const matchingResults = searchResults.filter((r) => titlesMatch(r.title, result.title));

    // Also include the original discovery result if not already in matching
    const discoveryAsSearch: SearchResult = {
      sourceId: result.sourceId,
      sourceName: result.sourceName,
      title: result.title,
      url: result.url,
      coverUrl: result.coverUrl,
      latestChapter: result.latestChapter,
      status: result.status,
    };

    if (!matchingResults.some(r => r.url === result.url)) {
      matchingResults.push(discoveryAsSearch);
    }

    // Dedupe by source - keep one per source site
    const seenSources = new Set<string>();
    const dedupedResults: SearchResult[] = [];

    // Always add the discovery result first
    dedupedResults.push(discoveryAsSearch);
    seenSources.add(result.sourceId);

    // Then add one from each other source
    for (const matchResult of matchingResults) {
      if (!seenSources.has(matchResult.sourceId)) {
        seenSources.add(matchResult.sourceId);
        dedupedResults.push(matchResult);
      }
    }

    // Check if manhua with similar title already exists
    const existingManhua = findExistingManhua(result.title);

    if (existingManhua) {
      // Add all new sources to existing manhua
      let addedCount = 0;
      for (const matchResult of dedupedResults) {
        const sourceExists = existingManhua.sources.some(
          (s) => s.website_url === matchResult.url
        );

        if (!sourceExists) {
          const source = getSourceByUrl(matchResult.url);
          localSourceService.addSource({
            manhua_id: existingManhua.id,
            website_name: source?.name || matchResult.sourceName,
            website_url: matchResult.url,
            latest_chapter: matchResult.latestChapter || 0,
            last_updated: new Date().toISOString(),
          });
          addedCount++;
        }
      }

      // Update cover if existing doesn't have one
      if (!existingManhua.cover_image_url && result.coverUrl) {
        localManhuaService.updateManhua(existingManhua.id, {
          cover_image_url: result.coverUrl,
        });
      }

      if (addedCount > 0) {
        toast({
          title: 'Sources Added',
          description: `${addedCount} source${addedCount > 1 ? 's' : ''} added to "${existingManhua.title}"`,
        });
      } else {
        toast({
          title: 'Already Added',
          description: `All sources already exist for "${existingManhua.title}"`,
        });
      }
    } else {
      // Create new manhua with the best cover available
      const bestCover = dedupedResults.find(r => r.coverUrl)?.coverUrl || result.coverUrl;
      const newManhua = localManhuaService.createManhua({
        title: result.title,
        cover_image_url: bestCover,
        status: 'plan_to_read',
        current_chapter: 0,
      });

      // Add all deduped results as sources (one per source site)
      for (const matchResult of dedupedResults) {
        const source = getSourceByUrl(matchResult.url);
        localSourceService.addSource({
          manhua_id: newManhua.id,
          website_name: source?.name || matchResult.sourceName,
          website_url: matchResult.url,
          latest_chapter: matchResult.latestChapter || 0,
          last_updated: new Date().toISOString(),
        });
      }

      toast({
        title: 'Added',
        description: `${result.title} added with ${dedupedResults.length} source${dedupedResults.length > 1 ? 's' : ''}`,
      });
    }

    loadManhua();
  };

  // Check for updates from all sources - optimized with parallel batching
  const handleCheckUpdates = async () => {
    const allSources = manhuaList.flatMap((m) =>
      m.sources.map((s) => ({ sourceId: s.id, manhuaId: m.id, url: s.website_url }))
    );

    if (allSources.length === 0) {
      toast({
        title: 'No Sources',
        description: 'Add sources to your manhua to check for updates',
      });
      return;
    }

    setCheckingUpdates(true);
    setUpdateProgress({ current: 0, total: allSources.length });
    let updatedCount = 0;
    let failedCount = 0;
    let completedCount = 0;

    try {
      // Process in parallel batches of 5 to avoid overwhelming proxies
      const BATCH_SIZE = 5;

      for (let i = 0; i < allSources.length; i += BATCH_SIZE) {
        const batch = allSources.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map(async ({ sourceId, url }) => {
            const chapterInfo = await getLatestChapter(url);
            return { sourceId, chapterInfo };
          })
        );

        // Process results
        for (const result of results) {
          completedCount++;
          setUpdateProgress({ current: completedCount, total: allSources.length });

          if (result.status === 'fulfilled' && result.value.chapterInfo.chapter !== null) {
            localSourceService.updateSource(result.value.sourceId, {
              latest_chapter: result.value.chapterInfo.chapter,
              last_updated: result.value.chapterInfo.updatedAt || undefined,
              last_checked: new Date().toISOString(),
            });
            updatedCount++;
          } else {
            failedCount++;
          }
        }

        // Small delay between batches to be nice to servers
        if (i + BATCH_SIZE < allSources.length) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }

      loadManhua();
      toast({
        title: 'Updates Checked',
        description: `Updated ${updatedCount} sources${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      });
    } catch (error) {
      console.error('Failed to check updates:', error);
      toast({
        title: 'Error',
        description: 'Failed to check for updates',
        variant: 'destructive',
      });
    } finally {
      setCheckingUpdates(false);
      setUpdateProgress({ current: 0, total: 0 });
    }
  };

  // Stats
  const stats = useMemo(() => {
    const reading = manhuaList.filter((m) => m.status === 'reading').length;
    const completed = manhuaList.filter((m) => m.status === 'completed').length;
    const total = manhuaList.length;
    const withNewChapters = manhuaList.filter((m) => {
      if (m.sources.length === 0) return false;
      const maxChapter = Math.max(...m.sources.map((s) => s.latest_chapter));
      return maxChapter > m.current_chapter;
    }).length;
    return { reading, completed, total, withNewChapters };
  }, [manhuaList]);

  // Reading history - recently updated manhua that user is currently reading
  const readingHistory = useMemo(() => {
    return manhuaList
      .filter((m) => m.status === 'reading' && m.current_chapter > 0)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 20);
  }, [manhuaList]);

  // New chapters - manhua with new chapters available, sorted by most recent source update
  const newChapters = useMemo((): ManhuaWithSources[] => {
    return manhuaList
      .filter((m) => {
        if (m.sources.length === 0) return false;
        const maxChapter = Math.max(...m.sources.map((s) => s.latest_chapter));
        return maxChapter > m.current_chapter;
      })
      .map((m) => {
        // Get the most recent source update time
        const mostRecentUpdate = m.sources.reduce((latest, source) => {
          const sourceTime = new Date(source.last_updated || 0).getTime();
          return sourceTime > latest ? sourceTime : latest;
        }, 0);
        return { manhua: m, sortTime: mostRecentUpdate };
      })
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(({ manhua }) => manhua)
      .slice(0, 20);
  }, [manhuaList]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sage" />
                <h1 className="text-2xl font-bold">PeakScroll</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckUpdates}
                disabled={checkingUpdates || manhuaList.length === 0}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checkingUpdates ? 'animate-spin' : ''}`} />
                {checkingUpdates
                  ? `${updateProgress.current}/${updateProgress.total}`
                  : 'Check Updates'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDiscoveryOpen(true)}
              >
                <Compass className="w-4 h-4 mr-2" />
                Discover
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSourceSearchOpen(true)}
              >
                <Library className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button onClick={handleAddNew} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Manual
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Manhua</div>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl font-bold text-green-400">{stats.reading}</div>
            <div className="text-sm text-muted-foreground">Currently Reading</div>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl font-bold text-amber-400">{stats.withNewChapters}</div>
            <div className="text-sm text-muted-foreground">With Updates</div>
          </div>
        </div>

        {/* New Chapters Carousel */}
        <ManhuaCarousel
          title="New Chapters"
          icon="new"
          items={newChapters}
          onItemClick={handleEdit}
          emptyMessage="No new chapters available"
        />

        {/* Reading History Carousel */}
        <ManhuaCarousel
          title="Continue Reading"
          icon="history"
          items={readingHistory}
          onItemClick={handleEdit}
          emptyMessage="Start reading to see your history"
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search manhua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-lg bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : filteredAndSortedManhua.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            {manhuaList.length === 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Your collection is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Search manga sources or add manually to start tracking!
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setSourceSearchOpen(true)}>
                    <Library className="w-4 h-4 mr-2" />
                    Search Sources
                  </Button>
                  <Button onClick={handleAddNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedManhua.map((manhua) => (
              <ManhuaCard
                key={manhua.id}
                manhua={manhua}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirmId(id)}
                onUpdateChapter={handleUpdateChapter}
                onUpdateRating={handleUpdateRating}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ManhuaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        manhua={editingManhua}
        onSave={handleSave}
        onAddSource={handleAddSource}
        onUpdateSource={handleUpdateSource}
        onDeleteSource={handleDeleteSource}
      />

      <SourceSearch
        open={sourceSearchOpen}
        onOpenChange={setSourceSearchOpen}
        onAddFromSearch={handleAddFromSearch}
        onLinkToExisting={handleLinkToExisting}
        manhuaList={manhuaList}
      />

      <DiscoveryPanel
        open={discoveryOpen}
        onOpenChange={setDiscoveryOpen}
        onAddFromDiscovery={handleAddFromDiscovery}
      />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Manhua</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this manhua from your collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
