// Guild Manager Supabase Helper Functions
import { supabase } from '@/lib/supabase';
import type {
  Guild,
  Hunter,
  Portal,
  PortalTemplate,
  PortalAssignment,
  GuildBuilding,
  GuildMaterial,
  Equipment,
  HunterEquipment,
  EquippedItem,
  EquipmentBonuses,
  HunterActivityLog
} from '../types';

// ============================================
// GUILD OPERATIONS
// ============================================

export const guildService = {
  // Create a new guild for a user
  async createGuild(userId: string, name: string, region: string) {
    const { data, error } = await supabase
      .from('guilds')
      .insert({
        user_id: userId,
        name,
        region
      })
      .select()
      .single();

    if (error) throw error;
    return data as Guild;
  },

  // Get guild by user ID
  async getGuildByUserId(userId: string) {
    const { data, error } = await supabase
      .from('guilds')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as Guild | null;
  },

  // Update guild
  async updateGuild(guildId: string, updates: Partial<Guild>) {
    const { data, error } = await supabase
      .from('guilds')
      .update(updates)
      .eq('id', guildId)
      .select()
      .single();

    if (error) throw error;
    return data as Guild;
  },

  // Add gold to guild
  async addGold(guildId: string, amount: number) {
    const { data, error } = await supabase.rpc('add_guild_gold', {
      guild_id: guildId,
      amount
    });

    if (error) throw error;
    return data;
  }
};

// ============================================
// HUNTER OPERATIONS
// ============================================

