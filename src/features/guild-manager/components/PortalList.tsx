import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Sparkles, MapPin } from 'lucide-react';
import type { Guild, Hunter, PortalDifficulty } from '../types';
import { DIFFICULTY_COLORS } from '../types';
import { generatePortalsForRegion, type GeneratedPortal } from '../lib/portalGeneration';

interface PortalListProps {
  guild: Guild;
  hunters: Hunter[];
}

export function PortalList({ guild, hunters }: PortalListProps) {
  // Extract region from guild.region (format: "kingdom-id:region-id")
  const regionId = guild.region.split(':')[1] || guild.region;
  const availablePortals = generatePortalsForRegion(regionId, guild.world_level);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Portals</CardTitle>
          <CardDescription>
            World Level {guild.world_level} portals and dungeons
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePortals.map((portal) => (
          <PortalCard key={portal.id} portal={portal} guild={guild} hunters={hunters} />
        ))}
      </div>
    </div>
  );
}

interface PortalCardProps {
  portal: GeneratedPortal;
  guild: Guild;
  hunters: Hunter[];
}

function PortalCard({ portal, guild, hunters }: PortalCardProps) {
  const availableHunters = hunters.filter(h => !h.is_assigned && !h.is_dead);

  return (
    <Card className={`border-2 ${portal.difficulty === 'Black' ? 'border-red-500' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Portal Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{portal.name}</h3>
              <Badge className={`${DIFFICULTY_COLORS[portal.difficulty]} text-white`}>
                {portal.difficulty}
              </Badge>
            </div>
            {portal.isBoss && (
              <Flame className="h-6 w-6 text-red-500" />
            )}
          </div>

          {/* Portal Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min Level:</span>
              <span className="font-medium">{portal.minLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recommended:</span>
              <span className="font-medium">{portal.recommendedHunters} hunters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{portal.timeMinutes} min</span>
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 space-y-1">
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
              <Sparkles className="h-3 w-3" />
              Rewards
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gold:</span>
                <span className="text-yellow-400 font-medium">
                  {portal.baseGold.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EXP:</span>
                <span className="text-purple-400 font-medium">
                  {portal.baseExp.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full"
            disabled={availableHunters.length === 0}
            variant={portal.isBoss ? 'destructive' : 'default'}
          >
            {availableHunters.length === 0 ? 'No Hunters Available' : 'Assign Hunters'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

