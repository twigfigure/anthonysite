import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Zap,
  Sword,
  Shield,
  TrendingUp,
  Dumbbell,
  Wind,
  Brain,
  Clover,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Hunter } from '../types';
import { RANK_COLORS } from '../types';
import { calculateCombatPower, getExpForLevel } from '../lib/gameHelpers';
import { hunterService } from '../lib/supabase';
import { deleteImageFromStorage } from '@/lib/supabaseStorage';
import { useState } from 'react';

interface HunterDetailsProps {
  hunter: Hunter;
  onUpdate: () => void;
}

export function HunterDetails({ hunter, onUpdate }: HunterDetailsProps) {
  const combatPower = calculateCombatPower(hunter);
  const expForNextLevel = getExpForLevel(hunter.level + 1);
  const expProgress = (hunter.experience / expForNextLevel) * 100;
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse passive ability
  const passiveAbility = hunter.innate_abilities && hunter.innate_abilities.length > 0
    ? JSON.parse(hunter.innate_abilities[0] as string)
    : null;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${hunter.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete images from storage if they exist
      if (hunter.avatar_url) {
        try {
          await deleteImageFromStorage(hunter.avatar_url);
        } catch (err) {
          console.error('Failed to delete avatar:', err);
        }
      }

      if (hunter.splash_art_url) {
        try {
          await deleteImageFromStorage(hunter.splash_art_url);
        } catch (err) {
          console.error('Failed to delete splash art:', err);
        }
      }

      // Delete hunter from database
      await hunterService.deleteHunter(hunter.id);

      toast({
        title: 'Hunter deleted',
        description: `${hunter.name} has been removed from your guild`,
      });

      // Trigger refresh
      onUpdate();
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Failed to delete hunter',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Left Side - Splash Art */}
      <div className="relative md:w-1/2 h-[600px] rounded-tl-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden flex items-center justify-center bg-muted">
        {/* Splash Art */}
        {hunter.splash_art_url ? (
          <img
            src={hunter.splash_art_url}
            alt={`${hunter.name} splash art`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center">
            <div className="text-white/30 text-8xl">
              <Heart className="w-32 h-32" />
            </div>
          </div>
        )}

        {/* Character Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{hunter.name}</h2>
              <p className="text-white/80">{hunter.class}</p>
              {hunter.region && (
                <p className="text-white/60 text-sm mt-1">{hunter.region}</p>
              )}
            </div>
            <Badge variant="outline" className={`${RANK_COLORS[hunter.rank]} text-lg px-3 py-1 border-2`}>
              {hunter.rank}
            </Badge>
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          <span className="text-sm">Lv.</span>
          <span className="text-2xl font-bold ml-1">{hunter.level}</span>
        </div>
      </div>

      {/* Right Side - Stats Panel */}
      <div className="md:w-1/2 p-6 space-y-4 overflow-y-auto max-h-[600px]">
        {/* Combat Power */}
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Combat Power</span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {combatPower.toLocaleString()}
            </span>
          </div>
        </div>

        {/* HP and Mana */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="text-muted-foreground">HP</span>
              </span>
              <span className="font-medium">{hunter.current_hp} / {hunter.max_hp}</span>
            </div>
            <Progress value={(hunter.current_hp / hunter.max_hp) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">MP</span>
              </span>
              <span className="font-medium">{hunter.current_mana} / {hunter.max_mana}</span>
            </div>
            <Progress value={(hunter.current_mana / hunter.max_mana) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                <span className="text-muted-foreground">EXP</span>
              </span>
              <span className="font-medium">{hunter.experience} / {expForNextLevel}</span>
            </div>
            <Progress value={expProgress} className="h-2" />
          </div>
        </div>

        <Separator />

        {/* Base Stats */}
        <div>
          <h3 className="text-xs font-semibold mb-1 text-muted-foreground">Base Stats</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <StatRow
              icon={<Dumbbell className="h-3 w-3 text-red-500" />}
              label="STR"
              value={hunter.strength}
            />
            <StatRow
              icon={<Wind className="h-3 w-3 text-green-500" />}
              label="AGI"
              value={hunter.agility}
            />
            <StatRow
              icon={<Brain className="h-3 w-3 text-blue-500" />}
              label="INT"
              value={hunter.intelligence}
            />
            <StatRow
              icon={<Heart className="h-3 w-3 text-pink-500" />}
              label="VIT"
              value={hunter.vitality}
            />
            <StatRow
              icon={<Clover className="h-3 w-3 text-yellow-500" />}
              label="LUK"
              value={hunter.luck}
            />
          </div>
        </div>

        <Separator />

        {/* Combat Stats */}
        <div>
          <h3 className="text-xs font-semibold mb-1 text-muted-foreground">Combat Stats</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <StatRow
              icon={<Sword className="h-3 w-3 text-orange-500" />}
              label="ATK"
              value={hunter.attack_power}
            />
            <StatRow
              icon={<Zap className="h-3 w-3 text-blue-500" />}
              label="MAG"
              value={hunter.magic_power}
            />
            <StatRow
              icon={<Shield className="h-3 w-3 text-gray-500" />}
              label="DEF"
              value={hunter.defense}
            />
            <StatRow
              icon={<Shield className="h-3 w-3 text-purple-500" />}
              label="M.RES"
              value={hunter.magic_resistance}
            />
          </div>
        </div>

        {/* Passive Ability */}
        {passiveAbility && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Passive Ability</h3>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                      {passiveAbility.name}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {passiveAbility.description}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {passiveAbility.effect}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {hunter.death_count > 0 && (
          <>
            <Separator />
            <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <span className="text-sm text-muted-foreground">Death Count</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">{hunter.death_count}</span>
            </div>
          </>
        )}

        {/* Delete Hunter Button */}
        <Separator />
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Hunter'}
        </Button>
      </div>
    </div>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatRow({ icon, label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
