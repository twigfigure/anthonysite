import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Check, X, AlertTriangle, TrendingUp, Skull } from 'lucide-react';
import type { Hunter, Guild, RankUpRequirement } from '../types';
import {
  getRankUpConfig,
  getNextRank,
  checkAllRequirements,
  attemptRankUp
} from '../lib/rankUpSystem';
import { rankUpService, activityLogService } from '../lib/supabase';

interface RankUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hunter: Hunter;
  guild: Guild;
  onSuccess: () => void;
}

export function RankUpDialog({
  open,
  onOpenChange,
  hunter,
  guild,
  onSuccess,
}: RankUpDialogProps) {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isAttempting, setIsAttempting] = useState(false);
  const [requirementsCheck, setRequirementsCheck] = useState<{
    canRankUp: boolean;
    requirements: Array<RankUpRequirement & { met: boolean; current: number; required: number }>;
  } | null>(null);
  const nextRank = getNextRank(hunter.rank);
  const config = getRankUpConfig(hunter.rank);

  useEffect(() => {
    if (open) {
      checkRequirements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hunter.id]);

  const checkRequirements = async () => {
    setIsChecking(true);
    try {
      const result = await checkAllRequirements(hunter, {
        gold: guild.gold,
        crystals: guild.crystals
      });
      setRequirementsCheck(result);
    } catch (error) {
      console.error('Failed to check requirements:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAttemptRankUp = async () => {
    if (!config || !nextRank || !requirementsCheck?.canRankUp) return;

    setIsAttempting(true);

    try {
      // Deduct costs first
      const goldCost = config.requirements.find(r => r.type === 'gold_cost')?.value || 0;
      const crystalCost = config.requirements.find(r => r.type === 'crystal_cost')?.value || 0;

      if (goldCost > 0 || crystalCost > 0) {
        await rankUpService.deductCosts(guild.id, goldCost, crystalCost);
      }

      // Attempt the rank up
      const result = attemptRankUp(config);

      if (result.success) {
        // Success! Update hunter rank
        await rankUpService.processRankUp(hunter.id, nextRank);

        // Log successful rank up
        await activityLogService.createLog(
          hunter.id,
          'rank_up',
          `${hunter.name} successfully ascended from ${hunter.rank}-rank to ${nextRank}-rank! (Rolled ${result.rolled}% vs ${result.required}% required)`,
          {
            from_rank: hunter.rank,
            to_rank: nextRank,
            roll: result.rolled,
            required: result.required
          }
        );

        toast({
          title: 'Rank Up Successful!',
          description: `${hunter.name} is now ${nextRank}-rank! They reset to level 1.`,
        });

        onSuccess();
        onOpenChange(false);
      } else {
        // Failure - apply penalties
        if (config.failure_penalty) {
          await rankUpService.applyFailurePenalty(
            hunter.id,
            guild.id,
            config.failure_penalty
          );

          // Check for death
          if (config.failure_penalty.death_chance) {
            const deathRoll = Math.random();
            if (deathRoll <= config.failure_penalty.death_chance) {
              // Hunter died during rank up attempt
              await activityLogService.createLog(
                hunter.id,
                'died',
                `${hunter.name} died during a failed ${nextRank}-rank ascension attempt.`,
                { cause: 'rank_up_failure' }
              );

              toast({
                title: 'Rank Up Failed - Hunter Died',
                description: `${hunter.name} did not survive the ${nextRank}-rank ascension. (Rolled ${result.rolled}% vs ${result.required}% required)`,
                variant: 'destructive',
              });

              onSuccess();
              onOpenChange(false);
              return;
            }
          }
        }

        // Log failed attempt
        await activityLogService.createLog(
          hunter.id,
          'rank_up_failed',
          `${hunter.name} failed to ascend to ${nextRank}-rank. (Rolled ${result.rolled}% vs ${result.required}% required)`,
          {
            from_rank: hunter.rank,
            attempted_rank: nextRank,
            roll: result.rolled,
            required: result.required,
            penalties: config.failure_penalty
          }
        );

        toast({
          title: 'Rank Up Failed',
          description: `${hunter.name} failed the ${nextRank}-rank ascension. Penalties applied. (Rolled ${result.rolled}% vs ${result.required}% required)`,
          variant: 'destructive',
        });

        onSuccess();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsAttempting(false);
    }
  };

  if (!config || !nextRank) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Rank Up: {hunter.rank} → {nextRank}
          </DialogTitle>
          <DialogDescription>
            Attempt to ascend {hunter.name} to {nextRank}-rank
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success Rate */}
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-lg font-bold text-purple-400">
                {Math.floor(config.success_rate * 100)}%
              </span>
            </div>
            <Progress value={config.success_rate * 100} className="h-2" />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400">Requirements</h3>
            {isChecking ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Checking requirements...
              </div>
            ) : (
              <div className="space-y-2">
                {requirementsCheck?.requirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 p-3 rounded-lg border-2 ${
                      req.met
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    {req.met ? (
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{req.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.current.toLocaleString()} / {req.required.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Failure Penalties */}
          {config.failure_penalty && (
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-bold text-red-400">Failure Penalties</h3>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {config.failure_penalty.lose_experience && (
                  <li>• All experience will be lost</li>
                )}
                {config.failure_penalty.lose_gold && (
                  <li>• Lose {config.failure_penalty.lose_gold.toLocaleString()} gold</li>
                )}
                {config.failure_penalty.death_chance && (
                  <li className="flex items-center gap-1">
                    <Skull className="h-3 w-3 text-red-500" />
                    {Math.floor(config.failure_penalty.death_chance * 100)}% chance of death
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAttempting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAttemptRankUp}
            disabled={isChecking || isAttempting || !requirementsCheck?.canRankUp}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isAttempting ? 'Attempting...' : 'Attempt Rank Up'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
