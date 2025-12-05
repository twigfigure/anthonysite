import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronUp,
  Flame,
  Clock,
  TrendingUp,
  RefreshCw,
  Star,
} from 'lucide-react';
import { getSourcePreferences, saveSourcePreferences, getSourceById } from '../lib/sources';
import { discoverFromSources, getSourcesWithDiscovery, type DiscoveryResult } from '../lib/multiSourceScraper';
import type { DiscoveryCategory } from '../lib/sources';
import { useToast } from '@/hooks/use-toast';

interface DiscoveryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFromDiscovery: (result: DiscoveryResult, allResults: DiscoveryResult[]) => void;
}

const CATEGORY_INFO: Record<DiscoveryCategory, { label: string; icon: React.ReactNode; description: string }> = {
  popular: {
    label: 'Popular',
    icon: <Flame className="w-4 h-4" />,
    description: 'Most viewed and followed series'
  },
  latest: {
    label: 'Latest',
    icon: <Clock className="w-4 h-4" />,
    description: 'Recently updated chapters'
  },
  trending: {
    label: 'Trending',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Hot and rising series'
  },
};

export function DiscoveryPanel({
  open,
  onOpenChange,
  onAddFromDiscovery,
}: DiscoveryPanelProps) {
  const [category, setCategory] = useState<DiscoveryCategory>('popular');
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    const prefs = getSourcePreferences();
    // Filter to only sources that support discovery
    return prefs.filter(id => {
      const source = getSourceById(id);
      return source?.discoveryUrls || id === 'mangadex';
    });
  });
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { toast } = useToast();

  // Sources that support the current category
  const availableSources = getSourcesWithDiscovery(category);

  useEffect(() => {
    if (open && selectedSources.length > 0) {
      loadDiscovery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const loadDiscovery = async () => {
    if (selectedSources.length === 0) {
      toast({
        title: 'No Sources Selected',
        description: 'Please select at least one source',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const data = await discoverFromSources(category, selectedSources);
      setResults(data);
      if (data.length === 0) {
        toast({
          title: 'No Results',
          description: 'No manga found. Try selecting different sources.',
        });
      }
    } catch (error) {
      console.error('Discovery failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discovery. Some sources may be unavailable.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => {
      const next = prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId];
      saveSourcePreferences(next);
      return next;
    });
  };

  const selectAllSources = () => {
    const all = availableSources.map(s => s.id);
    setSelectedSources(all);
    saveSourcePreferences(all);
  };

  const handleSelect = (result: DiscoveryResult) => {
    onAddFromDiscovery(result, results);
  };

  // Group results by source
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.sourceId]) {
      acc[result.sourceId] = [];
    }
    acc[result.sourceId].push(result);
    return acc;
  }, {} as Record<string, DiscoveryResult[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Discover Manga
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as DiscoveryCategory)}>
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(CATEGORY_INFO) as DiscoveryCategory[]).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="flex items-center gap-2">
                {CATEGORY_INFO[cat].icon}
                {CATEGORY_INFO[cat].label}
              </TabsTrigger>
            ))}
          </TabsList>

          <p className="text-xs text-muted-foreground mt-2 mb-3">
            {CATEGORY_INFO[category].description}
          </p>

          {/* Source Selection */}
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <div className="flex items-center gap-2 mb-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 justify-between">
                  <span>
                    Sources ({selectedSources.filter(id => availableSources.some(s => s.id === id)).length}/{availableSources.length} selected)
                  </span>
                  {sourcesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDiscovery}
                disabled={loading || selectedSources.length === 0}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <CollapsibleContent className="mb-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex gap-2 mb-3">
                  <Button variant="ghost" size="sm" onClick={selectAllSources}>
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSources([])}>
                    Deselect All
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`disc-${source.id}`}
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={() => toggleSource(source.id)}
                      />
                      <Label
                        htmlFor={`disc-${source.id}`}
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

          {/* Results */}
          <div className="flex-1 overflow-y-auto min-h-[400px] max-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading from {selectedSources.length} sources...
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedResults).map(([sourceId, sourceResults]) => {
                  const source = getSourceById(sourceId);
                  if (!source) return null;

                  return (
                    <div key={sourceId}>
                      <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background py-1">
                        <Badge className={source.color}>{source.name}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {sourceResults.length} result{sourceResults.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {sourceResults.slice(0, 12).map((result, idx) => (
                          <div
                            key={`${result.sourceId}-${idx}`}
                            className="group relative rounded-lg overflow-hidden bg-card/50 border border-border/50 hover:border-sage/50 transition-colors"
                          >
                            {/* Cover */}
                            <div className="aspect-[3/4] bg-muted relative">
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
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                                  {result.title}
                                </div>
                              )}

                              {/* Rank badge */}
                              {result.rank && result.rank <= 10 && (
                                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                  #{result.rank}
                                </div>
                              )}

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleSelect(result)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button size="sm" variant="outline">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-2">
                              <h4 className="text-xs font-medium leading-tight line-clamp-2">
                                {result.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {result.latestChapter && (
                                  <p className="text-[10px] text-muted-foreground">
                                    Ch. {result.latestChapter}
                                  </p>
                                )}
                                {result.rating && (
                                  <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>{result.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Select sources and click refresh to discover manga</p>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}