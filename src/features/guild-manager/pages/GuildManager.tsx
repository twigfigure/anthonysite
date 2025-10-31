import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { guildService, hunterService } from '../lib/supabase';
import type { Guild, Hunter } from '../types';
import { HunterList } from '../components/HunterList';
import { PortalList } from '../components/PortalList';
import { GuildOverview } from '../components/GuildOverview';

export default function GuildManager() {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

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
      let guildData = await guildService.getGuildByUserId(user.id);

      // If no guild exists, create a starter guild
      if (!guildData) {
        guildData = await createStarterGuild();
      }

      setGuild(guildData);
    } catch (error: any) {
      toast({
        title: 'Error loading guild',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function createStarterGuild() {
    try {
      // Create guild
      const newGuild = await guildService.createGuild(
        user.id,
        `${user.email?.split('@')[0]}'s Guild`,
        'Central Region'
      );

      // Create starter B-rank hunter
      await hunterService.createHunter({
        guild_id: newGuild.id,
        name: 'Starter Hunter',
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
        magic_resistance: 30
      });

      // Create administrative vice-guild master
      await hunterService.createHunter({
        guild_id: newGuild.id,
        name: 'Guild Administrator',
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
        magic_resistance: 35
      });

      toast({
        title: 'Welcome to Guild Manager!',
        description: 'Your guild has been created with a starter hunter.',
      });

      return newGuild;
    } catch (error: any) {
      toast({
        title: 'Error creating guild',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  }

  async function loadHunters() {
    try {
      const hunterData = await hunterService.getGuildHunters(guild!.id);
      setHunters(hunterData);
    } catch (error: any) {
      toast({
        title: 'Error loading hunters',
        description: error.message,
        variant: 'destructive'
      });
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
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Retry
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
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Return Home
          </Button>
        </div>

        {/* Guild Overview Stats */}
        <GuildOverview guild={guild} hunters={hunters} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="hunters" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="hunters">Hunters</TabsTrigger>
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

          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guild Inventory</CardTitle>
                <CardDescription>
                  Materials, equipment, and resources
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
