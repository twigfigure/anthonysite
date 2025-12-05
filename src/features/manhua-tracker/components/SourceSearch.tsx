import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Search, Loader2, ExternalLink, Plus, ChevronDown, ChevronUp, AlertCircle, Link2 } from 'lucide-react';
import { SOURCES, getSourcePreferences, saveSourcePreferences, getSourceById } from '../lib/sources';
import { searchMultipleSources, type SearchResult } from '../lib/multiSourceScraper';
import { useToast } from '@/hooks/use-toast';
import type { ManhuaWithSources } from '../types';

interface SourceSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFromSearch: (result: SearchResult, allResults: SearchResult[]) => void;
  onLinkToExisting: (result: SearchResult, existingManhuaId: string, allResults: SearchResult[]) => void;
  manhuaList: ManhuaWithSources[];
}

export function SourceSearch({
  open,
  onOpenChange,
  onAddFromSearch,
  onLinkToExisting,
  manhuaList,
}: SourceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(() => getSourcePreferences());
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  // For the confirmation/linking step
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [pendingAdditions, setPendingAdditions] = useState<SearchResult[]>([]);
  const [linkChoices, setLinkChoices] = useState<Record<string, string>>({}); // resultKey -> manhuaId or 'new'
  const { toast } = useToast();

  // Generate unique key for a result
  const getResultKey = (result: SearchResult) => `${result.sourceId}:${result.url}`;

  useEffect(() => {
    if (!open) {
      setResults([]);
      setSearched(false);
      setError(null);
      setSelectedResults(new Set());
      setShowConfirmStep(false);
      setPendingAdditions([]);
      setLinkChoices({});
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
    setSelectedResults(new Set());
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

  // Normalize title for matching
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

  // Find all results with similar titles
  const findMatchingResults = (selectedResult: SearchResult): SearchResult[] => {
    return results.filter((r) => titlesMatch(r.title, selectedResult.title));
  };

  // Count matching sources for a result
  const getMatchingSourceCount = (result: SearchResult): number => {
    return findMatchingResults(result).length;
  };

  // Toggle selection for a result
  const toggleResultSelection = (result: SearchResult) => {
    const key = getResultKey(result);
    setSelectedResults(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Proceed to confirmation step
  const handleProceedToConfirm = () => {
    // Get unique titles from selected results
    const selectedTitles = new Set<string>();
    const resultsToAdd: SearchResult[] = [];

    for (const result of results) {
      const key = getResultKey(result);
      if (selectedResults.has(key)) {
        // Normalize title to avoid adding duplicates
        const normalizedTitle = normalizeTitle(result.title);
        if (!selectedTitles.has(normalizedTitle)) {
          selectedTitles.add(normalizedTitle);
          resultsToAdd.push(result);
        }
      }
    }

    // Initialize link choices - default to 'new' for each
    const initialChoices: Record<string, string> = {};
    for (const result of resultsToAdd) {
      initialChoices[getResultKey(result)] = 'new';
    }

    setPendingAdditions(resultsToAdd);
    setLinkChoices(initialChoices);
    setShowConfirmStep(true);
  };

  // Go back to selection
  const handleBackToSelection = () => {
    setShowConfirmStep(false);
    setPendingAdditions([]);
    setLinkChoices({});
  };

  // Final add with linking
  const handleFinalAdd = () => {
    let addedNew = 0;
    let linkedExisting = 0;

    for (const result of pendingAdditions) {
      const key = getResultKey(result);
      const choice = linkChoices[key];

      if (choice === 'new') {
        onAddFromSearch(result, results);
        addedNew++;
      } else {
        // Link to existing
        onLinkToExisting(result, choice, results);
        linkedExisting++;
      }
    }

    const messages: string[] = [];
    if (addedNew > 0) messages.push(`${addedNew} new`);
    if (linkedExisting > 0) messages.push(`${linkedExisting} linked`);

    toast({
      title: 'Done',
      description: `Added ${messages.join(', ')} title${addedNew + linkedExisting !== 1 ? 's' : ''}`,
    });

    setSelectedResults(new Set());
    setShowConfirmStep(false);
    setPendingAdditions([]);
    setLinkChoices({});
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
          <DialogTitle>
            {showConfirmStep ? 'Confirm & Link Titles' : 'Search Manga Sources'}
          </DialogTitle>
        </DialogHeader>

        {showConfirmStep ? (
          /* Confirmation Step */
          <>
            <p className="text-sm text-muted-foreground mb-4">
              For each title, choose to add as new or link to an existing title in your collection.
            </p>

            <div className="flex-1 overflow-y-auto space-y-4 max-h-[50vh]">
              {pendingAdditions.map((result) => {
                const key = getResultKey(result);
                const matchCount = getMatchingSourceCount(result);

                return (
                  <div
                    key={key}
                    className="p-4 rounded-lg bg-card/50 border border-border/50"
                  >
                    <div className="flex gap-3 mb-3">
                      {/* Cover */}
                      <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                        {result.coverUrl ? (
                          <img
                            src={result.coverUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No Cover
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">
                          {result.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getSourceById(result.sourceId)?.color || ''}>
                            {result.sourceName}
                          </Badge>
                          {matchCount > 1 && (
                            <span className="text-xs text-sage">
                              +{matchCount - 1} sources
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Link choice */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground whitespace-nowrap">
                        <Link2 className="w-4 h-4 inline mr-1" />
                        Add as:
                      </Label>
                      <Select
                        value={linkChoices[key] || 'new'}
                        onValueChange={(value) => {
                          setLinkChoices(prev => ({ ...prev, [key]: value }));
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              New Title
                            </span>
                          </SelectItem>
                          {manhuaList.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1 pt-2">
                                Link to existing:
                              </div>
                              {manhuaList
                                .sort((a, b) => a.title.localeCompare(b.title))
                                .map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.title}
                                  </SelectItem>
                                ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={handleBackToSelection} className="flex-1">
                Back
              </Button>
              <Button onClick={handleFinalAdd} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add {pendingAdditions.length} Title{pendingAdditions.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        ) : (
          /* Search Step */
          <>
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
        <div className="flex-1 overflow-y-auto mt-4 min-h-[300px] max-h-[50vh]">
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
                      {sourceResults.map((result, idx) => {
                        const resultKey = getResultKey(result);
                        const isSelected = selectedResults.has(resultKey);
                        const matchCount = getMatchingSourceCount(result);

                        return (
                          <div
                            key={`${result.sourceId}-${idx}`}
                            className={`flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-sage/10 border-sage/50'
                                : 'bg-card/50 border-border/50 hover:border-sage/30'
                            }`}
                            onClick={() => toggleResultSelection(result)}
                          >
                            {/* Checkbox */}
                            <div className="flex-shrink-0 self-center">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleResultSelection(result)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

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
                                {matchCount > 1 && (
                                  <span className="text-xs text-sage">
                                    +{matchCount - 1} sources
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

            {/* Add Selected Button - Fixed at bottom */}
            {selectedResults.size > 0 && (
              <div className="flex-shrink-0 pt-4 border-t border-border mt-4">
                <Button
                  className="w-full"
                  onClick={handleProceedToConfirm}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {selectedResults.size} Selected Title{selectedResults.size !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
