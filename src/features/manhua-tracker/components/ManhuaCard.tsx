import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import type { ManhuaWithSources, ManhuaStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

interface ManhuaCardProps {
  manhua: ManhuaWithSources;
  onEdit: (manhua: ManhuaWithSources) => void;
  onDelete: (id: string) => void;
  onUpdateChapter: (id: string, chapter: number) => void;
  onUpdateRating: (id: string, rating: number) => void;
}

export function ManhuaCard({
  manhua,
  onEdit,
  onDelete,
  onUpdateChapter,
  onUpdateRating,
}: ManhuaCardProps) {
  const [showSources, setShowSources] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const maxChapterFromSources = manhua.sources.length > 0
    ? Math.max(...manhua.sources.map(s => s.latest_chapter))
    : null;

  const hasNewChapters = maxChapterFromSources !== null && maxChapterFromSources > manhua.current_chapter;

  const renderStars = (rating: number | null) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => onUpdateRating(manhua.id, i)}
          className="focus:outline-none transition-transform hover:scale-125"
        >
          <Star
            className={`w-4 h-4 ${
              rating !== null && i <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-500 hover:text-amber-300'
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
              <Badge className={`flex-shrink-0 text-xs ${STATUS_COLORS[manhua.status]}`}>
                {STATUS_LABELS[manhua.status]}
              </Badge>
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
            <div className="mt-3 flex items-center gap-2">
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
                <span className="w-16 text-center font-mono text-sm">
                  {manhua.current_chapter}
                  {manhua.total_chapters && ` / ${manhua.total_chapters}`}
                </span>
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
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>Ch. {source.latest_chapter}</span>
                    <span className="text-xs">Updated: {formatDate(source.last_updated)}</span>
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
