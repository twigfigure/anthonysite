import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { hunterService, activityLogService } from '../lib/supabase';
import { generateRandomHunterName, generatePersonality, generateBackstory, generateAffinities, getWeeklyUpkeepCost } from '../lib/gameHelpers';
import { generateHunterCombinedPrompt, getRandomRegion, getRandomGender } from '../lib/hunterImagePrompts';
import { generatePassiveAbility } from '../lib/passiveAbilities';
import { generateImageWithBanana } from '@/lib/bananaService';
import { uploadImageToStorage } from '@/lib/supabaseStorage';
import { splitHunterImage, processAvatarImage, standardizeImageSize } from '@/lib/imageUtils';
import type { Guild, HunterRank, HunterClass } from '../types';

interface RecruitHunterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guild: Guild;
  onRecruit: () => void;
}

export function RecruitHunterDialog({
  open,
  onOpenChange,
  guild,
  onRecruit,
}: RecruitHunterDialogProps) {
  const [name, setName] = useState('');
  const [rank, setRank] = useState<HunterRank>('D');
  const [hunterClass, setHunterClass] = useState<HunterClass>('Fighter');
  const [isRecruiting, setIsRecruiting] = useState(false);
  const { toast } = useToast();

  const handleRandomName = () => {
    setName(generateRandomHunterName());
  };

  const handleRecruit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the hunter',
        variant: 'destructive',
      });
      return;
    }

    setIsRecruiting(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const userId = guild.user_id;

      // Randomly select a region and gender for visual variety
      const hunterRegion = getRandomRegion();
      const hunterGender = getRandomGender();

      // Generate combined image prompt with region and gender
      const combinedPrompt = generateHunterCombinedPrompt({
        name: name.trim(),
        rank,
        hunterClass,
      }, hunterRegion, hunterGender);

      toast({
        title: 'Generating hunter artwork...',
        description: 'Creating character sheet with avatar and splash art',
      });

      // Generate single combined image
      const combinedBase64 = await generateImageWithBanana({
        prompt: combinedPrompt,
        apiKey
      });

      toast({
        title: 'Processing images...',
        description: 'Splitting, standardizing, and optimizing character artwork',
      });

      // TODO: Background removal is disabled due to performance issues
      // Enable this if you want truly transparent backgrounds (adds ~10-20s processing time)
      // const transparentCombined = await removeImageBackground(combinedBase64);

      // Split the combined image into avatar and splash art
      const { avatar, splashArt } = await splitHunterImage(combinedBase64);

      // Standardize splash art with tight character crop
      const standardizedSplashArt = await standardizeImageSize(splashArt);

      // Process avatar with proper portrait framing (ensures head isn't cut off)
      const processedAvatar = await processAvatarImage(avatar);

      toast({
        title: 'Uploading images...',
        description: 'Storing hunter images',
      });

      // Upload both images to storage
      const [avatarUrl, splashArtUrl] = await Promise.all([
        uploadImageToStorage(processedAvatar, userId, 'hunter-images'),
        uploadImageToStorage(standardizedSplashArt, userId, 'hunter-images'),
      ]);

      // Calculate base stats based on rank and class
      const baseStats = calculateBaseStats(rank, hunterClass);

      // Generate passive ability
      const passiveAbility = generatePassiveAbility(rank, hunterClass);

      // Generate personality and backstory
      const personality = generatePersonality();
      const backstory = generateBackstory(hunterClass, rank, hunterRegion, hunterGender, personality);

      // Generate affinities based on rank
      const affinities = generateAffinities(rank);

      // Calculate upkeep cost based on rank
      const upkeepCost = getWeeklyUpkeepCost(rank);

      // Create hunter with images, passive ability, region, gender, personality, backstory, affinities, and upkeep
      const newHunter = await hunterService.createHunter({
        guild_id: guild.id,
        name: name.trim(),
        rank,
        class: hunterClass,
        level: 1,
        region: hunterRegion,
        gender: hunterGender,
        personality,
        backstory,
        affinities,
        avatar_url: avatarUrl,
        splash_art_url: splashArtUrl,
        innate_abilities: [JSON.stringify(passiveAbility)],
        upkeep_cost: upkeepCost,
        ...baseStats,
      });

      // Create recruitment log entry
      await activityLogService.createLog(
        newHunter.id,
        'recruited',
        `${name.trim()} joined the guild as a ${rank}-rank ${hunterClass} from ${hunterRegion}.`,
        { rank, class: hunterClass, region: hunterRegion }
      );

      toast({
        title: 'Hunter recruited!',
        description: `${name} has joined your guild with consistent character artwork`,
      });

      // Reset form
      setName('');
      setRank('D');
      setHunterClass('Fighter');

      onRecruit();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to recruit hunter',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsRecruiting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recruit New Hunter</DialogTitle>
          <DialogDescription>
            Add a new hunter to your guild roster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="hunter-name">Hunter Name</Label>
            <div className="flex gap-2">
              <Input
                id="hunter-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter hunter name..."
                maxLength={100}
              />
              <Button variant="outline" onClick={handleRandomName}>
                Random
              </Button>
            </div>
          </div>

          {/* Rank Select */}
          <div className="space-y-2">
            <Label htmlFor="hunter-rank">Rank</Label>
            <Select value={rank} onValueChange={(value) => setRank(value as HunterRank)}>
              <SelectTrigger id="hunter-rank">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="D">D-Rank (Common)</SelectItem>
                <SelectItem value="C">C-Rank (Uncommon)</SelectItem>
                <SelectItem value="B">B-Rank (Rare)</SelectItem>
                <SelectItem value="A">A-Rank (Epic)</SelectItem>
                <SelectItem value="S">S-Rank (Epic)</SelectItem>
                <SelectItem value="SS">SS-Rank (Legendary)</SelectItem>
                <SelectItem value="SSS">SSS-Rank (Mythic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class Select */}
          <div className="space-y-2">
            <Label htmlFor="hunter-class">Class</Label>
            <Select
              value={hunterClass}
              onValueChange={(value) => setHunterClass(value as HunterClass)}
            >
              <SelectTrigger id="hunter-class">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fighter">Fighter (Balanced)</SelectItem>
                <SelectItem value="Tank">Tank (High Defense)</SelectItem>
                <SelectItem value="Mage">Mage (High Magic Power)</SelectItem>
                <SelectItem value="Healer">Healer (Support)</SelectItem>
                <SelectItem value="Assassin">Assassin (High Agility)</SelectItem>
                <SelectItem value="Ranger">Ranger (Ranged DPS)</SelectItem>
                <SelectItem value="Support">Support (Utility)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview Stats */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Preview Base Stats:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(calculateBaseStats(rank, hunterClass)).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRecruiting}>
            Cancel
          </Button>
          <Button onClick={handleRecruit} disabled={isRecruiting}>
            {isRecruiting ? 'Recruiting...' : 'Recruit Hunter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to calculate base stats
function calculateBaseStats(rank: HunterRank, hunterClass: HunterClass) {
  const rankMultipliers: Record<HunterRank, number> = {
    D: 0.9,
    C: 1.0,
    B: 1.2,
    A: 1.5,
    S: 2.0,
    SS: 2.5,
    SSS: 3.0,
  };

  const classBaseStats: Record<
    HunterClass,
    {
      strength: number;
      agility: number;
      intelligence: number;
      vitality: number;
      luck: number;
    }
  > = {
    Fighter: { strength: 15, agility: 12, intelligence: 8, vitality: 14, luck: 10 },
    Tank: { strength: 12, agility: 8, intelligence: 7, vitality: 20, luck: 10 },
    Mage: { strength: 7, agility: 9, intelligence: 18, vitality: 10, luck: 11 },
    Healer: { strength: 6, agility: 10, intelligence: 15, vitality: 12, luck: 13 },
    Assassin: { strength: 12, agility: 18, intelligence: 8, vitality: 9, luck: 11 },
    Ranger: { strength: 11, agility: 16, intelligence: 9, vitality: 11, luck: 10 },
    Support: { strength: 8, agility: 11, intelligence: 13, vitality: 11, luck: 14 },
  };

  const multiplier = rankMultipliers[rank];
  const baseStats = classBaseStats[hunterClass];

  const strength = Math.floor(baseStats.strength * multiplier);
  const agility = Math.floor(baseStats.agility * multiplier);
  const intelligence = Math.floor(baseStats.intelligence * multiplier);
  const vitality = Math.floor(baseStats.vitality * multiplier);
  const luck = Math.floor(baseStats.luck * multiplier);

  // Calculate derived stats
  const max_hp = vitality * 10 + 50;
  const max_mana = intelligence * 5 + 30;
  const attack_power = Math.floor(strength * 1.5 + agility * 0.5);
  const magic_power = Math.floor(intelligence * 1.5);
  const defense = Math.floor(vitality * 0.8 + strength * 0.3);
  const magic_resistance = Math.floor(intelligence * 0.5 + vitality * 0.3);

  return {
    strength,
    agility,
    intelligence,
    vitality,
    luck,
    max_hp,
    current_hp: max_hp,
    max_mana,
    current_mana: max_mana,
    attack_power,
    magic_power,
    defense,
    magic_resistance,
  };
}
