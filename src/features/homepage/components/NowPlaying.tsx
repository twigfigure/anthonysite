import { Music, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";

const NowPlaying = () => {
  // Mock data - would be replaced with actual Spotify API integration
  const currentTrack = {
    isPlaying: true,
    title: "Weightless",
    artist: "Marconi Union",
    album: "Weightless",
    albumArt: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber/10 border border-amber/20 rounded-full">
          <Music className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber" />
          <span className="text-[10px] sm:text-xs font-mono text-amber">Now Playing</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
          Current Soundscape
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          What I'm listening to right now
        </p>
      </div>

      <Card className="p-3 sm:p-5 bg-card/80 backdrop-blur-sm border-border active:border-amber/30 sm:hover:border-amber/30 transition-all duration-300 mb-4 sm:mb-6">
        {currentTrack.isPlaying ? (
          <div className="flex gap-3 sm:gap-4 items-start">
            {/* Album Art */}
            <div className="relative group flex-shrink-0">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-lg overflow-hidden shadow-md">
                <img
                  src={currentTrack.albumArt}
                  alt={`${currentTrack.album} album art`}
                  className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-110"
                />
              </div>
              {/* Playing indicator */}
              <div className="absolute -bottom-1 -right-1 bg-amber text-charcoal rounded-full p-1 sm:p-1.5 shadow-md">
                <Headphones className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 font-mono">Playing</p>
              <h3 className="text-base sm:text-lg font-bold mb-0.5 truncate">{currentTrack.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1 truncate">{currentTrack.artist}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">from <span className="italic">{currentTrack.album}</span></p>

              {/* Animated equalizer bars */}
              <div className="flex gap-0.5 items-end h-4 sm:h-6 mt-1.5 sm:mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 sm:w-1 bg-amber rounded-full"
                    style={{
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                      height: '100%',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Music className="w-6 sm:w-8 h-6 sm:h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              Currently enjoying the quiet.
            </p>
          </div>
        )}
      </Card>

      {/* Recent favorites preview */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Recent Favorites</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((item) => (
            <Card
              key={item}
              className="p-2 sm:p-3 bg-card/50 border-border active:border-sage/30 sm:hover:border-sage/30 transition-all duration-200 active:scale-[0.98] sm:hover:scale-105 cursor-pointer group"
            >
              <div className="aspect-square bg-muted rounded-md mb-1 sm:mb-1.5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-sage/20 to-dusk/20 group-active:from-sage/30 group-active:to-dusk/30 sm:group-hover:from-sage/30 sm:group-hover:to-dusk/30 transition-all duration-200" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground text-center truncate">Track {item}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
