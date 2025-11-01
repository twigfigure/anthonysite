import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { guildService, hunterService } from '../lib/supabase';
import type { Guild, Hunter } from '../types';
import type { User } from '@supabase/supabase-js';
import { HunterList } from '../components/HunterList';
import { PortalList } from '../components/PortalList';
import { GuildOverview } from '../components/GuildOverview';
import { GuildInventory } from '../components/GuildInventory';
import { GuildOnboarding } from '../components/GuildOnboarding';
import { generateKingdomName } from '../lib/kingdomsData';
import { generateAffinities, initializeWorldbuilding } from '../lib/gameHelpers';
import { generatePassiveAbility } from '../lib/passiveAbilities';
import { generateHunterAvatarUrl, generateHunterSplashUrl } from '../lib/hunterImagePrompts';

export default function GuildManager() {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [worldbuildingReady, setWorldbuildingReady] = useState(false);
  const { toast } = useToast();

  // Initialize worldbuilding data from database on component mount
  useEffect(() => {
    initializeWorldbuilding().then(() => {
      setWorldbuildingReady(true);
    }).catch((error) => {
      console.error('Failed to initialize worldbuilding, using fallback data:', error);
      setWorldbuildingReady(true); // Still set to true so UI loads
    });
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadGuild();
    }
  }, [user]);

  useEffect(() => {
    if (guild) {
      loadHunters();
    }
  }, [guild]);

  // When worldbuilding is ready, stop loading if guild is already loaded
  useEffect(() => {
    if (worldbuildingReady && (guild || showOnboarding)) {
      setLoading(false);
    }
  }, [worldbuildingReady, guild, showOnboarding]);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to play Guild Manager',
        variant: 'destructive'
      });
    }
  }

  async function loadGuild() {
    try {
      const guildData = await guildService.getGuildByUserId(user!.id);

      // If no guild exists, show onboarding
      if (!guildData) {
        setShowOnboarding(true);
        // Wait for worldbuilding to be ready before finishing load
        if (worldbuildingReady) {
          setLoading(false);
        }
        return;
      }

      setGuild(guildData);
    } catch (error) {
      toast({
        title: 'Error loading guild',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      // Only stop loading if worldbuilding is ready
      if (worldbuildingReady) {
        setLoading(false);
      }
    }
  }

  async function handleOnboardingComplete(guildName: string, kingdomId: string, regionId: string) {
    try {
      setLoading(true);
      const guildData = await createStarterGuild(guildName, `${kingdomId}:${regionId}`);
      setGuild(guildData);
      setShowOnboarding(false);

      toast({
        title: 'Welcome to Guild Manager!',
        description: `Your guild "${guildName}" has been established in the ${regionId.replace(/-/g, ' ')}.`,
      });
    } catch (error) {
      toast({
        title: 'Error creating guild',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function createStarterGuild(guildName: string, region: string) {
    try {
      // Create guild
      const newGuild = await guildService.createGuild(
        user.id,
        guildName,
        region
      );

      // Extract kingdom ID from region (format: "kingdom-id:region-id")
      const kingdomId = region.split(':')[0];

      // Generate B-rank fighter with region-appropriate name
      const fighterName = generateKingdomName(kingdomId);
      const fighterAffinities = generateAffinities('B');
      const fighterPassive = generatePassiveAbility('B', 'Fighter');
      const fighterAvatarUrl = generateHunterAvatarUrl('B', 'Fighter', kingdomId);
      const fighterSplashUrl = generateHunterSplashUrl('B', 'Fighter', kingdomId);

      await hunterService.createHunter({
        guild_id: newGuild.id,
        name: fighterName,
        rank: 'B',
        class: 'Fighter',
        level: 10,
        strength: 50,
        agility: 40,
        intelligence: 30,
        vitality: 60,
        luck: 25,
        max_hp: 500,
        current_hp: 500,
        max_mana: 200,
        current_mana: 200,
        attack_power: 80,
        magic_power: 40,
        defense: 50,
        magic_resistance: 30,
        affinities: fighterAffinities,
        innate_abilities: [JSON.stringify(fighterPassive)],
        avatar_url: fighterAvatarUrl,
        splash_art_url: fighterSplashUrl
      });

      // Generate C-rank support with region-appropriate name
      const supportName = generateKingdomName(kingdomId);
      const supportAffinities = generateAffinities('C');
      const supportPassive = generatePassiveAbility('C', 'Support');
      const supportAvatarUrl = generateHunterAvatarUrl('C', 'Support', kingdomId);
      const supportSplashUrl = generateHunterSplashUrl('C', 'Support', kingdomId);

      await hunterService.createHunter({
        guild_id: newGuild.id,
        name: supportName,
        rank: 'C',
        class: 'Support',
        level: 5,
        strength: 20,
        agility: 30,
        intelligence: 40,
        vitality: 35,
        luck: 30,
        max_hp: 300,
        current_hp: 300,
        max_mana: 250,
        current_mana: 250,
        attack_power: 25,
        magic_power: 50,
        defense: 20,
        magic_resistance: 35,
        affinities: supportAffinities,
        innate_abilities: [JSON.stringify(supportPassive)],
        avatar_url: supportAvatarUrl,
        splash_art_url: supportSplashUrl
      });

      toast({
        title: 'Welcome to Guild Manager!',
        description: 'Your guild has been created with starter hunters.',
      });

      return newGuild;
    } catch (error) {
      toast({
        title: 'Error creating guild',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
      throw error;
    }
  }

  async function loadHunters() {
    try {
      const hunterData = await hunterService.getGuildHunters(guild!.id);
      setHunters(hunterData);
    } catch (error) {
      toast({
        title: 'Error loading hunters',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  }

  async function handleResetAccount() {
    if (!guild) return;

    const confirmed = window.confirm(
      'Are you sure you want to reset your account? This will delete your guild and all hunters. This action cannot be undone!'
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await guildService.deleteGuild(guild.id);
      setGuild(null);
      setHunters([]);
      setShowOnboarding(true);

      toast({
        title: 'Account Reset',
        description: 'Your guild has been deleted. You can now start fresh!',
      });
    } catch (error) {
      toast({
        title: 'Error resetting account',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access Guild Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showOnboarding) {
    return <GuildOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!guild) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Guild</CardTitle>
            <CardDescription>
              There was a problem loading your guild data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button onClick={() => setShowOnboarding(true)} variant="outline">
              Create New Guild
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{guild.name}</h1>
            <p className="text-purple-200">{guild.region} • World Level {guild.world_level}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/guild-manager/admin'} variant="secondary">
              Admin
            </Button>
            <Button onClick={handleResetAccount} variant="destructive">
              Reset Account
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Return Home
            </Button>
          </div>
        </div>

        {/* Guild Overview Stats */}
        <GuildOverview guild={guild} hunters={hunters} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="hunters" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="hunters">Guild Lodge</TabsTrigger>
            <TabsTrigger value="portals">Portals</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="hunters" className="mt-6">
            <HunterList
              hunters={hunters}
              guild={guild}
              onHunterUpdate={loadHunters}
            />
          </TabsContent>

          <TabsContent value="portals" className="mt-6">
            <PortalList guild={guild} hunters={hunters} />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <GuildInventory guildId={guild.id} hunters={hunters} />
          </TabsContent>

          <TabsContent value="buildings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guild Buildings</CardTitle>
                <CardDescription>
                  Construct and upgrade buildings to enhance your guild
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
