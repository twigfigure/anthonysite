import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Sparkles } from 'lucide-react';
import type { Guild, Hunter, PortalDifficulty } from '../types';
import { DIFFICULTY_COLORS } from '../types';

interface PortalListProps {
  guild: Guild;
  hunters: Hunter[];
}

export function PortalList({ guild, hunters }: PortalListProps) {
  // Mock portal data for now - will be replaced with actual data later
  const availablePortals = getPortalsForWorldLevel(guild.world_level);

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
  portal: MockPortal;
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

// Mock portal interface and data generator
interface MockPortal {
  id: string;
  name: string;
  difficulty: PortalDifficulty;
  worldLevel: number;
  isBoss: boolean;
  minLevel: number;
  recommendedHunters: number;
  timeMinutes: number;
  baseGold: number;
  baseExp: number;
}

function getPortalsForWorldLevel(worldLevel: number): MockPortal[] {
  const portals: MockPortal[] = [];

  // World Level 1 portals
  if (worldLevel === 1) {
    portals.push(
      {
        id: '1',
        name: 'Goblin Cave',
        difficulty: 'Blue',
        worldLevel: 1,
        isBoss: false,
        minLevel: 1,
        recommendedHunters: 1,
        timeMinutes: 15,
        baseGold: 100,
        baseExp: 50,
      },
      {
        id: '2',
        name: 'Spider Den',
        difficulty: 'Blue',
        worldLevel: 1,
        isBoss: false,
        minLevel: 1,
        recommendedHunters: 2,
        timeMinutes: 20,
        baseGold: 150,
        baseExp: 75,
      },
      {
        id: '3',
        name: 'Ancient Ruins',
        difficulty: 'Blue',
        worldLevel: 1,
        isBoss: false,
        minLevel: 2,
        recommendedHunters: 1,
        timeMinutes: 25,
        baseGold: 200,
        baseExp: 100,
      },
      {
        id: '4',
        name: 'Orc Stronghold',
        difficulty: 'Green',
        worldLevel: 1,
        isBoss: true,
        minLevel: 3,
        recommendedHunters: 3,
        timeMinutes: 45,
        baseGold: 500,
        baseExp: 300,
      }
    );
  }

  // World Level 2+ - progressively harder
  if (worldLevel >= 2) {
    const levelMultiplier = worldLevel - 1;

    portals.push(
      {
        id: `wl${worldLevel}-1`,
        name: 'Dark Forest',
        difficulty: worldLevel === 2 ? 'Green' : 'Yellow',
        worldLevel,
        isBoss: false,
        minLevel: 5 + levelMultiplier * 5,
        recommendedHunters: 2,
        timeMinutes: 20,
        baseGold: 300 * worldLevel,
        baseExp: 150 * worldLevel,
      },
      {
        id: `wl${worldLevel}-2`,
        name: 'Cursed Temple',
        difficulty: worldLevel === 2 ? 'Green' : worldLevel === 3 ? 'Yellow' : 'Orange',
        worldLevel,
        isBoss: false,
        minLevel: 7 + levelMultiplier * 5,
        recommendedHunters: 3,
        timeMinutes: 30,
        baseGold: 500 * worldLevel,
        baseExp: 250 * worldLevel,
      },
      {
        id: `wl${worldLevel}-boss`,
        name: `Level ${worldLevel} Boss Portal`,
        difficulty: worldLevel === 2 ? 'Yellow' : worldLevel === 3 ? 'Orange' : 'Red',
        worldLevel,
        isBoss: true,
        minLevel: 10 + levelMultiplier * 5,
        recommendedHunters: 5,
        timeMinutes: 60,
        baseGold: 2000 * worldLevel,
        baseExp: 1000 * worldLevel,
      }
    );
  }

  return portals;
}
