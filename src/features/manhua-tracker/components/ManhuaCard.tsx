import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Star, ExternalLink, ChevronDown, ChevronUp, Trash2, Edit2, BookOpen } from 'lucide-react';
import type { ManhuaWithSources, ManhuaStatus, ManhuaSource } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../types';
import { getSourceByUrl } from '../lib/sources';

interface ManhuaCardProps {
  manhua: ManhuaWithSources;
  onEdit: (manhua: ManhuaWithSources) => void;
  onDelete: (id: string) => void;
  onUpdateChapter: (id: string, chapter: number) => void;
  onUpdateRating: (id: string, rating: number) => void;
  onUpdateStatus: (id: string, status: ManhuaStatus) => void;
}

export function ManhuaCard({
  manhua,
  onEdit,
  onDelete,
  onUpdateChapter,
  onUpdateRating,
  onUpdateStatus,
}: ManhuaCardProps) {
  const [showSources, setShowSources] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [chapterInput, setChapterInput] = useState(manhua.current_chapter.toString());
  const chapterInputRef = useRef<HTMLInputElement>(null);

  // Get sources that have chapterUrl defined
  const sourcesWithChapterUrl = manhua.sources.filter(s => {
    const config = getSourceByUrl(s.website_url);
    return config?.chapterUrl;
  });

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingChapter && chapterInputRef.current) {
      chapterInputRef.current.focus();
      chapterInputRef.current.select();
    }
  }, [isEditingChapter]);

  // Update input when chapter changes externally
  useEffect(() => {
    setChapterInput(manhua.current_chapter.toString());
  }, [manhua.current_chapter]);

  const handleChapterInputSubmit = () => {
    const newChapter = parseInt(chapterInput, 10);
    if (!isNaN(newChapter) && newChapter >= 0) {
      onUpdateChapter(manhua.id, newChapter);
    } else {
      setChapterInput(manhua.current_chapter.toString());
    }
    setIsEditingChapter(false);
  };

  const handleChapterInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChapterInputSubmit();
    } else if (e.key === 'Escape') {
      setChapterInput(manhua.current_chapter.toString());
      setIsEditingChapter(false);
    }
  };

  const getChapterUrl = (source: ManhuaSource, chapter: number) => {
    const config = getSourceByUrl(source.website_url);
    if (config?.chapterUrl) {
      return config.chapterUrl(source.website_url, chapter);
    }
    return source.website_url;
  };

  const maxChapterFromSources = manhua.sources.length > 0
    ? Math.max(...manhua.sources.map(s => s.latest_chapter))
    : null;

  const hasNewChapters = maxChapterFromSources !== null && maxChapterFromSources > manhua.current_chapter;

  const renderStars = (rating: number | null) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      const isFilled = rating !== null && i <= rating;
      stars.push(
        <button
          key={i}
          onClick={() => onUpdateRating(manhua.id, i)}
          className="focus:outline-none transition-transform hover:scale-125"
        >
          <Star
            className={`w-4 h-4 ${
              isFilled
                ? 'text-amber-400'
                : 'text-gray-500 hover:text-amber-300'
            }`}
            fill={isFilled ? '#fbbf24' : 'none'}
          />
        </button>
      );
    }
    return stars;
  };

  // Format as relative time (e.g., "2h ago", "3d ago")
  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;

    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-sage/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Cover Image */}
          <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-charcoal/50">
            {manhua.cover_image_url ? (
              <img
                src={manhua.cover_image_url}
                alt={manhua.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-2">
                No Cover
              </div>
            )}
            {hasNewChapters && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {manhua.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded-md border cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[manhua.status]}`}
                  >
                    {STATUS_LABELS[manhua.status]}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(Object.keys(STATUS_LABELS) as ManhuaStatus[]).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => onUpdateStatus(manhua.id, status)}
                      className={`cursor-pointer ${manhua.status === status ? 'bg-accent' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[status].split(' ')[0]}`} />
                      {STATUS_LABELS[status]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {renderStars(manhua.rating)}
              {manhua.rating && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {manhua.rating}/10
                </span>
              )}
            </div>

            {/* Chapter Progress */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Chapter:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onUpdateChapter(manhua.id, Math.max(0, manhua.current_chapter - 1))}
                >
                  -
                </Button>
                {isEditingChapter ? (
                  <Input
                    ref={chapterInputRef}
                    type="number"
                    min="0"
                    value={chapterInput}
                    onChange={(e) => setChapterInput(e.target.value)}
                    onBlur={handleChapterInputSubmit}
                    onKeyDown={handleChapterInputKeyDown}
                    className="w-16 h-7 text-center font-mono text-sm p-1"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingChapter(true)}
                    className="w-16 text-center font-mono text-sm hover:bg-muted/50 rounded px-1 py-0.5 transition-colors cursor-text"
                    title="Click to edit chapter"
                  >
                    {manhua.current_chapter}
                    {manhua.total_chapters && ` / ${manhua.total_chapters}`}
                  </button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onUpdateChapter(manhua.id, manhua.current_chapter + 1)}
                >
                  +
                </Button>
              </div>
              {hasNewChapters && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                  +{maxChapterFromSources! - manhua.current_chapter} new
                </Badge>
              )}
              {/* Read Next Chapter Button with Source Selection */}
              {sourcesWithChapterUrl.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 px-2 text-xs bg-sage hover:bg-sage/80"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Read Ch. {manhua.current_chapter + 1}
                      {sourcesWithChapterUrl.length > 1 && (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel className="text-xs">Select Source</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sourcesWithChapterUrl.map((source) => {
                      const config = getSourceByUrl(source.website_url);
                      return (
                        <DropdownMenuItem key={source.id} asChild>
                          <a
                            href={getChapterUrl(source, manhua.current_chapter + 1)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-4 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${config?.color?.split(' ')[0] || 'bg-gray-500'}`} />
                              {source.website_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ch. {source.latest_chapter}
                            </span>
                          </a>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Description */}
            {manhua.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {manhua.description}
              </p>
            )}

            {/* Sources Toggle */}
            {manhua.sources.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 self-start h-7 px-2 text-xs"
                onClick={() => setShowSources(!showSources)}
              >
                {showSources ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                {manhua.sources.length} source{manhua.sources.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(manhua)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(manhua.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sources Panel */}
        {showSources && manhua.sources.length > 0 && (
          <div className="border-t border-border/50 bg-charcoal/30 px-4 py-3">
            <div className="space-y-2">
              {manhua.sources.map(source => (
                <div
                  key={source.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <a
                      href={source.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sage hover:underline"
                    >
                      {source.website_name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="font-medium">Ch. {source.latest_chapter}</span>
                    {formatRelativeTime(source.last_updated) && (
                      <span className="text-green-400" title="When source released latest chapter">
                        {formatRelativeTime(source.last_updated)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
