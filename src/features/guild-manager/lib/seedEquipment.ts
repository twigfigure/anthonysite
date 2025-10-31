// One-time script to seed equipment into the database
// Run this once by importing it and calling seedEquipment()

import { supabase } from '@/lib/supabase';

export async function seedEquipment() {
  console.log('Starting equipment seed...');

  try {
    // Check if equipment already exists
    const { data: existingEquipment, error: checkError } = await supabase
      .from('equipment')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing equipment:', checkError);
      throw checkError;
    }

    if (existingEquipment && existingEquipment.length > 0) {
      console.log('Equipment already seeded. Skipping...');
      return { success: true, message: 'Equipment already exists' };
    }

    // Read the SQL file content and execute it
    // Since we can't directly execute SQL files, we'll insert the data via the JS client
    const equipmentData = [
      // Common Weapons
      { name: 'Rusty Sword', description: 'A worn blade that has seen better days', rarity: 'Common', slot: 'Weapon', required_level: 1, required_rank: 'D', strength_bonus: 2, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 0, hp_bonus: 0, mana_bonus: 0, attack_bonus: 5, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },
      { name: 'Wooden Staff', description: 'A simple wooden staff for novice mages', rarity: 'Common', slot: 'Weapon', required_level: 1, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 3, vitality_bonus: 0, luck_bonus: 0, hp_bonus: 0, mana_bonus: 10, attack_bonus: 0, magic_bonus: 8, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },
      { name: 'Training Bow', description: 'Standard issue bow for hunter training', rarity: 'Common', slot: 'Weapon', required_level: 1, required_rank: 'D', strength_bonus: 0, agility_bonus: 3, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 1, hp_bonus: 0, mana_bonus: 0, attack_bonus: 6, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },

      // Uncommon Weapons
      { name: 'Iron Sword', description: 'A reliable blade forged from iron', rarity: 'Uncommon', slot: 'Weapon', required_level: 10, required_rank: 'D', strength_bonus: 5, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 2, luck_bonus: 0, hp_bonus: 0, mana_bonus: 0, attack_bonus: 12, magic_bonus: 0, defense_bonus: 2, magic_resist_bonus: 0, special_effects: {} },
      { name: 'Iron Staff', description: 'A staff reinforced with iron bands', rarity: 'Uncommon', slot: 'Weapon', required_level: 10, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 6, vitality_bonus: 2, luck_bonus: 0, hp_bonus: 0, mana_bonus: 25, attack_bonus: 0, magic_bonus: 18, defense_bonus: 0, magic_resist_bonus: 3, special_effects: {} },
      { name: "Hunter's Bow", description: 'A well-crafted bow for experienced hunters', rarity: 'Uncommon', slot: 'Weapon', required_level: 10, required_rank: 'D', strength_bonus: 2, agility_bonus: 6, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 2, hp_bonus: 0, mana_bonus: 0, attack_bonus: 14, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },
      { name: 'Iron Daggers', description: 'Twin daggers with sharp edges', rarity: 'Uncommon', slot: 'Weapon', required_level: 10, required_rank: 'D', strength_bonus: 3, agility_bonus: 8, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 2, hp_bonus: 0, mana_bonus: 0, attack_bonus: 11, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },

      // Rare Weapons
      { name: 'Steel Sword', description: 'A masterwork blade of tempered steel', rarity: 'Rare', slot: 'Weapon', required_level: 25, required_rank: 'C', strength_bonus: 10, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 4, luck_bonus: 0, hp_bonus: 0, mana_bonus: 0, attack_bonus: 25, magic_bonus: 0, defense_bonus: 5, magic_resist_bonus: 0, special_effects: {} },
      { name: "Mage's Staff", description: 'An enchanted staff pulsing with magical energy', rarity: 'Rare', slot: 'Weapon', required_level: 25, required_rank: 'C', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 12, vitality_bonus: 4, luck_bonus: 0, hp_bonus: 0, mana_bonus: 50, attack_bonus: 0, magic_bonus: 35, defense_bonus: 0, magic_resist_bonus: 8, special_effects: {} },
      { name: 'Elven Bow', description: 'A graceful bow crafted by elven artisans', rarity: 'Rare', slot: 'Weapon', required_level: 25, required_rank: 'C', strength_bonus: 4, agility_bonus: 12, intelligence_bonus: 0, vitality_bonus: 2, luck_bonus: 4, hp_bonus: 0, mana_bonus: 0, attack_bonus: 28, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: {} },

      // Common Armor
      { name: 'Cloth Robe', description: 'Simple cloth robes', rarity: 'Common', slot: 'Armor', required_level: 1, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 2, vitality_bonus: 1, luck_bonus: 0, hp_bonus: 20, mana_bonus: 15, attack_bonus: 0, magic_bonus: 0, defense_bonus: 2, magic_resist_bonus: 3, special_effects: {} },
      { name: 'Leather Vest', description: 'Basic leather protection', rarity: 'Common', slot: 'Armor', required_level: 1, required_rank: 'D', strength_bonus: 1, agility_bonus: 2, intelligence_bonus: 0, vitality_bonus: 2, luck_bonus: 0, hp_bonus: 30, mana_bonus: 0, attack_bonus: 0, magic_bonus: 0, defense_bonus: 5, magic_resist_bonus: 1, special_effects: {} },

      // Uncommon Armor
      { name: 'Iron Chainmail', description: 'Interlocking iron rings provide solid protection', rarity: 'Uncommon', slot: 'Armor', required_level: 10, required_rank: 'D', strength_bonus: 3, agility_bonus: -1, intelligence_bonus: 0, vitality_bonus: 5, luck_bonus: 0, hp_bonus: 80, mana_bonus: 0, attack_bonus: 0, magic_bonus: 0, defense_bonus: 15, magic_resist_bonus: 3, special_effects: {} },
      { name: 'Mage Robes', description: 'Enchanted robes for spellcasters', rarity: 'Uncommon', slot: 'Armor', required_level: 10, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 5, vitality_bonus: 3, luck_bonus: 0, hp_bonus: 50, mana_bonus: 40, attack_bonus: 0, magic_bonus: 5, defense_bonus: 5, magic_resist_bonus: 10, special_effects: {} },

      // Add more items as needed - I'll add a selection to get started
      { name: 'Leather Cap', description: 'Simple leather headwear', rarity: 'Common', slot: 'Helmet', required_level: 1, required_rank: 'D', strength_bonus: 0, agility_bonus: 1, intelligence_bonus: 0, vitality_bonus: 1, luck_bonus: 0, hp_bonus: 15, mana_bonus: 0, attack_bonus: 0, magic_bonus: 0, defense_bonus: 2, magic_resist_bonus: 1, special_effects: {} },
      { name: 'Iron Helmet', description: 'Sturdy iron helm', rarity: 'Uncommon', slot: 'Helmet', required_level: 10, required_rank: 'D', strength_bonus: 2, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 3, luck_bonus: 0, hp_bonus: 40, mana_bonus: 0, attack_bonus: 0, magic_bonus: 0, defense_bonus: 8, magic_resist_bonus: 2, special_effects: {} },

      { name: 'Cloth Shoes', description: 'Basic footwear', rarity: 'Common', slot: 'Boots', required_level: 1, required_rank: 'D', strength_bonus: 0, agility_bonus: 1, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 0, hp_bonus: 10, mana_bonus: 5, attack_bonus: 0, magic_bonus: 0, defense_bonus: 1, magic_resist_bonus: 1, special_effects: {} },
      { name: 'Swift Boots', description: 'Boots that enhance movement', rarity: 'Uncommon', slot: 'Boots', required_level: 10, required_rank: 'D', strength_bonus: 0, agility_bonus: 5, intelligence_bonus: 0, vitality_bonus: 2, luck_bonus: 1, hp_bonus: 25, mana_bonus: 0, attack_bonus: 1, magic_bonus: 0, defense_bonus: 3, magic_resist_bonus: 1, special_effects: {} },

      { name: 'Leather Gloves', description: 'Basic leather gloves', rarity: 'Common', slot: 'Gloves', required_level: 1, required_rank: 'D', strength_bonus: 1, agility_bonus: 1, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 0, hp_bonus: 10, mana_bonus: 0, attack_bonus: 1, magic_bonus: 0, defense_bonus: 2, magic_resist_bonus: 0, special_effects: {} },
      { name: 'Iron Gauntlets', description: 'Heavy iron hand protection', rarity: 'Uncommon', slot: 'Gloves', required_level: 10, required_rank: 'D', strength_bonus: 3, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 2, luck_bonus: 0, hp_bonus: 25, mana_bonus: 0, attack_bonus: 3, magic_bonus: 0, defense_bonus: 6, magic_resist_bonus: 1, special_effects: {} },

      { name: 'Silver Ring', description: 'A simple silver ring', rarity: 'Uncommon', slot: 'Accessory', required_level: 5, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 1, luck_bonus: 2, hp_bonus: 20, mana_bonus: 10, attack_bonus: 0, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 2, special_effects: {} },
      { name: 'Lucky Charm', description: 'Increases fortune', rarity: 'Uncommon', slot: 'Accessory', required_level: 5, required_rank: 'D', strength_bonus: 0, agility_bonus: 0, intelligence_bonus: 0, vitality_bonus: 0, luck_bonus: 5, hp_bonus: 15, mana_bonus: 0, attack_bonus: 0, magic_bonus: 0, defense_bonus: 0, magic_resist_bonus: 0, special_effects: { luck_bonus: true } },
    ];

    console.log(`Inserting ${equipmentData.length} equipment items...`);

    const { data, error } = await supabase
      .from('equipment')
      .insert(equipmentData)
      .select();

    if (error) {
      console.error('Error inserting equipment:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length} equipment items!`);
    return { success: true, message: `Seeded ${data?.length} equipment items`, data };
  } catch (error) {
    console.error('Failed to seed equipment:', error);
    return { success: false, error };
  }
}
