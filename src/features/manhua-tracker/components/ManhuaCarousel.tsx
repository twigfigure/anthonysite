import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ManhuaWithSources } from '../types';

interface ManhuaCarouselProps {
  title: string;
  icon: 'history' | 'new';
  items: ManhuaWithSources[];
  onItemClick: (manhua: ManhuaWithSources) => void;
  emptyMessage?: string;
}

export function ManhuaCarousel({
  title,
  icon,
  items,
  onItemClick,
  emptyMessage: _emptyMessage = 'No items to show',
}: ManhuaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon === 'history' ? (
            <Clock className="w-5 h-5 text-sage" />
          ) : (
            <Sparkles className="w-5 h-5 text-amber-400" />
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((manhua) => {
          const maxSourceChapter = manhua.sources.length > 0
            ? Math.max(...manhua.sources.map((s) => s.latest_chapter))
            : 0;
          const hasNewChapter = maxSourceChapter > manhua.current_chapter;
          const newChaptersCount = hasNewChapter ? maxSourceChapter - manhua.current_chapter : 0;

          return (
            <div
              key={manhua.id}
              className="flex-shrink-0 w-32 cursor-pointer group"
              onClick={() => onItemClick(manhua)}
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-2">
                {manhua.cover_image_url ? (
                  <img
                    src={manhua.cover_image_url}
                    alt={manhua.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                    {manhua.title}
                  </div>
                )}

                {/* New chapter badge */}
                {hasNewChapter && (
                  <Badge className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                    +{newChaptersCount}
                  </Badge>
                )}

                {/* Current chapter overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                  <span className="text-white text-xs">
                    Ch. {manhua.current_chapter}
                    {maxSourceChapter > 0 && ` / ${maxSourceChapter}`}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-sage transition-colors">
                {manhua.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
