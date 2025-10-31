import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { GuildWithOwner } from '../../types/admin';
import type { Hunter } from '../../types';

export function GuildsTab() {
  const [guilds, setGuilds] = useState<GuildWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGuild, setExpandedGuild] = useState<string | null>(null);
  const [guildHunters, setGuildHunters] = useState<Record<string, Hunter[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadGuilds();
  }, []);

  async function loadGuilds() {
    try {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get owner emails and hunter counts
      const guildsWithData = await Promise.all(
        (data || []).map(async (guild) => {
          // Get owner email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', guild.user_id)
            .single();

          // Get hunter count
          const { count } = await supabase
            .from('hunters')
            .select('*', { count: 'exact', head: true })
            .eq('guild_id', guild.id);

          return {
            ...guild,
            owner_email: profile?.email || 'Unknown',
            hunter_count: count || 0
          };
        })
      );

      setGuilds(guildsWithData);
    } catch (error: any) {
      toast({
        title: 'Error loading guilds',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadGuildHunters(guildId: string) {
    if (guildHunters[guildId]) {
      return; // Already loaded
    }

    try {
      const { data, error } = await supabase
        .from('hunters')
        .select('*')
        .eq('guild_id', guildId);

      if (error) throw error;

      setGuildHunters(prev => ({
        ...prev,
        [guildId]: data || []
      }));
    } catch (error: any) {
      toast({
        title: 'Error loading hunters',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  function toggleGuild(guildId: string) {
    if (expandedGuild === guildId) {
      setExpandedGuild(null);
    } else {
      setExpandedGuild(guildId);
      loadGuildHunters(guildId);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading guilds...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Guilds ({guilds.length})</CardTitle>
          <CardDescription>
            Overview of all player guilds and their statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Guild Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>World Level</TableHead>
                  <TableHead>Gold</TableHead>
                  <TableHead>Hunters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No guilds found
                    </TableCell>
                  </TableRow>
                ) : (
                  guilds.map((guild) => (
                    <>
                      <TableRow
                        key={guild.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleGuild(guild.id)}
                      >
                        <TableCell>
                          {expandedGuild === guild.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{guild.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {guild.owner_email}
                        </TableCell>
                        <TableCell>{guild.region}</TableCell>
                        <TableCell>{guild.level}</TableCell>
                        <TableCell>
                          <Badge variant="outline">WL {guild.world_level}</Badge>
                        </TableCell>
                        <TableCell>{guild.gold.toLocaleString()}g</TableCell>
                        <TableCell>{guild.hunter_count}</TableCell>
                      </TableRow>
                      {expandedGuild === guild.id && guildHunters[guild.id] && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/20">
                            <div className="p-4">
                              <h4 className="font-semibold mb-3">Hunters</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {guildHunters[guild.id].map((hunter) => (
                                  <Card key={hunter.id}>
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium">{hunter.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {hunter.class} • Level {hunter.level}
                                          </p>
                                        </div>
                                        <Badge>{hunter.rank}</Badge>
                                      </div>
                                      <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
                                        <div>
                                          <div className="text-muted-foreground">STR</div>
                                          <div className="font-medium">{hunter.strength}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">AGI</div>
                                          <div className="font-medium">{hunter.agility}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">INT</div>
                                          <div className="font-medium">{hunter.intelligence}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">VIT</div>
                                          <div className="font-medium">{hunter.vitality}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">LCK</div>
                                          <div className="font-medium">{hunter.luck}</div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}