import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, User, Clock, Sparkles, Flame } from 'lucide-react';
import type { ScoutedHunter, Guild, PassiveAbility } from '../types';
import { RANK_BG_COLORS, AFFINITY_COLORS } from '../types';
import { scoutingService, hunterService } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { generatePersonality, generateBackstory, generateRegionId, getKingdomIdFromRegionId, getRegionNameFromId } from '../lib/gameHelpers';
import { generateImageWithBanana } from '@/lib/bananaService';
import { uploadImageToStorage } from '@/lib/supabaseStorage';
import { splitHunterImage, processAvatarImage, standardizeImageSize } from '@/lib/imageUtils';
import { generateHunterCombinedPrompt, getRandomGender } from '../lib/hunterImagePrompts';
import { getKingdoms } from '../lib/worldbuildingService';

interface ScoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guild: Guild;
  onHunterRecruited: () => void;
}

export function ScoutDialog({ open, onOpenChange, guild, onHunterRecruited }: ScoutDialogProps) {
  const [scoutedHunters, setScoutedHunters] = useState<ScoutedHunter[]>([]);
  const [loading, setLoading] = useState(true);
  const [recruiting, setRecruiting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadScoutedHunters();
    }
  }, [open]);

  const loadScoutedHunters = async () => {
    setLoading(true);
    try {
      // Check if we need to generate scouts
      const needsGeneration = await scoutingService.needsScoutGeneration(guild.id);

      if (needsGeneration) {
        // Generate new scouts
        const newScouts = await scoutingService.generateScoutedHunters(guild.id, guild.world_level);
        setScoutedHunters(newScouts);
      } else {
        // Load existing scouts
        const scouts = await scoutingService.getScoutedHunters(guild.id);
        setScoutedHunters(scouts);
      }
    } catch (error) {
      console.error('Failed to load scouted hunters:', error);
      toast({
        title: 'Error loading scouts',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecruit = async (scoutedHunter: ScoutedHunter) => {
    if (guild.gold < scoutedHunter.signing_fee) {
      toast({
        title: 'Insufficient Gold',
        description: `You need ${scoutedHunter.signing_fee} gold to recruit ${scoutedHunter.name}.`,
        variant: 'destructive'
      });
      return;
    }

    setRecruiting(scoutedHunter.id);
    try {
      // Generate region ID and gender for the hunter
      const hunterRegionId = generateRegionId();
      const hunterKingdomId = getKingdomIdFromRegionId(hunterRegionId);
      const hunterRegionName = getRegionNameFromId(hunterRegionId);
      const hunterGender = getRandomGender();

      // Fetch kingdom data for palette
      const kingdoms = await getKingdoms();
      const kingdom = kingdoms.find(k => k.id === hunterKingdomId);

      // Generate image prompt with kingdom palette
      const imagePrompt = generateHunterCombinedPrompt(
        {
          name: scoutedHunter.name,
          rank: scoutedHunter.rank,
          hunterClass: scoutedHunter.class
        },
        kingdom?.colors && kingdom?.theme ? {
          colors: kingdom.colors,
          theme: kingdom.theme,
          regionName: kingdom.name
        } : undefined,
        hunterGender
      );

      toast({
        title: 'Generating Hunter Image...',
        description: 'Creating avatar and splash art',
      });

      // Get API key from environment
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('ScoutDialog: API key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not configured');
      }

      console.log('ScoutDialog: Prompt length:', imagePrompt.length);

      // Generate image with Banana AI
      const combinedBase64 = await generateImageWithBanana({
        prompt: imagePrompt,
        apiKey: apiKey
      });

      toast({
        title: 'Processing images...',
        description: 'Splitting, standardizing, and optimizing character artwork',
      });

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

      // Upload both processed and original images to storage
      const userId = guild.user_id;
      const [avatarUrl, splashArtUrl, originalSplashArtUrl] = await Promise.all([
        uploadImageToStorage(processedAvatar, userId, 'hunter-images'),
        uploadImageToStorage(standardizedSplashArt, userId, 'hunter-images'),
        uploadImageToStorage(combinedBase64, userId, 'hunter-images'), // Keep original for re-cropping
      ]);

      // Generate personality and backstory (using region name for text)
      const personality = generatePersonality();
      const backstory = generateBackstory(
        scoutedHunter.name,
        scoutedHunter.class,
        scoutedHunter.rank,
        hunterRegionName,
        hunterGender,
        personality
      );

      // Recruit the hunter
      const result = await scoutingService.recruitScoutedHunter(guild.id, scoutedHunter.id);

      if (result.success && result.hunter_id) {
        // Update the hunter with IDs (not names) for dynamic lookup
        await hunterService.updateHunter(result.hunter_id, {
          avatar_url: avatarUrl,
          splash_art_url: splashArtUrl,
          original_splash_art_url: originalSplashArtUrl, // Save original for re-cropping
          kingdom_id: hunterKingdomId,  // Store ID
          region_id: hunterRegionId,     // Store ID
          gender: hunterGender,
          personality,
          backstory
        });

        toast({
          title: 'Hunter Recruited!',
          description: `${scoutedHunter.name} has joined your guild for ${result.signing_fee} gold.`,
        });
        onHunterRecruited();
        await loadScoutedHunters(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to recruit hunter');
      }
    } catch (error) {
      console.error('Failed to recruit hunter:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as Record<string, unknown>).message)
        : 'An unknown error occurred';
      toast({
        title: 'Recruitment Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setRecruiting(null);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Available Hunters
          </DialogTitle>
          <DialogDescription>
            These hunters refresh weekly or when you scout again
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading available hunters...
            </div>
          ) : scoutedHunters.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hunters available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scoutedHunters.map((hunter) => (
                <Card
                  key={hunter.id}
                  className={`${RANK_BG_COLORS[hunter.rank]} border-2`}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{hunter.name}</h3>
                        <Badge variant="outline" className="font-bold">
                          {hunter.rank}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{hunter.class}</span>
                        <span className="text-muted-foreground">Lv.{hunter.level}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">STR</span>
                        <span className="font-bold">{hunter.strength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AGI</span>
                        <span className="font-bold">{hunter.agility}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">INT</span>
                        <span className="font-bold">{hunter.intelligence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VIT</span>
                        <span className="font-bold">{hunter.vitality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HP</span>
                        <span className="font-bold">{hunter.max_hp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MP</span>
                        <span className="font-bold">{hunter.max_mana}</span>
                      </div>
                    </div>

                    {/* Affinities */}
                    {hunter.affinities && hunter.affinities.length > 0 && (
                      <div className="border-t pt-2">
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          Affinities
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {hunter.affinities.map((affinity, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={`text-[10px] px-1 py-0 ${AFFINITY_COLORS[affinity]}`}
                            >
                              {affinity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Innate Ability */}
                    {hunter.innate_abilities && hunter.innate_abilities.length > 0 && (() => {
                      try {
                        const ability: PassiveAbility = JSON.parse(hunter.innate_abilities[0]);
                        return (
                          <div className="border-t pt-2">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Innate
                            </div>
                            <div className="text-xs">
                              <div className="font-bold text-purple-400">{ability.name}</div>
                              <div className="text-muted-foreground text-[10px] line-clamp-2">
                                {ability.description}
                              </div>
                            </div>
                          </div>
                        );
                      } catch {
                        return null;
                      }
                    })()}

                    {/* Costs */}
                    <div className="space-y-1 text-xs border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          Signing Fee
                        </span>
                        <span className={`font-bold ${guild.gold >= hunter.signing_fee ? 'text-green-500' : 'text-red-500'}`}>
                          {hunter.signing_fee.toLocaleString()}g
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Weekly Salary</span>
                        <span className="font-bold">{hunter.base_salary.toLocaleString()}g</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires
                        </span>
                        <span className="font-bold text-orange-500">
                          {getTimeRemaining(hunter.expires_at)}
                        </span>
                      </div>
                    </div>

                    {/* Recruit Button */}
                    <Button
                      className="w-full"
                      onClick={() => handleRecruit(hunter)}
                      disabled={guild.gold < hunter.signing_fee || recruiting === hunter.id}
                    >
                      {recruiting === hunter.id ? 'Recruiting...' : 'Recruit'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
