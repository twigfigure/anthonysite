import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { PortalTemplate } from '../../types';

export function PortalsTab() {
  const [portals, setPortals] = useState<PortalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPortals();
  }, []);

  async function loadPortals() {
    try {
      const { data, error } = await supabase
        .from('portal_templates')
        .select('*')
        .order('world_level', { ascending: true });

      if (error) throw error;
      setPortals(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading portals',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredPortals = portals.filter(portal =>
    portal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading portals...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Portal Templates</CardTitle>
              <CardDescription>
                Manage portal templates that spawn in the game
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Portal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search portals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>World Level</TableHead>
                    <TableHead>Boss</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Rewards</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPortals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No portals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPortals.map((portal) => (
                      <TableRow key={portal.id}>
                        <TableCell className="font-medium">{portal.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{portal.difficulty}</Badge>
                        </TableCell>
                        <TableCell>WL {portal.world_level}</TableCell>
                        <TableCell>
                          {portal.is_major_boss ? (
                            <Badge variant="destructive">Major Boss</Badge>
                          ) : portal.is_boss_portal ? (
                            <Badge variant="secondary">Boss</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>Level {portal.min_hunter_level}</TableCell>
                        <TableCell>
                          {portal.base_gold}g / {portal.base_experience}xp
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
