import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';
import type { Guild, Hunter } from '../types';
import { RANK_BG_COLORS } from '../types';
import { HunterDetails } from './HunterDetails';
import { RecruitHunterDialog } from './RecruitHunterDialog';
import { ScoutDialog } from './ScoutDialog';
import { scoutingService } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface HunterListProps {
  hunters: Hunter[];
  guild: Guild;
  onHunterUpdate: () => void;
}

export function HunterList({ hunters, guild, onHunterUpdate }: HunterListProps) {
  const [selectedHunter, setSelectedHunter] = useState<Hunter | null>(null);
  const [showRecruitDialog, setShowRecruitDialog] = useState(false);
  const [showScoutDialog, setShowScoutDialog] = useState(false);
  const [scouting, setScouting] = useState(false);
  const { toast } = useToast();

  const canRecruitMore = hunters.length < guild.max_hunters;

  const handleScout = async () => {
    setScouting(true);
    try {
      // Generate new scouts (unlimited for testing)
      await scoutingService.generateScoutedHunters(guild.id, guild.world_level);

      toast({
        title: 'Scouts Refreshed!',
        description: 'New hunters are now available for recruitment.',
      });

      // Open the scout dialog
      setShowScoutDialog(true);

      // Refresh guild data
      onHunterUpdate();
    } catch (error) {
      console.error('Failed to scout:', error);
      toast({
        title: 'Scouting Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setScouting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Hunter Avatar Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Hunter Roster</CardTitle>
              <CardDescription>
                {hunters.length} / {guild.max_hunters} hunters
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScout}
                disabled={scouting}
              >
                {scouting ? 'Scouting...' : 'Scout'}
              </Button>
              <Button
                onClick={() => setShowRecruitDialog(true)}
                disabled={!canRecruitMore}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Recruit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hunters.length === 0 ? (
            <div className="p-12 text-center">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No hunters in your guild yet.</p>
              <Button onClick={() => setShowRecruitDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Recruit Your First Hunter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {hunters.map((hunter) => (
                <HunterAvatar
                  key={hunter.id}
                  hunter={hunter}
                  isSelected={selectedHunter?.id === hunter.id}
                  onClick={() => setSelectedHunter(hunter)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Side - Selected Hunter Details */}
      <Card className="lg:sticky lg:top-4 h-fit">
        <CardContent className="p-0">
          {selectedHunter ? (
            <HunterDetails hunter={selectedHunter} guild={guild} onUpdate={onHunterUpdate} />
          ) : (
            <div className="p-12 text-center">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a hunter to view details</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recruit Hunter Dialog */}
      <RecruitHunterDialog
        open={showRecruitDialog}
        onOpenChange={setShowRecruitDialog}
        guild={guild}
        onRecruit={onHunterUpdate}
      />

      {/* Scout Dialog */}
      <ScoutDialog
        open={showScoutDialog}
        onOpenChange={setShowScoutDialog}
        guild={guild}
        onHunterRecruited={onHunterUpdate}
      />
    </div>
  );
}

interface HunterAvatarProps {
  hunter: Hunter;
  isSelected: boolean;
  onClick: () => void;
}

function HunterAvatar({ hunter, isSelected, onClick }: HunterAvatarProps) {
  const isDead = hunter.is_dead;
  const isAssigned = hunter.is_assigned;

  return (
    <button
      onClick={onClick}
      className={`relative aspect-square rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
        isSelected ? 'ring-4 ring-purple-500 scale-105' : 'ring-2 ring-border'
      } ${isDead ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Avatar/Portrait */}
      {hunter.avatar_url ? (
        <img
          src={hunter.avatar_url}
          alt={hunter.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${
          hunter.rank === 'SSS' || hunter.rank === 'SS' || hunter.rank === 'S' ? 'from-yellow-400 to-orange-500' :
          hunter.rank === 'A' || hunter.rank === 'B' ? 'from-purple-400 to-blue-500' :
          'from-gray-400 to-gray-600'
        } flex items-center justify-center`}>
          <User className="w-1/2 h-1/2 text-white/80" />
        </div>
      )}

      {/* Rank Badge */}
      <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold text-white ${RANK_BG_COLORS[hunter.rank]}`}>
        {hunter.rank}
      </div>

      {/* Level Badge */}
      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-bold border-2 border-white/30">
        Lv.{hunter.level}
      </div>

      {/* Status Indicator */}
      {(isDead || isAssigned) && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] text-center py-0.5">
          {isDead ? '💀 Dead' : '⚔️ Mission'}
        </div>
      )}

      {/* Name Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-6 pb-1 px-1">
        <p className="text-white text-xs font-semibold truncate text-center">
          {hunter.name}
        </p>
      </div>
    </button>
  );
}
