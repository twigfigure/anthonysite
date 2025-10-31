-- Seed basic equipment items for the game

-- WEAPONS (Common to Epic)

-- Common Weapons
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Rusty Sword', 'A worn blade that has seen better days', 'Common', 'Weapon', 1, 'D',
   2, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, '{}'),
  ('Wooden Staff', 'A simple wooden staff for novice mages', 'Common', 'Weapon', 1, 'D',
   0, 0, 3, 0, 0, 0, 10, 0, 8, 0, 0, '{}'),
  ('Training Bow', 'Standard issue bow for hunter training', 'Common', 'Weapon', 1, 'D',
   0, 3, 0, 0, 1, 0, 0, 6, 0, 0, 0, '{}');

-- Uncommon Weapons
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Iron Sword', 'A reliable blade forged from iron', 'Uncommon', 'Weapon', 10, 'D',
   5, 0, 0, 2, 0, 0, 0, 12, 0, 2, 0, '{}'),
  ('Iron Staff', 'A staff reinforced with iron bands', 'Uncommon', 'Weapon', 10, 'D',
   0, 0, 6, 2, 0, 0, 25, 0, 18, 0, 3, '{}'),
  ('Hunter''s Bow', 'A well-crafted bow for experienced hunters', 'Uncommon', 'Weapon', 10, 'D',
   2, 6, 0, 0, 2, 0, 0, 14, 0, 0, 0, '{}'),
  ('Iron Daggers', 'Twin daggers with sharp edges', 'Uncommon', 'Weapon', 10, 'D',
   3, 8, 0, 0, 2, 0, 0, 11, 0, 0, 0, '{}');

-- Rare Weapons
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Steel Sword', 'A masterwork blade of tempered steel', 'Rare', 'Weapon', 25, 'C',
   10, 0, 0, 4, 0, 0, 0, 25, 0, 5, 0, '{}'),
  ('Mage''s Staff', 'An enchanted staff pulsing with magical energy', 'Rare', 'Weapon', 25, 'C',
   0, 0, 12, 4, 0, 0, 50, 0, 35, 0, 8, '{}'),
  ('Elven Bow', 'A graceful bow crafted by elven artisans', 'Rare', 'Weapon', 25, 'C',
   4, 12, 0, 2, 4, 0, 0, 28, 0, 0, 0, '{}'),
  ('Shadow Daggers', 'Daggers that seem to absorb light', 'Rare', 'Weapon', 25, 'C',
   6, 14, 0, 0, 5, 0, 0, 24, 0, 0, 0, '{}');

-- Epic Weapons
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Dragon Slayer Sword', 'A legendary blade said to have slain dragons', 'Epic', 'Weapon', 50, 'B',
   20, 0, 0, 8, 5, 50, 0, 50, 0, 10, 5, '{"dragon_slayer": true}'),
  ('Archmage Staff', 'Staff wielded by the greatest of mages', 'Epic', 'Weapon', 50, 'B',
   0, 0, 25, 8, 5, 0, 120, 0, 70, 0, 20, '{"spell_amplification": 0.15}'),
  ('Phoenix Bow', 'A bow wreathed in eternal flame', 'Epic', 'Weapon', 50, 'B',
   8, 22, 0, 5, 8, 30, 0, 55, 10, 0, 5, '{"fire_damage": true}');

-- ARMOR

-- Common Armor
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Cloth Robe', 'Simple cloth robes', 'Common', 'Armor', 1, 'D',
   0, 0, 2, 1, 0, 20, 15, 0, 0, 2, 3, '{}'),
  ('Leather Vest', 'Basic leather protection', 'Common', 'Armor', 1, 'D',
   1, 2, 0, 2, 0, 30, 0, 0, 0, 5, 1, '{}');

-- Uncommon Armor
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Iron Chainmail', 'Interlocking iron rings provide solid protection', 'Uncommon', 'Armor', 10, 'D',
   3, -1, 0, 5, 0, 80, 0, 0, 0, 15, 3, '{}'),
  ('Mage Robes', 'Enchanted robes for spellcasters', 'Uncommon', 'Armor', 10, 'D',
   0, 0, 5, 3, 0, 50, 40, 0, 5, 5, 10, '{}'),
  ('Hunter''s Leather', 'Flexible leather armor for mobility', 'Uncommon', 'Armor', 10, 'D',
   2, 5, 0, 4, 1, 70, 0, 0, 0, 10, 2, '{}');

