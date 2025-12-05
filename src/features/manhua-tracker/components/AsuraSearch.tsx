import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, ExternalLink, Plus, Link2, AlertCircle } from 'lucide-react';
import { asuraService, type AsuraSearchResult } from '../lib/asura';
import { useToast } from '@/hooks/use-toast';

interface AsuraSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFromSearch: (result: AsuraSearchResult) => void;
  onLinkToExisting?: (url: string, coverUrl: string | null, latestChapter: number | null) => void;
  linkMode?: boolean;
  initialQuery?: string;
}

export function AsuraSearch({
  open,
  onOpenChange,
  onAddFromSearch,
  onLinkToExisting,
  linkMode = false,
  initialQuery = '',
}: AsuraSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AsuraSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (!open) {
      setResults([]);
      setSearched(false);
      setError(null);
    }
  }, [open]);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const data = await asuraService.searchManga(q.trim());
      setResults(data);
      if (data.length === 0) {
        setError('No results found. Try a different search term or check the URL directly.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. The CORS proxy may be blocked. Try adding the URL manually.');
      toast({
        title: 'Search Failed',
        description: 'Could not search AsuraComic. Try adding the URL manually.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (result: AsuraSearchResult) => {
    if (linkMode && onLinkToExisting) {
      onLinkToExisting(result.url, result.coverUrl, result.latestChapter);
    } else {
      onAddFromSearch(result);
    }
    onOpenChange(false);
  };

  const handleDirectUrl = async () => {
    // Check if query looks like a URL
    if (query.includes('asuracomic.net/series/')) {
      setLoading(true);
      try {
        const info = await asuraService.getSeriesInfo(query);
        if (info) {
          handleSelect(info);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch URL:', err);
      }
      setLoading(false);
      toast({
        title: 'Could not fetch URL',
        description: 'Try adding the series manually with the URL.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {linkMode ? 'Link to AsuraComic' : 'Search AsuraComic'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search or paste AsuraComic URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button
            onClick={() => query.includes('asuracomic.net') ? handleDirectUrl() : handleSearch()}
            disabled={loading || !query.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Search by title or paste an AsuraComic series URL directly
        </p>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <p className="text-xs text-muted-foreground">
                You can still add manhua manually and paste the AsuraComic URL as a source.
              </p>
            </div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.slug}
                className="flex gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-sage/50 transition-colors"
              >
                {/* Cover */}
                <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                  {result.coverUrl ? (
                    <img
                      src={result.coverUrl}
                      alt={result.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No Cover
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium leading-tight line-clamp-2">
                      {result.title}
                    </h4>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-muted-foreground hover:text-sage"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    {result.status && (
                      <Badge variant="secondary" className="text-xs">
                        {result.status}
                      </Badge>
                    )}
                    {result.latestChapter && (
                      <span className="text-xs text-muted-foreground">
                        Latest: Ch. {result.latestChapter}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    {result.url}
                  </p>
                </div>

                {/* Action */}
                <div className="flex-shrink-0 self-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSelect(result)}
                  >
                    {linkMode ? (
                      <>
                        <Link2 className="w-4 h-4 mr-1" />
                        Link
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : searched ? (
            <div className="text-center py-12 text-muted-foreground">
              No results found. Try a different search term.
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Search AsuraComic to find manga and manhua</p>
              <p className="text-xs mt-2">
                Or paste a direct URL like: asuracomic.net/series/...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