export const hunterService = {
  // Get all hunters for a guild
  async getGuildHunters(guildId: string) {
    const { data, error } = await supabase
      .from('hunters')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Hunter[];
  },

  // Create a new hunter
  async createHunter(hunter: Partial<Hunter>) {
    const { data, error } = await supabase
      .from('hunters')
      .insert(hunter)
      .select()
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Update hunter
  async updateHunter(hunterId: string, updates: Partial<Hunter>) {
    const { data, error } = await supabase
      .from('hunters')
      .update(updates)
      .eq('id', hunterId)
      .select()
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Add experience to hunter
  async addExperience(hunterId: string, exp: number) {
    const hunter = await this.getHunter(hunterId);
    const newExp = hunter.experience + exp;

    // TODO: Implement level up logic
    return await this.updateHunter(hunterId, { experience: newExp });
  },

  // Get single hunter
  async getHunter(hunterId: string) {
    const { data, error } = await supabase
      .from('hunters')
      .select('*')
      .eq('id', hunterId)
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Mark hunter as dead
  async markDead(hunterId: string, respawnMinutes: number) {
    const respawnAt = new Date();
    respawnAt.setMinutes(respawnAt.getMinutes() + respawnMinutes);

    const hunter = await this.getHunter(hunterId);

    const { data, error } = await supabase
      .from('hunters')
      .update({
        is_dead: true,
        respawn_at: respawnAt.toISOString(),
        death_count: hunter.death_count + 1,
        current_hp: 0
      })
      .eq('id', hunterId)
      .select()
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Respawn hunter
  async respawnHunter(hunterId: string) {
    const hunter = await this.getHunter(hunterId);

    const { data, error } = await supabase
      .from('hunters')
      .update({
        is_dead: false,
        respawn_at: null,
        current_hp: hunter.max_hp,
        current_mana: hunter.max_mana
      })
      .eq('id', hunterId)
      .select()
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Delete hunter
  async deleteHunter(hunterId: string) {
    const { error } = await supabase
      .from('hunters')
      .delete()
      .eq('id', hunterId);

    if (error) throw error;
  }
};

// ============================================
// PORTAL OPERATIONS
// ============================================

export const portalService = {
  // Get available portals for a guild's world level
  async getAvailablePortals(guildId: string, worldLevel: number) {
    const { data, error } = await supabase
      .from('portals')
      .select(`
        *,
        template:portal_templates(*)
      `)
      .eq('guild_id', guildId)
      .eq('is_active', true);

    if (error) throw error;
    return data as Portal[];
  },

  // Get portal templates for a world level
  async getPortalTemplates(worldLevel: number) {
    const { data, error } = await supabase
      .from('portal_templates')
      .select('*')
      .eq('world_level', worldLevel);

    if (error) throw error;
    return data as PortalTemplate[];
  },

  // Discover/create a new portal instance
  async discoverPortal(guildId: string, templateId: string) {
    const { data, error } = await supabase
      .from('portals')
      .insert({
        guild_id: guildId,
        template_id: templateId
      })
      .select()
      .single();

    if (error) throw error;
    return data as Portal;
  }
};

// ============================================
// ASSIGNMENT OPERATIONS
// ============================================

export const assignmentService = {
  // Assign hunter to portal
  async assignHunter(portalId: string, hunterId: string) {
    // Mark hunter as assigned
    await hunterService.updateHunter(hunterId, { is_assigned: true });

    // Create assignment
    const { data, error } = await supabase
      .from('portal_assignments')
      .insert({
        portal_id: portalId,
        hunter_id: hunterId,
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;
    return data as PortalAssignment;
  },

  // Get active assignments for a guild
  async getActiveAssignments(guildId: string) {
    const { data, error } = await supabase
      .from('portal_assignments')
      .select(`
        *,
        hunter:hunters(*),
        portal:portals(
          *,
          template:portal_templates(*)
        )
      `)
      .eq('status', 'Active')
      .eq('portal.guild_id', guildId);

    if (error) throw error;
    return data as PortalAssignment[];
  },

  // Complete assignment
  async completeAssignment(
    assignmentId: string,
    success: boolean,
    rewards: {
      gold: number;
      experience: number;
      loot: any[];
    }
  ) {
    const { data, error } = await supabase
      .from('portal_assignments')
      .update({
        status: 'Completed',
        completed_at: new Date().toISOString(),
        success,
        gold_earned: rewards.gold,
        experience_earned: rewards.experience,
        loot_acquired: rewards.loot
      })
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) throw error;

    // Unassign hunter
    const assignment = data as PortalAssignment;
    await hunterService.updateHunter(assignment.hunter_id, { is_assigned: false });

    return assignment;
  }
};

// ============================================
// EQUIPMENT OPERATIONS
// ============================================

export const equipmentService = {
  // Get all available equipment in the game
  async getAllEquipment() {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('required_level', { ascending: true });

    if (error) throw error;
    return data as Equipment[];
  },

  // Get equipment by rarity
  async getEquipmentByRarity(rarity: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('rarity', rarity)
      .order('required_level', { ascending: true });

    if (error) throw error;
    return data as Equipment[];
  },

  // Get equipment by slot
  async getEquipmentBySlot(slot: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('slot', slot)
      .order('required_level', { ascending: true });

    if (error) throw error;
    return data as Equipment[];
  },

  // Get hunter's equipment
  async getHunterEquipment(hunterId: string) {
    const { data, error } = await supabase
      .from('hunter_equipment')
      .select(`
        *,
        equipment:equipment(*)
      `)
      .eq('hunter_id', hunterId);

    if (error) throw error;
    return data as HunterEquipment[];
  },

  // Equip item
  async equipItem(hunterEquipmentId: string, slot: string) {
    // First unequip any item in this slot
    const { data: currentEquipped } = await supabase
      .from('hunter_equipment')
      .select('id, equipment:equipment!inner(slot)')
      .eq('is_equipped', true)
      .eq('equipment.slot', slot);

    if (currentEquipped && currentEquipped.length > 0) {
      await supabase
        .from('hunter_equipment')
        .update({ is_equipped: false })
        .eq('id', currentEquipped[0].id);
    }

    // Equip new item
    const { data, error } = await supabase
      .from('hunter_equipment')
      .update({ is_equipped: true })
      .eq('id', hunterEquipmentId)
      .select()
      .single();

    if (error) throw error;
    return data as HunterEquipment;
  },

  // Add equipment to hunter inventory
  async addEquipmentToHunter(hunterId: string, equipmentId: string) {
    const { data, error } = await supabase
      .from('hunter_equipment')
      .insert({
        hunter_id: hunterId,
        equipment_id: equipmentId
      })
      .select()
      .single();

    if (error) throw error;
    return data as HunterEquipment;
  },

  // ============================================
  // EQUIPPED ITEMS (New system)
  // ============================================

  // Equip item to hunter (replaces any item in that slot)
  async equipItemToHunter(hunterId: string, equipmentId: string, slot: string) {
    const { data, error } = await supabase.rpc('equip_item_to_hunter', {
      p_hunter_id: hunterId,
      p_equipment_id: equipmentId,
      p_slot: slot
    });

    if (error) throw error;
    return data;
  },

  // Unequip item from hunter slot
  async unequipItemFromHunter(hunterId: string, slot: string) {
    const { data, error } = await supabase.rpc('unequip_item_from_hunter', {
      p_hunter_id: hunterId,
      p_slot: slot
    });

    if (error) throw error;
    return data;
  },

  // Get all equipped items for a hunter
  async getHunterEquippedItems(hunterId: string) {
    const { data, error } = await supabase
      .from('hunter_equipment')
      .select(`
        id,
        hunter_id,
        equipment_id,
        slot,
        equipped_at,
        equipment:equipment_id (
          id,
          name,
          description,
          rarity,
          slot,
          strength_bonus,
          agility_bonus,
          intelligence_bonus,
          vitality_bonus,
          luck_bonus,
          hp_bonus,
          mana_bonus,
          attack_bonus,
          magic_bonus,
          defense_bonus,
          magic_resist_bonus,
          special_effects,
          required_level,
          required_rank
        )
      `)
      .eq('hunter_id', hunterId);

    if (error) throw error;
    return data as EquippedItem[];
  },

  // Get equipment bonuses for a hunter
  async getHunterEquipmentBonuses(hunterId: string) {
    const { data, error } = await supabase.rpc('get_hunter_equipment_bonuses', {
      p_hunter_id: hunterId
    });

    if (error) throw error;
    return data as EquipmentBonuses;
  }
};

// ============================================
// BUILDING OPERATIONS
// ============================================

export const buildingService = {
  // Get guild buildings
  async getGuildBuildings(guildId: string) {
    const { data, error } = await supabase
      .from('guild_buildings')
      .select('*')
      .eq('guild_id', guildId);

    if (error) throw error;
    return data as GuildBuilding[];
  },

  // Construct building
  async constructBuilding(guildId: string, buildingType: string) {
    const { data, error } = await supabase
      .from('guild_buildings')
      .insert({
        guild_id: guildId,
        building_type: buildingType
      })
      .select()
      .single();

    if (error) throw error;
    return data as GuildBuilding;
  },

  // Upgrade building
  async upgradeBuilding(buildingId: string) {
    const building = await this.getBuilding(buildingId);

    const { data, error } = await supabase
      .from('guild_buildings')
      .update({
        level: building.level + 1,
        upgraded_at: new Date().toISOString()
      })
      .eq('id', buildingId)
      .select()
      .single();

    if (error) throw error;
    return data as GuildBuilding;
  },

  async getBuilding(buildingId: string) {
    const { data, error } = await supabase
      .from('guild_buildings')
      .select('*')
      .eq('id', buildingId)
      .single();

    if (error) throw error;
    return data as GuildBuilding;
  }
};

// ============================================
// MATERIAL OPERATIONS
// ============================================

export const materialService = {
  // Get guild materials
  async getGuildMaterials(guildId: string) {
    const { data, error } = await supabase
      .from('guild_materials')
      .select(`
        *,
        material:materials(*)
      `)
      .eq('guild_id', guildId);

    if (error) throw error;
    return data as GuildMaterial[];
  },

  // Add materials to guild
  async addMaterial(guildId: string, materialId: string, quantity: number) {
    const { data, error } = await supabase.rpc('add_guild_material', {
      p_guild_id: guildId,
      p_material_id: materialId,
      p_quantity: quantity
    });

    if (error) throw error;
    return data;
  }
};

// ============================================
// ACTIVITY LOG SERVICE
// ============================================

export const activityLogService = {
  // Create a new activity log entry
  async createLog(
    hunterId: string,
    activityType: string,
    description: string,
    metadata?: Record<string, any>
  ) {
    const { data, error } = await supabase
      .from('hunter_activity_log')
      .insert({
        hunter_id: hunterId,
        activity_type: activityType,
        description,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get activity logs for a hunter
  async getHunterLogs(hunterId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('hunter_activity_log')
      .select('*')
      .eq('hunter_id', hunterId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as HunterActivityLog[];
  },

  // Get recent activity logs for all hunters in a guild
  async getGuildLogs(guildId: string, limit: number = 100) {
    const { data, error } = await supabase
      .from('hunter_activity_log')
      .select(`
        *,
        hunter:hunters(name, rank, class)
      `)
      .eq('hunters.guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get activity logs by type
  async getLogsByType(hunterId: string, activityType: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('hunter_activity_log')
      .select('*')
      .eq('hunter_id', hunterId)
      .eq('activity_type', activityType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as HunterActivityLog[];
  }
};

// ============================================
// RANK-UP SERVICE
// ============================================

export const rankUpService = {
  // Process a successful rank up
  async processRankUp(hunterId: string, newRank: string) {
    const { data, error } = await supabase
      .from('hunters')
      .update({
        rank: newRank,
        level: 1, // Reset to level 1 of new rank
        experience: 0 // Reset experience
      })
      .eq('id', hunterId)
      .select()
      .single();

    if (error) throw error;
    return data as Hunter;
  },

  // Deduct costs from guild (gold, crystals)
  async deductCosts(guildId: string, goldCost: number, crystalCost: number) {
    const { data, error } = await supabase
      .from('guilds')
      .update({
        gold: supabase.raw(`gold - ${goldCost}`),
        crystals: supabase.raw(`crystals - ${crystalCost}`)
      })
      .eq('id', guildId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Apply failure penalty
  async applyFailurePenalty(
    hunterId: string,
    guildId: string,
    penalty: { lose_experience?: boolean; lose_gold?: number }
  ) {
    const updates: { experience?: number } = {};

    if (penalty.lose_experience) {
      updates.experience = 0;
    }

    // Update hunter
    if (Object.keys(updates).length > 0) {
      const { error: hunterError } = await supabase
        .from('hunters')
        .update(updates)
        .eq('id', hunterId);

      if (hunterError) throw hunterError;
    }

    // Deduct gold from guild if specified
    if (penalty.lose_gold && penalty.lose_gold > 0) {
      const { error: guildError } = await supabase
        .from('guilds')
        .update({
          gold: supabase.raw(`GREATEST(0, gold - ${penalty.lose_gold})`)
        })
        .eq('id', guildId);

      if (guildError) throw guildError;
    }
  }
};

// ============================================
// UPKEEP SERVICE
// ============================================

export const upkeepService = {
  // Get total weekly upkeep for all hunters in a guild
  async getGuildTotalUpkeep(guildId: string) {
    const { data, error } = await supabase.rpc('get_guild_total_upkeep', {
      p_guild_id: guildId
    });

    if (error) throw error;
    return data as number;
  },

  // Check if a hunter's upkeep is due (7+ days since last payment)
  async isUpkeepDue(hunterId: string) {
    const { data, error } = await supabase.rpc('is_upkeep_due', {
      p_hunter_id: hunterId
    });

    if (error) throw error;
    return data as boolean;
  },

  // Pay upkeep for a single hunter
  async payHunterUpkeep(guildId: string, hunterId: string) {
    const { data, error } = await supabase.rpc('pay_hunter_upkeep', {
      p_guild_id: guildId,
      p_hunter_id: hunterId
    });

    if (error) throw error;
    return data as {
      success: boolean;
      cost?: number;
      remaining_gold?: number;
      error?: string;
    };
  },

  // Pay upkeep for all hunters in a guild at once
  async payAllGuildUpkeep(guildId: string) {
    const { data, error } = await supabase.rpc('pay_all_guild_upkeep', {
      p_guild_id: guildId
    });

    if (error) throw error;
    return data as {
      success: boolean;
      total_cost?: number;
      hunters_paid?: number;
      remaining_gold?: number;
      required?: number;
      available?: number;
      error?: string;
    };
  }
};
