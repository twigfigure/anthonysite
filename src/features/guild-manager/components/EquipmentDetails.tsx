import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { User, X } from 'lucide-react';
import type { Equipment, Hunter } from '../types';
import { RARITY_COLORS } from '../types';

interface EquipmentDetailsProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hunters: Hunter[];
  onEquipToHunter?: (equipmentId: string, hunterId: string) => void;
}

export function EquipmentDetails({
  equipment,
  open,
  onOpenChange,
  hunters,
  onEquipToHunter,
}: EquipmentDetailsProps) {
  const [selectedHunter, setSelectedHunter] = useState<string>('');

  if (!equipment) return null;

  const handleEquip = () => {
    if (selectedHunter && onEquipToHunter) {
      onEquipToHunter(equipment.id, selectedHunter);
    }
  };

  // Filter hunters that can equip this item
  const eligibleHunters = hunters.filter(hunter => {
    const meetsLevel = hunter.level >= equipment.required_level;
    const meetsRank = !equipment.required_rank ||
      ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'].indexOf(hunter.rank) >=
      ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'].indexOf(equipment.required_rank);
    return meetsLevel && meetsRank && !hunter.is_dead;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className={`text-2xl ${RARITY_COLORS[equipment.rarity]}`}>
                {equipment.name}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {equipment.description}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={`${RARITY_COLORS[equipment.rarity]} text-lg px-3 py-1`}>
              {equipment.rarity}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Slot</p>
              <p className="text-lg font-semibold">{equipment.slot}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Required Level</p>
              <p className="text-lg font-semibold">
                Level {equipment.required_level}
                {equipment.required_rank && (
                  <Badge variant="outline" className="ml-2">
                    {equipment.required_rank}+
                  </Badge>
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Base Stats Bonuses */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Base Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {equipment.strength_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Strength</p>
                  <p className="text-lg font-bold text-red-500">+{equipment.strength_bonus}</p>
                </div>
              )}
              {equipment.agility_bonus !== 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Agility</p>
                  <p className={`text-lg font-bold ${equipment.agility_bonus > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {equipment.agility_bonus > 0 ? '+' : ''}{equipment.agility_bonus}
                  </p>
                </div>
              )}
              {equipment.intelligence_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Intelligence</p>
                  <p className="text-lg font-bold text-blue-500">+{equipment.intelligence_bonus}</p>
                </div>
              )}
              {equipment.vitality_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Vitality</p>
                  <p className="text-lg font-bold text-pink-500">+{equipment.vitality_bonus}</p>
                </div>
              )}
              {equipment.luck_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Luck</p>
                  <p className="text-lg font-bold text-yellow-500">+{equipment.luck_bonus}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Combat Stats */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Combat Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {equipment.hp_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">HP</p>
                  <p className="text-lg font-bold text-red-500">+{equipment.hp_bonus}</p>
                </div>
              )}
              {equipment.mana_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Mana</p>
                  <p className="text-lg font-bold text-blue-500">+{equipment.mana_bonus}</p>
                </div>
              )}
              {equipment.attack_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Attack Power</p>
                  <p className="text-lg font-bold text-orange-500">+{equipment.attack_bonus}</p>
                </div>
              )}
              {equipment.magic_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Magic Power</p>
                  <p className="text-lg font-bold text-purple-500">+{equipment.magic_bonus}</p>
                </div>
              )}
              {equipment.defense_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Defense</p>
                  <p className="text-lg font-bold text-gray-500">+{equipment.defense_bonus}</p>
                </div>
              )}
              {equipment.magic_resist_bonus > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Magic Resist</p>
                  <p className="text-lg font-bold text-indigo-500">+{equipment.magic_resist_bonus}</p>
                </div>
              )}
            </div>
          </div>

          {/* Special Effects */}
          {equipment.special_effects && Object.keys(equipment.special_effects).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Special Effects</h3>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <ul className="space-y-1 text-sm">
                    {Object.entries(equipment.special_effects).map(([key, value]) => (
                      <li key={key} className="text-purple-600 dark:text-purple-400">
                        • {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {typeof value === 'number' && ` (+${(value * 100).toFixed(0)}%)`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Equip to Hunter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Equip to Hunter</h3>

            {eligibleHunters.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No eligible hunters</p>
                <p className="text-xs mt-1">
                  Requires Level {equipment.required_level}
                  {equipment.required_rank && ` and ${equipment.required_rank}-rank or higher`}
                </p>
              </div>
            ) : (
              <>
                <Select value={selectedHunter} onValueChange={setSelectedHunter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hunter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleHunters.map(hunter => (
                      <SelectItem key={hunter.id} value={hunter.id}>
                        <div className="flex items-center gap-2">
                          <span>{hunter.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {hunter.rank}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Lv.{hunter.level}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full gap-2"
                  disabled={!selectedHunter}
                  onClick={handleEquip}
                >
                  <User className="h-4 w-4" />
                  Equip to Hunter
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
