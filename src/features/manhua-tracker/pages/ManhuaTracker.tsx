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
import { Plus, Search, BookOpen, Filter, ArrowLeft, RefreshCw, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ManhuaCard } from '../components/ManhuaCard';
import { ManhuaDialog } from '../components/ManhuaDialog';
import { AsuraSearch } from '../components/AsuraSearch';
import { localManhuaService, localSourceService } from '../lib/localStorage';
import { asuraService, type AsuraSearchResult } from '../lib/asura';
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

  const [asuraSearchOpen, setAsuraSearchOpen] = useState(false);
  const [checkingUpdates, setCheckingUpdates] = useState(false);

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

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'progress':
          const aProgress = a.total_chapters ? a.current_chapter / a.total_chapters : 0;
          const bProgress = b.total_chapters ? b.current_chapter / b.total_chapters : 0;
          return bProgress - aProgress;
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

  // Handle adding from AsuraComic search
  const handleAddFromAsura = (result: AsuraSearchResult) => {
    const newManhua = localManhuaService.createManhua({
      title: result.title,
      cover_image_url: result.coverUrl,
      status: 'plan_to_read',
      current_chapter: 0,
    });

    // Add AsuraComic as a source
    localSourceService.addSource({
      manhua_id: newManhua.id,
      website_name: 'AsuraComic',
      website_url: result.url,
      latest_chapter: result.latestChapter || 0,
      last_updated: new Date().toISOString(),
    });

    toast({ title: 'Added', description: `${result.title} added to your collection` });
    loadManhua();
  };

  // Check for updates from AsuraComic sources
  const handleCheckUpdates = async () => {
    const asuraSources = manhuaList
      .flatMap((m) =>
        m.sources
          .filter((s) => s.website_url.includes('asuracomic.net'))
          .map((s) => ({ sourceId: s.id, manhuaId: m.id, url: s.website_url }))
      );

    if (asuraSources.length === 0) {
      toast({
        title: 'No Sources',
        description: 'Add AsuraComic sources to check for updates',
      });
      return;
    }

    setCheckingUpdates(true);
    let updatedCount = 0;

    try {
      for (const { sourceId, url } of asuraSources) {
        try {
          const info = await asuraService.getLatestChapter(url);
          if (info && info.chapter) {
            localSourceService.updateSource(sourceId, {
              latest_chapter: info.chapter,
              last_updated: new Date().toISOString(),
            });
            updatedCount++;
          }
        } catch (e) {
          console.warn('Failed to check:', url, e);
        }
        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 300));
      }

      loadManhua();
      toast({
        title: 'Updates Checked',
        description: `Checked ${updatedCount} of ${asuraSources.length} sources`,
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
                {checkingUpdates ? 'Checking...' : 'Check Updates'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAsuraSearchOpen(true)}
              >
                <Globe className="w-4 h-4 mr-2" />
                Search Asura
              </Button>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Manual
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
                  Search AsuraComic or add manhua manually to start tracking!
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setAsuraSearchOpen(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    Search AsuraComic
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

      <AsuraSearch
        open={asuraSearchOpen}
        onOpenChange={setAsuraSearchOpen}
        onAddFromSearch={handleAddFromAsura}
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