-- Rare Armor
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Steel Plate Armor', 'Heavy steel plates protect vital areas', 'Rare', 'Armor', 25, 'C',
   6, -2, 0, 10, 0, 150, 0, 0, 0, 35, 8, '{}'),
  ('Arcane Vestments', 'Robes woven with magical threads', 'Rare', 'Armor', 25, 'C',
   0, 0, 10, 6, 2, 100, 80, 0, 12, 10, 25, '{}'),
  ('Shadow Leather', 'Armor that bends light around the wearer', 'Rare', 'Armor', 25, 'C',
   4, 10, 0, 8, 3, 120, 0, 0, 0, 20, 5, '{}');

-- Epic Armor
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Dragon Scale Armor', 'Impenetrable armor crafted from dragon scales', 'Epic', 'Armor', 50, 'B',
   12, -3, 0, 20, 5, 300, 0, 5, 0, 70, 20, '{"dragon_resistance": true}'),
  ('Robes of the Archmage', 'Legendary robes of ultimate magical power', 'Epic', 'Armor', 50, 'B',
   0, 0, 20, 12, 5, 200, 180, 0, 25, 15, 50, '{"mana_regeneration": 0.1}');

-- HELMETS

-- Common Helmets
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Leather Cap', 'Simple leather headwear', 'Common', 'Helmet', 1, 'D',
   0, 1, 0, 1, 0, 15, 0, 0, 0, 2, 1, '{}'),
  ('Cloth Hood', 'Basic hood for protection', 'Common', 'Helmet', 1, 'D',
   0, 0, 1, 1, 0, 10, 10, 0, 0, 1, 2, '{}');

-- Uncommon Helmets
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Iron Helmet', 'Sturdy iron helm', 'Uncommon', 'Helmet', 10, 'D',
   2, 0, 0, 3, 0, 40, 0, 0, 0, 8, 2, '{}'),
  ('Mage''s Circlet', 'A circlet that enhances magical power', 'Uncommon', 'Helmet', 10, 'D',
   0, 0, 4, 2, 0, 25, 20, 0, 5, 2, 6, '{}'),
  ('Ranger''s Hood', 'Hood with enhanced perception', 'Uncommon', 'Helmet', 10, 'D',
   0, 4, 0, 2, 1, 30, 0, 2, 0, 4, 1, '{}');

-- Rare Helmets
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Steel Great Helm', 'Full-face protection', 'Rare', 'Helmet', 25, 'C',
   4, -1, 0, 6, 0, 80, 0, 0, 0, 18, 5, '{}'),
  ('Crown of Wisdom', 'A crown that sharpens the mind', 'Rare', 'Helmet', 25, 'C',
   0, 0, 8, 4, 2, 50, 40, 0, 10, 5, 15, '{}');

-- BOOTS

-- Common Boots
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Cloth Shoes', 'Basic footwear', 'Common', 'Boots', 1, 'D',
   0, 1, 0, 0, 0, 10, 5, 0, 0, 1, 1, '{}'),
  ('Leather Boots', 'Simple leather boots', 'Common', 'Boots', 1, 'D',
   0, 2, 0, 1, 0, 15, 0, 0, 0, 2, 0, '{}');

-- Uncommon Boots
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Iron Greaves', 'Heavy iron leg protection', 'Uncommon', 'Boots', 10, 'D',
   2, 0, 0, 3, 0, 35, 0, 0, 0, 7, 2, '{}'),
  ('Swift Boots', 'Boots that enhance movement', 'Uncommon', 'Boots', 10, 'D',
   0, 5, 0, 2, 1, 25, 0, 1, 0, 3, 1, '{}'),
  ('Mage''s Slippers', 'Enchanted footwear', 'Uncommon', 'Boots', 10, 'D',
   0, 0, 3, 2, 0, 20, 15, 0, 3, 2, 5, '{}');

-- Rare Boots
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Boots of Striding', 'Magical boots that increase speed', 'Rare', 'Boots', 25, 'C',
   2, 10, 0, 4, 2, 50, 0, 2, 0, 8, 3, '{"movement_speed": 0.2}'),
  ('Steel Sabatons', 'Heavy armored boots', 'Rare', 'Boots', 25, 'C',
   4, -1, 0, 6, 0, 70, 0, 0, 0, 15, 5, '{}');

