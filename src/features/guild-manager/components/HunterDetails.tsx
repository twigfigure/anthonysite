import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Trash2,
  Star,
  RefreshCw,
  Flame,
  Droplet,
  Mountain,
  Snowflake,
  Hexagon,
  Sparkles,
  Moon,
  FlaskConical,
  ShieldHalf,
  CircleDot,
  Footprints,
  Hand,
  Crown,
  Coins,
  X,
  Pencil
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Hunter, ElementalAffinity, HunterActivityLog, Guild, EquippedItem, EquipmentBonuses } from '../types';
import { RANK_BG_COLORS, AFFINITY_COLORS, RARITY_COLORS } from '../types';
import { calculateCombatPower, getExpForLevel, getMaxLevelForRank, getMaxSpellSlotsForRank, formatGold } from '../lib/gameHelpers';
import { hunterService, activityLogService, equipmentService } from '../lib/supabase';
import { deleteImageFromStorage, uploadImageToStorage } from '@/lib/supabaseStorage';
import { generateHunterCombinedPrompt } from '../lib/hunterImagePrompts';
import { generateImageWithBanana } from '@/lib/bananaService';
import { splitHunterImage, standardizeImageSize, processAvatarImage } from '@/lib/imageUtils';
import { canAttemptRankUp, getRankUpStatusText } from '../lib/rankUpSystem';
import { RankUpDialog } from './RankUpDialog';
import { getKingdoms } from '../lib/worldbuildingService';
import { EquipmentSelector } from './EquipmentSelector';
import { ImageCropDialog } from './ImageCropDialog';
import { useState, useEffect } from 'react';
import type { EquipmentSlot } from '../types';

interface HunterDetailsProps {
  hunter: Hunter;
  guild: Guild;
  onUpdate: () => void;
}

