import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { clearCache } from '../../lib/worldbuildingService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

// Define types for worldbuilding data
interface Kingdom {
  id: string;
  name: string;
  description: string;
  ruler: string;
  capital: string;
  culture: string;
  government: string;
  colors?: string; // Color palette for image generation
  theme?: string; // Visual theme for image generation
}

interface Region {
  id: string;
  kingdom_id: string;
  name: string;
  description: string;
  climate: string;
  terrain: string;
  key_features: string;
}

interface Ruler {
  id: string;
  kingdom_id: string;
  name: string;
  title: string;
  personality: string;
  background: string;
  goals: string;
}


export function BackstoryTab() {
  const [activeTab, setActiveTab] = useState<'kingdoms' | 'regions' | 'rulers'>('kingdoms');
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [rulers, setRulers] = useState<Ruler[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingKingdom, setEditingKingdom] = useState<Kingdom | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    loadKingdoms();
    loadRegions();
  }, []);

  async function loadKingdoms() {
    try {
      const { data, error } = await supabase
        .from('kingdoms')
        .select('*')
        .order('name');

      if (error) throw error;
      setKingdoms(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading kingdoms',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadRegions() {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (error: any) {
      console.error('Error loading regions:', error);
    }
  }

  // Kingdom CRUD operations
  const handleAddKingdom = () => {
    const newKingdom: Kingdom = {
      id: `kingdom-${Date.now()}`,
      name: '',
      description: '',
      ruler: '',
      capital: '',
      culture: '',
      government: '',
      colors: '',
      theme: ''
    };
    setEditingKingdom(newKingdom);
    setIsDialogOpen(true);
  };

  const handleEditKingdom = (kingdom: Kingdom) => {
    setEditingKingdom({ ...kingdom });
    setIsDialogOpen(true);
  };

  const handleSaveKingdom = async () => {
    if (!editingKingdom) return;

    setSaving(true);
    try {
      const existingKingdom = kingdoms.find(k => k.id === editingKingdom.id);

      if (existingKingdom) {
        // Update existing
        const { error } = await supabase
          .from('kingdoms')
          .update({
            name: editingKingdom.name,
            description: editingKingdom.description,
            ruler: editingKingdom.ruler,
            capital: editingKingdom.capital,
            culture: editingKingdom.culture,
            government: editingKingdom.government,
            colors: editingKingdom.colors,
            theme: editingKingdom.theme,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingKingdom.id);

        if (error) throw error;

        toast({
          title: 'Kingdom updated',
          description: `${editingKingdom.name} has been updated successfully.`
        });
      } else {
        // Insert new
        const { error } = await supabase
          .from('kingdoms')
          .insert([editingKingdom]);

        if (error) throw error;

        toast({
          title: 'Kingdom created',
          description: `${editingKingdom.name} has been created successfully.`
        });
      }

      clearCache(); // Clear cache so game sees updated data
      await loadKingdoms();
      setIsDialogOpen(false);
      setEditingKingdom(null);
    } catch (error: any) {
      toast({
        title: 'Error saving kingdom',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKingdom = async (id: string) => {
    const kingdom = kingdoms.find(k => k.id === id);
    if (!confirm(`Are you sure you want to delete ${kingdom?.name}? This will also delete all associated regions.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('kingdoms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Kingdom deleted',
        description: `${kingdom?.name} has been deleted successfully.`
      });

      clearCache(); // Clear cache so game sees updated data
      await loadKingdoms();
      await loadRegions();
    } catch (error: any) {
      toast({
        title: 'Error deleting kingdom',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>World Building Database</CardTitle>
          <CardDescription>
            Manage kingdoms, regions, rulers, and world-building variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kingdoms">Kingdoms</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="rulers">Rulers</TabsTrigger>
            </TabsList>

            <TabsContent value="kingdoms" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Kingdoms ({kingdoms.length})</h3>
                <Button onClick={handleAddKingdom} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Kingdom
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Ruler</TableHead>
                      <TableHead>Capital</TableHead>
                      <TableHead>Government</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kingdoms.map((kingdom) => (
                      <TableRow key={kingdom.id}>
                        <TableCell className="font-medium">{kingdom.name}</TableCell>
                        <TableCell>{kingdom.ruler}</TableCell>
                        <TableCell>{kingdom.capital}</TableCell>
                        <TableCell>{kingdom.government}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditKingdom(kingdom)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteKingdom(kingdom.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="regions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Regions ({regions.length})</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Region
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Region management coming soon...</p>
            </TabsContent>

            <TabsContent value="rulers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Rulers ({rulers.length})</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ruler
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Ruler management coming soon...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Kingdom Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingKingdom?.name ? `Edit ${editingKingdom.name}` : 'New Kingdom'}
            </DialogTitle>
            <DialogDescription>
              Configure kingdom details and worldbuilding variables
            </DialogDescription>
          </DialogHeader>

          {editingKingdom && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kingdom Name</Label>
                <Input
                  id="name"
                  value={editingKingdom.name}
                  onChange={(e) => setEditingKingdom({ ...editingKingdom, name: e.target.value })}
                  placeholder="Northern Empire"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingKingdom.description}
                  onChange={(e) => setEditingKingdom({ ...editingKingdom, description: e.target.value })}
                  placeholder="A harsh, militaristic empire..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruler">Ruler Name</Label>
                  <Input
                    id="ruler"
                    value={editingKingdom.ruler}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, ruler: e.target.value })}
                    placeholder="Emperor Dimitri Blaiddyd"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital">Capital City</Label>
                  <Input
                    id="capital"
                    value={editingKingdom.capital}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, capital: e.target.value })}
                    placeholder="Frostspire Keep"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="culture">Culture</Label>
                  <Input
                    id="culture"
                    value={editingKingdom.culture}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, culture: e.target.value })}
                    placeholder="Germanic/Nordic warrior culture"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="government">Government Type</Label>
                  <Input
                    id="government"
                    value={editingKingdom.government}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, government: e.target.value })}
                    placeholder="Imperial Monarchy"
                  />
                </div>
              </div>

              {/* Visual Theme for Image Generation */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Visual Theme (Image Generation)</h4>
                  <p className="text-xs text-muted-foreground">
                    Configure color palette and aesthetic for AI-generated hunter images from this kingdom
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Color Palette</Label>
                  <Textarea
                    id="colors"
                    value={editingKingdom.colors || ''}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, colors: e.target.value })}
                    placeholder="deep navy blues, silver, white, and icy blues"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    List of colors that define this kingdom's visual identity
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Visual Theme</Label>
                  <Textarea
                    id="theme"
                    value={editingKingdom.theme || ''}
                    onChange={(e) => setEditingKingdom({ ...editingKingdom, theme: e.target.value })}
                    placeholder="cold, regal, disciplined military aesthetic"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Aesthetic style and cultural vibe for character designs
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveKingdom} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Kingdom'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}