-- GLOVES

-- Common Gloves
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Cloth Gloves', 'Simple cloth hand protection', 'Common', 'Gloves', 1, 'D',
   0, 0, 1, 0, 0, 5, 5, 0, 1, 1, 1, '{}'),
  ('Leather Gloves', 'Basic leather gloves', 'Common', 'Gloves', 1, 'D',
   1, 1, 0, 0, 0, 10, 0, 1, 0, 2, 0, '{}');

-- Uncommon Gloves
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Iron Gauntlets', 'Heavy iron hand protection', 'Uncommon', 'Gloves', 10, 'D',
   3, 0, 0, 2, 0, 25, 0, 3, 0, 6, 1, '{}'),
  ('Fingerless Gloves', 'Allows for dexterous movements', 'Uncommon', 'Gloves', 10, 'D',
   1, 4, 0, 1, 1, 20, 0, 2, 0, 3, 1, '{}'),
  ('Sorcerer''s Gloves', 'Gloves that channel magical energy', 'Uncommon', 'Gloves', 10, 'D',
   0, 0, 4, 1, 0, 15, 20, 0, 5, 2, 4, '{}');

-- Rare Gloves
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Gauntlets of Might', 'Gloves that enhance physical power', 'Rare', 'Gloves', 25, 'C',
   8, 0, 0, 3, 0, 40, 0, 8, 0, 12, 3, '{"strength_multiplier": 0.1}'),
  ('Gloves of Casting', 'Perfect for intricate spellwork', 'Rare', 'Gloves', 25, 'C',
   0, 0, 8, 2, 1, 30, 35, 0, 12, 4, 10, '{"cast_speed": 0.15}');

-- ACCESSORIES

-- Uncommon Accessories
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Silver Ring', 'A simple silver ring', 'Uncommon', 'Accessory', 5, 'D',
   0, 0, 0, 1, 2, 20, 10, 0, 0, 0, 2, '{}'),
  ('Iron Amulet', 'Protective amulet', 'Uncommon', 'Accessory', 5, 'D',
   1, 0, 0, 2, 0, 30, 0, 0, 0, 3, 3, '{}'),
  ('Lucky Charm', 'Increases fortune', 'Uncommon', 'Accessory', 5, 'D',
   0, 0, 0, 0, 5, 15, 0, 0, 0, 0, 0, '{"luck_bonus": true}');

-- Rare Accessories
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Ring of Power', 'A ring that amplifies strength', 'Rare', 'Accessory', 20, 'C',
   5, 0, 0, 3, 0, 50, 0, 5, 0, 0, 0, '{}'),
  ('Amulet of Protection', 'Powerful defensive charm', 'Rare', 'Accessory', 20, 'C',
   0, 0, 0, 5, 1, 80, 0, 0, 0, 10, 10, '{}'),
  ('Mana Crystal Necklace', 'Enhances magical reserves', 'Rare', 'Accessory', 20, 'C',
   0, 0, 5, 0, 0, 30, 60, 0, 8, 0, 5, '{}');

-- Epic Accessories
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Dragon Heart Amulet', 'Contains the essence of a dragon', 'Epic', 'Accessory', 45, 'B',
   8, 8, 8, 8, 8, 150, 100, 10, 10, 15, 15, '{"all_stats": true}'),
  ('Ring of the Archmage', 'Ultimate magical artifact', 'Epic', 'Accessory', 45, 'B',
   0, 0, 15, 5, 5, 50, 150, 0, 25, 5, 20, '{"spell_power": 0.2}');

-- ARTIFACTS (Special Slot - Very Rare)

-- Epic Artifacts
INSERT INTO equipment (name, description, rarity, slot, required_level, required_rank,
  strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, luck_bonus,
  hp_bonus, mana_bonus, attack_bonus, magic_bonus, defense_bonus, magic_resist_bonus, special_effects)
VALUES
  ('Orb of Dominion', 'Ancient artifact of immense power', 'Epic', 'Artifact', 60, 'A',
   10, 10, 10, 10, 10, 200, 200, 15, 15, 20, 20, '{"dominion": true}'),
  ('Crown of the Immortal King', 'Legendary crown of ultimate power', 'Legendary', 'Artifact', 80, 'S',
   20, 20, 20, 20, 20, 500, 500, 40, 40, 50, 50, '{"immortal_blessing": true}');