// Helper function to get affinity icon
function getAffinityIcon(affinity: ElementalAffinity) {
  const iconProps = { className: "h-4 w-4" };
  switch (affinity) {
    case 'Fire':
      return <Flame {...iconProps} />;
    case 'Water':
      return <Droplet {...iconProps} />;
    case 'Earth':
      return <Mountain {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'Ice':
      return <Snowflake {...iconProps} />;
    case 'Metal':
      return <Hexagon {...iconProps} />;
    case 'Holy':
      return <Sparkles {...iconProps} />;
    case 'Dark':
      return <Moon {...iconProps} />;
    case 'Lightning':
      return <Zap {...iconProps} />;
    case 'Anima':
      return <FlaskConical {...iconProps} />;
  }
}

export function HunterDetails({ hunter, guild, onUpdate }: HunterDetailsProps) {
  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const [equipmentBonuses, setEquipmentBonuses] = useState<EquipmentBonuses | null>(null);
  const [kingdomName, setKingdomName] = useState<string | null>(null);
  const combatPower = calculateCombatPower(hunter, equipmentBonuses || undefined);
  const maxLevel = getMaxLevelForRank(hunter.rank);
  const maxSpellSlots = getMaxSpellSlotsForRank(hunter.rank);
  const expForNextLevel = getExpForLevel(hunter.level + 1);
  const expProgress = (hunter.experience / expForNextLevel) * 100;
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'spells' | 'equip' | 'profile'>('stats');
  const [activityLogs, setActivityLogs] = useState<HunterActivityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [showRankUpDialog, setShowRankUpDialog] = useState(false);
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot>('Weapon');
  const [cropImageType, setCropImageType] = useState<'avatar' | 'splash' | null>(null);
  const [imageVersion, setImageVersion] = useState<number>(0);
  const canRankUp = canAttemptRankUp(hunter);

  // Track splash art URL changes to force refresh
  const [lastSplashUrl, setLastSplashUrl] = useState<string | null>(hunter.splash_art_url);

  // Load kingdom name when hunter changes
  useEffect(() => {
    const loadKingdomName = async () => {
      if (hunter.kingdom_id) {
        try {
          const kingdoms = await getKingdoms();
          const kingdom = kingdoms.find(k => k.id === hunter.kingdom_id);
          setKingdomName(kingdom?.name || null);
        } catch (error) {
          console.error('Failed to load kingdom:', error);
          setKingdomName(null);
        }
      } else {
        setKingdomName(null);
      }
    };
    loadKingdomName();
  }, [hunter.kingdom_id]);

  useEffect(() => {
    // When hunter changes (different ID), reset version
    setImageVersion(0);
    setLastSplashUrl(hunter.splash_art_url);
  }, [hunter.id]);

  // When splash art URL changes for the same hunter, increment version
  useEffect(() => {
    if (hunter.splash_art_url !== lastSplashUrl) {
      setImageVersion(prev => prev + 1);
      setLastSplashUrl(hunter.splash_art_url);
    }
  }, [hunter.splash_art_url]);

  // Fetch equipped items when component mounts or equip tab is active
  useEffect(() => {
    loadEquippedItems();
  }, [hunter.id]);

  // Fetch activity logs when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile') {
      loadActivityLogs();
    }
  }, [activeTab, hunter.id]);

  const loadEquippedItems = async () => {
    try {
      const [items, bonuses] = await Promise.all([
        equipmentService.getHunterEquippedItems(hunter.id),
        equipmentService.getHunterEquipmentBonuses(hunter.id)
      ]);
      setEquippedItems(items);
      setEquipmentBonuses(bonuses);
    } catch (error) {
      console.error('Failed to load equipped items:', error);
    }
  };

  const getEquippedItemForSlot = (slot: string) => {
    return equippedItems.find(item => item.slot === slot);
  };

  const handleUnequipItem = async (slot: string) => {
    try {
      await equipmentService.unequipItemFromHunter(hunter.id, slot);
      toast({
        title: 'Item unequipped',
        description: `Removed item from ${slot} slot`,
      });
      await loadEquippedItems();
      onUpdate(); // Refresh hunter data
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleOpenEquipmentSelector = (slot: EquipmentSlot) => {
    setSelectedSlot(slot);
    setShowEquipmentSelector(true);
  };

  const handleEquipmentEquipped = async () => {
    await loadEquippedItems();
    onUpdate(); // Refresh hunter data
  };

  const loadActivityLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await activityLogService.getHunterLogs(hunter.id, 20);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

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

  const handleRefreshImages = async () => {
    if (!confirm(`Regenerate avatar and splash art for ${hunter.name}? This will replace the current images.`)) {
      return;
    }

    setIsRegenerating(true);

    try {
      toast({
        title: 'Generating images...',
        description: 'Creating new avatar and splash art',
      });

      // Fetch kingdom data for palette
      const kingdoms = await getKingdoms();
      const kingdom = kingdoms.find(k => k.id === hunter.kingdom_id);

      // Generate image prompt using existing hunter data with kingdom palette
      const imagePrompt = generateHunterCombinedPrompt(
        {
          name: hunter.name,
          rank: hunter.rank,
          hunterClass: hunter.class
        },
        kingdom?.colors && kingdom?.theme ? {
          colors: kingdom.colors,
          theme: kingdom.theme,
          regionName: kingdom.name
        } : undefined,
        hunter.gender || 'Male'
      );

      // Get API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not configured');
      }

      // Generate image with Banana AI
      const combinedBase64 = await generateImageWithBanana({
        prompt: imagePrompt,
        apiKey: apiKey
      });

      toast({
        title: 'Processing images...',
        description: 'Splitting and optimizing artwork',
      });

      // Split the combined image into avatar and splash art
      const { avatar, splashArt } = await splitHunterImage(combinedBase64);

      // Standardize splash art with tight character crop
      const standardizedSplashArt = await standardizeImageSize(splashArt);

      // Process avatar with proper portrait framing
      const processedAvatar = await processAvatarImage(avatar);

      toast({
        title: 'Uploading images...',
        description: 'Storing new images',
      });

      // Upload both processed and original images to storage
      const userId = guild.user_id;
      const [avatarUrl, splashArtUrl, originalSplashArtUrl] = await Promise.all([
        uploadImageToStorage(processedAvatar, userId, 'hunter-images'),
        uploadImageToStorage(standardizedSplashArt, userId, 'hunter-images'),
        uploadImageToStorage(combinedBase64, userId, 'hunter-images'), // Keep original for re-cropping
      ]);

      // Delete old images from storage if they exist (but keep originals)
      if (hunter.avatar_url) {
        try {
          await deleteImageFromStorage(hunter.avatar_url);
        } catch (err) {
          console.error('Failed to delete old avatar:', err);
        }
      }

      if (hunter.splash_art_url) {
        try {
          await deleteImageFromStorage(hunter.splash_art_url);
        } catch (err) {
          console.error('Failed to delete old splash art:', err);
        }
      }

      // Delete old original if it exists
      if (hunter.original_splash_art_url) {
        try {
          await deleteImageFromStorage(hunter.original_splash_art_url);
        } catch (err) {
          console.error('Failed to delete old original splash art:', err);
        }
      }

      // Update hunter record with new image URLs
      await hunterService.updateHunter(hunter.id, {
        avatar_url: avatarUrl,
        splash_art_url: splashArtUrl,
        original_splash_art_url: originalSplashArtUrl,
      });

      toast({
        title: 'Images Regenerated!',
        description: 'New avatar and splash art have been created',
      });

      // Force image refresh by incrementing version
      setImageVersion(prev => prev + 1);

      // Trigger refresh
      onUpdate();
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Failed to regenerate images',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Left Side - Splash Art */}
      <div className="relative md:w-1/2 h-[600px] rounded-tl-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden flex items-center justify-center bg-muted">
        {/* Splash Art */}
        {hunter.splash_art_url ? (
          <img
            key={`splash-${hunter.id}-${imageVersion}`}
            src={imageVersion > 0 ? `${hunter.splash_art_url}?v=${imageVersion}` : hunter.splash_art_url}
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
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{hunter.name}</h2>
            <p className="text-white/80">{hunter.class}</p>
            {kingdomName && (
              <p className="text-white/60 text-sm mt-1">{kingdomName}</p>
            )}
          </div>
        </div>

        {/* Rank Badge and Affinities */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className={`${RANK_BG_COLORS[hunter.rank]} text-white text-lg px-3 py-1 rounded-md font-bold`}>
            {hunter.rank}
          </div>
          {hunter.affinities && hunter.affinities.length > 0 && (
            <div className="flex gap-1">
              {hunter.affinities.map((affinity, index) => (
                <div
                  key={index}
                  className={`bg-black/70 p-1.5 rounded-md ${AFFINITY_COLORS[affinity]}`}
                  title={affinity}
                >
                  {getAffinityIcon(affinity)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level and CP Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-black/80 text-white px-3 py-1 rounded-md font-bold text-lg border-2 border-white/30">
            Lv.{hunter.level}/{maxLevel}
          </div>
          <div className="bg-purple-600/80 text-white px-3 py-1 rounded-md text-center font-bold text-lg">
            {combatPower.toLocaleString()} CP
          </div>
        </div>

        {/* Action Buttons - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {canRankUp && (
            <button
              onClick={() => setShowRankUpDialog(true)}
              className="bg-purple-600/80 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
              aria-label="Rank up"
              title={getRankUpStatusText(hunter)}
            >
              <TrendingUp className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${
              isFavorite
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-black/70 hover:bg-black/90'
            } text-white p-2 rounded-lg transition-colors`}
            aria-label="Favorite"
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          {/* Edit Splash Art Button */}
          {hunter.splash_art_url && (
            <button
              onClick={() => setCropImageType('splash')}
              className="bg-purple-600/80 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
              title="Edit splash art"
              aria-label="Edit splash art"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleRefreshImages}
            disabled={isRegenerating}
            className="bg-blue-600/80 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Regenerate images"
            title="Regenerate avatar and splash art"
          >
            <RefreshCw className={`h-5 w-5 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right Side - Stats Panel */}
      <div className="md:w-1/2 p-6 space-y-4 overflow-y-auto max-h-[600px]">
        {/* Tabs */}
        <div className="bg-purple-500/10 rounded-lg p-1.5 border border-purple-500/20">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('spells')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'spells'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              Spells
            </button>
            <button
              onClick={() => setActiveTab('equip')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'equip'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              Equip
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <>
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
                <Progress value={(hunter.current_hp / hunter.max_hp) * 100} className="h-2 [&>div]:bg-red-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">MP</span>
                  </span>
                  <span className="font-medium">{hunter.current_mana} / {hunter.max_mana}</span>
                </div>
                <Progress value={(hunter.current_mana / hunter.max_mana) * 100} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-purple-500" />
                    <span className="text-muted-foreground">EXP</span>
                  </span>
                  <span className="font-medium">{hunter.experience} / {expForNextLevel}</span>
                </div>
                <Progress
                  value={expProgress}
                  className={`h-2 ${expProgress >= 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-gray-400'}`}
                />
              </div>
            </div>

            <Separator />

            {/* Stats - Two Column Layout */}
            <div>
              <h3 className="text-xs font-semibold mb-1 text-muted-foreground">Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Left Column - Base Stats */}
                <div className="space-y-1">
                  <StatRow
                    icon={<Dumbbell className="h-3 w-3 text-red-500" />}
                    label="STR"
                    value={hunter.strength}
                    bonus={equipmentBonuses?.strength_bonus || 0}
                  />
                  <StatRow
                    icon={<Wind className="h-3 w-3 text-green-500" />}
                    label="AGI"
                    value={hunter.agility}
                    bonus={equipmentBonuses?.agility_bonus || 0}
                  />
                  <StatRow
                    icon={<Brain className="h-3 w-3 text-blue-500" />}
                    label="INT"
                    value={hunter.intelligence}
                    bonus={equipmentBonuses?.intelligence_bonus || 0}
                  />
                  <StatRow
                    icon={<Heart className="h-3 w-3 text-pink-500" />}
                    label="VIT"
                    value={hunter.vitality}
                    bonus={equipmentBonuses?.vitality_bonus || 0}
                  />
                  <StatRow
                    icon={<Clover className="h-3 w-3 text-yellow-500" />}
                    label="LUK"
                    value={hunter.luck}
                    bonus={equipmentBonuses?.luck_bonus || 0}
                  />
                </div>
                {/* Right Column - Combat Stats */}
                <div className="space-y-1">
                  <StatRow
                    icon={<Sword className="h-3 w-3 text-orange-500" />}
                    label="ATK"
                    value={hunter.attack_power}
                    bonus={equipmentBonuses?.attack_bonus || 0}
                  />
                  <StatRow
                    icon={<Zap className="h-3 w-3 text-blue-500" />}
                    label="MAG"
                    value={hunter.magic_power}
                    bonus={equipmentBonuses?.magic_bonus || 0}
                  />
                  <StatRow
                    icon={<Shield className="h-3 w-3 text-gray-500" />}
                    label="DEF"
                    value={hunter.defense}
                    bonus={equipmentBonuses?.defense_bonus || 0}
                  />
                  <StatRow
                    icon={<Shield className="h-3 w-3 text-purple-500" />}
                    label="M.RES"
                    value={hunter.magic_resistance}
                    bonus={equipmentBonuses?.magic_resist_bonus || 0}
                  />
                </div>
              </div>
            </div>

            {/* Weekly Salary */}
            <Separator />
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Coins className="h-3.5 w-3.5 text-yellow-500" />
                Weekly Salary
              </span>
              <span className="font-bold text-yellow-600 dark:text-yellow-500">{formatGold(hunter.upkeep_cost)} gold</span>
            </div>

            {/* Passive Ability */}
            {passiveAbility && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xs font-semibold mb-1 text-muted-foreground">Innate</h3>
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
          </>
        )}

        {activeTab === 'spells' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground">
              Spell Slots ({maxSpellSlots} slots)
            </h3>
            <div className="space-y-1.5">
              {Array.from({ length: maxSpellSlots }).map((_, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-border rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer"
                >
                  <Zap className="h-5 w-5 text-muted-foreground/30 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Empty Slot {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equip' && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">Equipment Slots</h3>
            <div className="space-y-1.5">
              {/* Weapon */}
              {(() => {
                const equipped = getEquippedItemForSlot('Weapon');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Weapon')}
                  >
                    <Sword className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Weapon</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Weapon</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Weapon');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Armor */}
              {(() => {
                const equipped = getEquippedItemForSlot('Armor');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Armor')}
                  >
                    <ShieldHalf className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Armor</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Armor</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Armor');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Helmet */}
              {(() => {
                const equipped = getEquippedItemForSlot('Helmet');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Helmet')}
                  >
                    <Crown className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Helmet</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Helmet</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Helmet');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Boots */}
              {(() => {
                const equipped = getEquippedItemForSlot('Boots');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Boots')}
                  >
                    <Footprints className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Boots</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Boots</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Boots');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Gloves */}
              {(() => {
                const equipped = getEquippedItemForSlot('Gloves');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Gloves')}
                  >
                    <Hand className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Gloves</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Gloves</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Gloves');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Accessory */}
              {(() => {
                const equipped = getEquippedItemForSlot('Accessory');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Accessory')}
                  >
                    <CircleDot className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Accessory</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Accessory</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Accessory');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Artifact */}
              {(() => {
                const equipped = getEquippedItemForSlot('Artifact');
                return (
                  <div
                    className={`border-2 ${equipped ? 'border-purple-500/50 bg-purple-500/5' : 'border-dashed border-border'} rounded-lg p-2 flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors cursor-pointer`}
                    onClick={() => handleOpenEquipmentSelector('Artifact')}
                  >
                    <Sparkles className={`h-5 w-5 flex-shrink-0 ${equipped ? 'text-purple-500' : 'text-muted-foreground/30'}`} />
                    <div className="flex-1 min-w-0">
                      {equipped && equipped.equipment ? (
                        <>
                          <div className={`text-xs font-medium ${RARITY_COLORS[equipped.equipment.rarity]}`}>
                            {equipped.equipment.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Artifact</div>
                        </>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Artifact</div>
                      )}
                    </div>
                    {equipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnequipItem('Artifact');
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-3 space-y-3">
            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-purple-400">Basic Information</h3>
              <div className="space-y-1.5">
                {kingdomName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Origin:</span>
                    <span className="font-medium">{kingdomName}</span>
                  </div>
                )}
                {hunter.gender && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{hunter.gender}</span>
                  </div>
                )}
                {hunter.personality && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Personality:</span>
                    <span className="font-medium capitalize">{hunter.personality}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Backstory */}
            {hunter.backstory && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-purple-400">Backstory</h3>
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs leading-relaxed text-black">
                    {hunter.backstory}
                  </p>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-purple-400">Activity Log</h3>
              <div className="bg-black/20 rounded-lg p-3 max-h-64 overflow-y-auto">
                {isLoadingLogs ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">Loading activity log...</p>
                  </div>
                ) : activityLogs.length > 0 ? (
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="border-l-2 border-purple-500/30 pl-2 py-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-black">
                            {log.description}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(log.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">No activities recorded yet.</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Activities will appear here as the hunter completes missions and events.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Show placeholder if no backstory */}
            {!hunter.backstory && !hunter.personality && (
              <div className="py-4 text-center text-muted-foreground">
                <p className="text-xs">No profile information available for this hunter.</p>
                <p className="text-xs mt-1">New hunters will have backstories generated automatically.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rank Up Dialog */}
      <RankUpDialog
        open={showRankUpDialog}
        onOpenChange={setShowRankUpDialog}
        hunter={hunter}
        guild={guild}
        onSuccess={onUpdate}
      />

      {/* Equipment Selector Dialog */}
      <EquipmentSelector
        open={showEquipmentSelector}
        onOpenChange={setShowEquipmentSelector}
        slot={selectedSlot}
        hunter={hunter}
        onEquip={handleEquipmentEquipped}
      />

      {/* Image Crop Dialog */}
      {cropImageType && (
        <ImageCropDialog
          open={!!cropImageType}
          onOpenChange={(open) => !open && setCropImageType(null)}
          hunter={hunter}
          guild={guild}
          onUpdate={onUpdate}
          imageType={cropImageType}
        />
      )}
    </div>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bonus?: number;
}

function StatRow({ icon, label, value, bonus = 0 }: StatRowProps) {
  const totalValue = value + bonus;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold">{totalValue}</span>
        {bonus !== 0 && (
          <span className={`text-[10px] ${bonus > 0 ? 'text-green-500' : 'text-red-500'}`}>
            ({bonus > 0 ? '+' : ''}{bonus})
          </span>
        )}
      </div>
    </div>
  );
}
