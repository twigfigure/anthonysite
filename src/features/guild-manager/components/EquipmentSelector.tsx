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
import { Input } from '@/components/ui/input';
import { Search, Sword, Shield, Crown, Footprints, Hand, CircleDot, Sparkles, ShieldHalf } from 'lucide-react';
import type { Equipment, EquipmentSlot, Hunter } from '../types';
import { RARITY_COLORS } from '../types';
import { equipmentService } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface EquipmentSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: EquipmentSlot;
  hunter: Hunter;
  onEquip: () => void;
}

export function EquipmentSelector({ open, onOpenChange, slot, hunter, onEquip }: EquipmentSelectorProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadEquipment();
      setSearchQuery('');
    }
  }, [open, slot]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const allEquipment = await equipmentService.getAllEquipment();
      setEquipment(allEquipment);
    } catch (error) {
      console.error('Failed to load equipment:', error);
      toast({
        title: 'Error loading equipment',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEquipItem = async (equipmentItem: Equipment) => {
    try {
      await equipmentService.equipItemToHunter(hunter.id, equipmentItem.id, slot);
      toast({
        title: 'Equipment equipped!',
        description: `${equipmentItem.name} has been equipped to ${hunter.name}.`,
      });
      onEquip();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to equip item:', error);
      toast({
        title: 'Error equipping item',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Filter equipment by slot and eligibility
  const filteredEquipment = equipment
    .filter(item => {
      // Must match slot
      if (item.slot !== slot) return false;

      // Must match search query
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Check level requirement
      if (item.required_level > hunter.level) return false;

      // Check rank requirement
      if (item.required_rank) {
        const rankOrder = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
        const hunterRankIndex = rankOrder.indexOf(hunter.rank);
        const requiredRankIndex = rankOrder.indexOf(item.required_rank);
        if (hunterRankIndex < requiredRankIndex) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by rarity (highest first), then by level
      const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
      const rarityDiff = rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return b.required_level - a.required_level;
    });

  const getSlotIcon = () => {
    switch (slot) {
      case 'Weapon':
        return <Sword className="h-5 w-5" />;
      case 'Armor':
        return <ShieldHalf className="h-5 w-5" />;
      case 'Helmet':
        return <Crown className="h-5 w-5" />;
      case 'Boots':
        return <Footprints className="h-5 w-5" />;
      case 'Gloves':
        return <Hand className="h-5 w-5" />;
      case 'Accessory':
        return <CircleDot className="h-5 w-5" />;
      case 'Artifact':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSlotIcon()}
            Select {slot} for {hunter.name}
          </DialogTitle>
          <DialogDescription>
            Choose an item to equip. Only showing items you can equip (Level {hunter.level}, {hunter.rank}-rank).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${slot.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Equipment Grid */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading equipment...
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No {slot.toLowerCase()} available for your level and rank</p>
              <p className="text-xs mt-2">Required: Level {hunter.level}, {hunter.rank}-rank or below</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredEquipment.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-primary transition-all hover:scale-105"
                  onClick={() => handleEquipItem(item)}
                >
                  <CardContent className="p-3 space-y-2">
                    {/* Icon with rarity background */}
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center bg-gradient-to-br ${
                      item.rarity === 'Common' ? 'from-gray-500/20 to-gray-600/20' :
                      item.rarity === 'Uncommon' ? 'from-green-500/20 to-green-600/20' :
                      item.rarity === 'Rare' ? 'from-blue-500/20 to-blue-600/20' :
                      item.rarity === 'Epic' ? 'from-purple-500/20 to-purple-600/20' :
                      item.rarity === 'Legendary' ? 'from-orange-500/20 to-orange-600/20' :
                      'from-pink-500/20 to-pink-600/20'
                    }`}>
                      <div className={`${RARITY_COLORS[item.rarity]}`}>
                        {getSlotIcon()}
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="space-y-1">
                      <p className={`text-xs font-semibold ${RARITY_COLORS[item.rarity]} truncate`} title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {item.rarity}
                        </Badge>
                        <span className="text-muted-foreground">
                          Lv.{item.required_level}
                        </span>
                      </div>
                    </div>
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
