import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sword,
  Shield,
  Sparkles,
  Package,
  Search,
  ArrowUpDown,
  Filter,
  User,
  X
} from 'lucide-react';
import type { Equipment, Material, GuildMaterial, EquipmentRarity, EquipmentSlot, Hunter } from '../types';
import { RARITY_COLORS } from '../types';
import { equipmentService } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { seedEquipment } from '../lib/seedEquipment';
import { EquipmentDetails } from './EquipmentDetails';

interface GuildInventoryProps {
  guildId: string;
  hunters: Hunter[];
}

type SortField = 'name' | 'rarity' | 'slot' | 'level';
type SortDirection = 'asc' | 'desc';

export function GuildInventory({ guildId, hunters }: GuildInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<EquipmentRarity | 'all'>('all');
  const [slotFilter, setSlotFilter] = useState<EquipmentSlot | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [materials, setMaterials] = useState<GuildMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInventory();
  }, [guildId]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      // Load all available equipment in the game
      const equipmentData = await equipmentService.getAllEquipment();

      // If no equipment exists, seed the database
      if (equipmentData.length === 0) {
        toast({
          title: 'Seeding equipment...',
          description: 'First time setup - adding equipment to the game',
        });

        const seedResult = await seedEquipment();
        if (seedResult.success) {
          // Reload equipment after seeding
          const newEquipmentData = await equipmentService.getAllEquipment();
          setEquipment(newEquipmentData);

          toast({
            title: 'Equipment loaded!',
            description: `Added ${newEquipmentData.length} items to the game`,
          });
        } else {
          throw new Error('Failed to seed equipment');
        }
      } else {
        setEquipment(equipmentData);
      }

      // TODO: Load guild materials when material system is implemented
      // const materialsData = await materialService.getGuildMaterials(guildId);
      // setMaterials(materialsData);
      setMaterials([]);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      toast({
        title: 'Error loading inventory',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort equipment
  const filteredEquipment = equipment
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || item.rarity === rarityFilter;
      const matchesSlot = slotFilter === 'all' || item.slot === slotFilter;
      return matchesSearch && matchesRarity && matchesSlot;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rarity': {
          const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
          comparison = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
          break;
        }
        case 'slot':
          comparison = a.slot.localeCompare(b.slot);
          break;
        case 'level':
          comparison = a.required_level - b.required_level;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEquipToHunter = async (equipmentId: string, hunterId: string) => {
    try {
      // Get the equipment to know its slot
      const equipmentItem = equipment.find(e => e.id === equipmentId);
      if (!equipmentItem) {
        throw new Error('Equipment not found');
      }

      // Equip the item
      await equipmentService.equipItemToHunter(hunterId, equipmentId, equipmentItem.slot);

      toast({
        title: 'Equipment equipped!',
        description: `${equipmentItem.name} has been equipped to the hunter.`,
      });

      // Close the dialog
      setSelectedEquipment(null);

      // Refresh if needed
      // Note: You may want to trigger a refresh of the hunter's data here
    } catch (error) {
      console.error('Failed to equip item:', error);
      toast({
        title: 'Error equipping item',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  const getRarityColor = (rarity: EquipmentRarity): string => {
    return RARITY_COLORS[rarity];
  };

  const getSlotIcon = (slot: EquipmentSlot) => {
    switch (slot) {
      case 'Weapon':
        return <Sword className="h-4 w-4" />;
      case 'Armor':
      case 'Helmet':
      case 'Boots':
      case 'Gloves':
        return <Shield className="h-4 w-4" />;
      case 'Accessory':
      case 'Artifact':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Equipment ({equipment.length})
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materials ({materials.length})
          </TabsTrigger>
          <TabsTrigger value="consumables" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Consumables (0)
          </TabsTrigger>
        </TabsList>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Rarity Filter */}
                <Select value={rarityFilter} onValueChange={(value) => setRarityFilter(value as EquipmentRarity | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Rarities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                    <SelectItem value="Mythic">Mythic</SelectItem>
                  </SelectContent>
                </Select>

                {/* Slot Filter */}
                <Select value={slotFilter} onValueChange={(value) => setSlotFilter(value as EquipmentSlot | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Slots" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Slots</SelectItem>
                    <SelectItem value="Weapon">Weapon</SelectItem>
                    <SelectItem value="Armor">Armor</SelectItem>
                    <SelectItem value="Helmet">Helmet</SelectItem>
                    <SelectItem value="Boots">Boots</SelectItem>
                    <SelectItem value="Gloves">Gloves</SelectItem>
                    <SelectItem value="Accessory">Accessory</SelectItem>
                    <SelectItem value="Artifact">Artifact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              <div className="flex gap-2 mt-3">
                {(rarityFilter !== 'all' || slotFilter !== 'all' || searchQuery) && (
                  <>
                    <span className="text-xs text-muted-foreground">Filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchQuery}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSearchQuery('')}
                        />
                      </Badge>
                    )}
                    {rarityFilter !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {rarityFilter}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setRarityFilter('all')}
                        />
                      </Badge>
                    )}
                    {slotFilter !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {slotFilter}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSlotFilter('all')}
                        />
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('name')}
              className="gap-2"
            >
              Name
              {sortField === 'name' && (
                <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('rarity')}
              className="gap-2"
            >
              Rarity
              {sortField === 'rarity' && (
                <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('slot')}
              className="gap-2"
            >
              Slot
              {sortField === 'slot' && (
                <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('level')}
              className="gap-2"
            >
              Level
              {sortField === 'level' && (
                <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </Button>
          </div>

          {/* Equipment Grid - Compact Icon View */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading inventory...
              </CardContent>
            </Card>
          ) : filteredEquipment.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {equipment.length === 0
                    ? 'No equipment in inventory. Complete portals to get loot!'
                    : 'No equipment matches your filters'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredEquipment.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-primary transition-all hover:scale-105"
                  onClick={() => setSelectedEquipment(item)}
                >
                  <CardContent className="p-4 space-y-2">
                    {/* Icon/Visual */}
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center bg-gradient-to-br ${
                      item.rarity === 'Common' ? 'from-gray-500/20 to-gray-600/20' :
                      item.rarity === 'Uncommon' ? 'from-green-500/20 to-green-600/20' :
                      item.rarity === 'Rare' ? 'from-blue-500/20 to-blue-600/20' :
                      item.rarity === 'Epic' ? 'from-purple-500/20 to-purple-600/20' :
                      item.rarity === 'Legendary' ? 'from-orange-500/20 to-orange-600/20' :
                      'from-pink-500/20 to-pink-600/20'
                    }`}>
                      <div className={`${getRarityColor(item.rarity)}`}>
                        {getSlotIcon(item.slot)}
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold ${getRarityColor(item.rarity)} truncate`} title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.slot}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Lv.{item.required_level}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Equipment Details Dialog */}
          <EquipmentDetails
            equipment={selectedEquipment}
            open={!!selectedEquipment}
            onOpenChange={(open) => !open && setSelectedEquipment(null)}
            hunters={hunters}
            onEquipToHunter={handleEquipToHunter}
          />
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No materials yet. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumables Tab */}
        <TabsContent value="consumables" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No consumables yet. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
