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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Search, Loader2, ExternalLink, Plus, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { SOURCES, getSourcePreferences, saveSourcePreferences, getSourceById } from '../lib/sources';
import { searchMultipleSources, type SearchResult } from '../lib/multiSourceScraper';
import { useToast } from '@/hooks/use-toast';

interface SourceSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFromSearch: (result: SearchResult) => void;
}

export function SourceSearch({
  open,
  onOpenChange,
  onAddFromSearch,
}: SourceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(() => getSourcePreferences());
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setResults([]);
      setSearched(false);
      setError(null);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (selectedSources.length === 0) {
      toast({
        title: 'No Sources Selected',
        description: 'Please select at least one source to search',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);
    saveSourcePreferences(selectedSources);

    try {
      const data = await searchMultipleSources(query.trim(), selectedSources);
      setResults(data);
      if (data.length === 0) {
        setError('No results found. Try different search terms or enable more sources.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Some sources may be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const selectAllSources = () => {
    setSelectedSources(SOURCES.map(s => s.id));
  };

  const deselectAllSources = () => {
    setSelectedSources([]);
  };

  const handleSelect = (result: SearchResult) => {
    onAddFromSearch(result);
    onOpenChange(false);
  };

  // Group results by source
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.sourceId]) {
      acc[result.sourceId] = [];
    }
    acc[result.sourceId].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Manga Sources</DialogTitle>
        </DialogHeader>

        {/* Source Selection */}
        <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between mb-2">
              <span>
                Sources ({selectedSources.length}/{SOURCES.length} selected)
              </span>
              {sourcesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex gap-2 mb-3">
                <Button variant="ghost" size="sm" onClick={selectAllSources}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAllSources}>
                  Deselect All
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {SOURCES.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={source.id}
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={() => toggleSource(source.id)}
                    />
                    <Label
                      htmlFor={source.id}
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <span className={`w-2 h-2 rounded-full ${source.color.split(' ')[0]}`} />
                      {source.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for manga/manhua..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim() || selectedSources.length === 0}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto mt-4 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Searching {selectedSources.length} sources...
              </p>
            </div>
          ) : error && results.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
              <p className="text-muted-foreground mb-2">{error}</p>
              <p className="text-xs text-muted-foreground">
                You can still add manga manually and paste URLs as sources.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedResults).map(([sourceId, sourceResults]) => {
                const source = getSourceById(sourceId);
                if (!source) return null;

                return (
                  <div key={sourceId}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={source.color}>{source.name}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {sourceResults.length} result{sourceResults.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sourceResults.map((result, idx) => (
                        <div
                          key={`${result.sourceId}-${idx}`}
                          className="flex gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-sage/50 transition-colors"
                        >
                          {/* Cover */}
                          <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
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
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                No Cover
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm leading-tight line-clamp-2">
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

                            <div className="flex items-center gap-2 mt-1">
                              {result.latestChapter && (
                                <span className="text-xs text-muted-foreground">
                                  Ch. {result.latestChapter}
                                </span>
                              )}
                              {result.status && (
                                <span className="text-xs text-muted-foreground">
                                  {result.status}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex-shrink-0 self-center">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSelect(result)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searched ? (
            <div className="text-center py-12 text-muted-foreground">
              No results found. Try a different search term.
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Search across {selectedSources.length} sources</p>
              <p className="text-xs mt-2">
                Select sources above, then enter a search term
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
