import { Card, CardContent } from '@/components/ui/card';
import { Users, Coins, Trophy, TrendingUp } from 'lucide-react';
import type { Guild, Hunter } from '../types';
import { formatGold } from '../lib/gameHelpers';

interface GuildOverviewProps {
  guild: Guild;
  hunters: Hunter[];
}

export function GuildOverview({ guild, hunters }: GuildOverviewProps) {
  const activeHunters = hunters.filter(h => !h.is_dead && !h.is_assigned).length;
  const assignedHunters = hunters.filter(h => h.is_assigned).length;
  const deadHunters = hunters.filter(h => h.is_dead).length;

  // Calculate total weekly upkeep for all hunters (excluding dead ones)
  const totalWeeklyUpkeep = hunters
    .filter(h => !h.is_dead)
    .reduce((sum, h) => sum + (h.upkeep_cost || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Guild Level */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300">Guild Level</p>
              <p className="text-3xl font-bold text-foreground">{guild.level}</p>
            </div>
            <Trophy className="h-12 w-12 text-purple-500" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Influence: {guild.influence.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gold */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Gold</p>
              <p className="text-3xl font-bold text-foreground">{formatGold(guild.gold)}</p>
            </div>
            <Coins className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              Crystals: {guild.crystals}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Weekly Upkeep: {formatGold(totalWeeklyUpkeep)} gold
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hunters */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">Hunters</p>
              <p className="text-3xl font-bold text-foreground">
                {hunters.length}/{guild.max_hunters}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-green-700 dark:text-green-400">Active: {activeHunters}</span>
            <span className="text-orange-700 dark:text-orange-400">Assigned: {assignedHunters}</span>
            {deadHunters > 0 && <span className="text-red-700 dark:text-red-400">Dead: {deadHunters}</span>}
          </div>
        </CardContent>
      </Card>

      {/* World Level */}
      <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-300">World Level</p>
              <p className="text-3xl font-bold text-foreground">{guild.world_level}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-red-500" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-red-600 dark:text-red-400">
              Max Level: 10
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
