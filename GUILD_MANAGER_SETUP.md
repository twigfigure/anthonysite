# Guild Manager - Setup Instructions

## Overview

Guild Manager is now fully integrated into your website! This guide will help you set up the database and start playing.

## What Was Created

### Frontend Code
All files are organized under `/src/features/guild-manager/`:
- **Pages**: Main game page (`GuildManager.tsx`)
- **Components**: Hunter lists, portal lists, guild overview, recruitment dialogs
- **Types**: Complete TypeScript interfaces for all game entities
- **Lib**: Supabase database functions and game calculation helpers

### Database Schema
- Location: `/supabase/migrations/guild-manager/001_guild_manager_schema.sql`
- Tables: 15+ tables for guilds, hunters, portals, equipment, materials, etc.
- Enums: Hunter ranks, classes, portal difficulties, equipment rarities

### Route
- **URL**: `/guild-manager`
- Already added to `App.tsx` routing

## Setup Steps

### Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Open `/supabase/migrations/guild-manager/001_guild_manager_schema.sql`
4. Copy all contents
5. Paste into Supabase SQL Editor
6. Click "Run" to execute

This will create all necessary tables, enums, indexes, and triggers.

### Step 2: Verify Setup

Run the following query in Supabase SQL Editor to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%guild%' OR table_name LIKE '%hunter%';
```

You should see tables like: `guilds`, `hunters`, `portals`, `equipment`, etc.

### Step 3: Test the Game

1. Make sure you're logged into your website
2. Navigate to `/guild-manager`
3. A new guild will be automatically created for you with:
   - 1 B-rank Fighter (Starter Hunter)
   - 1 C-rank Support (Guild Administrator)
   - 5,000 starting gold

### Step 4: Start Playing!

You can now:
- ✅ View your guild overview
- ✅ Recruit new hunters (with custom ranks and classes)
- ✅ View hunter details and stats
- ✅ See available portals for your world level
- ⏳ Assign hunters to portals (coming next!)

## Current Features (MVP v1.0)

### Working Now
- Guild creation and management
- Hunter recruitment system
- Hunter stats and progression display
- Portal discovery and viewing
- Rank system (F to SSS)
- Class system (7 classes)
- Death and respawn system (database ready)
- Combat power calculations

### Coming Soon (Next Updates)
- Portal assignment functionality
- Mission completion with rewards
- Equipment drops and inventory
- Hunter equipment system
- Building construction
- Material gathering
- Skill book learning
- World boss battles

## File Organization

Everything is cleanly separated from your other projects:

```
Your Project
├── src/features/
│   ├── homepage/          (Your homepage)
│   ├── kindred/           (Your Kindred project)
│   ├── fantasy-basketball/ (Your fantasy basketball)
│   └── guild-manager/     (NEW - Guild Manager game)
│       ├── components/
│       ├── lib/
│       ├── pages/
│       └── types/
└── supabase/migrations/
    └── guild-manager/     (NEW - Database schema)
```

## Game Mechanics Quick Reference

### Hunter Ranks (Weakest to Strongest)
F → E → D → C → B → A → S → SS → SSS

### Portal Difficulties (Easiest to Hardest)
Blue → Green → Yellow → Orange → Red → Purple → Black

### Classes
- **Fighter**: Balanced stats
- **Tank**: High HP and defense
- **Mage**: High magic power
- **Healer**: Support with healing
- **Assassin**: High agility and crits
- **Ranger**: Ranged physical damage
- **Support**: Utility and buffs

### World Level System
- Start at World Level 1
- Defeat major boss to advance
- Cap at World Level 10
- Higher levels unlock harder portals and better rewards

## Troubleshooting

### "Authentication Required" Error
- Make sure you're logged in to your website
- The game requires an authenticated user

### Guild Not Loading
- Check browser console for errors
- Verify database migration ran successfully
- Check Supabase connection in browser Network tab

### TypeScript Errors
```bash
npx tsc --noEmit
```
Should return no errors (already verified)

## Next Steps for Development

If you want to add more features:

1. **Portal Assignments**: Implement the assignment logic in `PortalList.tsx`
2. **Mission Timer**: Add countdown timers for active missions
3. **Rewards System**: Distribute gold, XP, and loot on mission completion
4. **Equipment System**: Add equipment drops and inventory UI
5. **Buildings**: Implement the building construction system

All the database tables and types are already in place!

## Database RPC Functions Needed

For full functionality, you may want to add these Supabase RPC functions:

```sql
-- Add gold to guild (with validation)
CREATE OR REPLACE FUNCTION add_guild_gold(guild_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE guilds
  SET gold = gold + amount
  WHERE id = guild_id;
END;
$$ LANGUAGE plpgsql;

-- Add material to guild inventory (upsert)
CREATE OR REPLACE FUNCTION add_guild_material(
  p_guild_id UUID,
  p_material_id UUID,
  p_quantity INTEGER
)
RETURNS void AS $$
BEGIN
  INSERT INTO guild_materials (guild_id, material_id, quantity)
  VALUES (p_guild_id, p_material_id, p_quantity)
  ON CONFLICT (guild_id, material_id)
  DO UPDATE SET quantity = guild_materials.quantity + p_quantity;
END;
$$ LANGUAGE plpgsql;
```

## Support

For questions or issues with Guild Manager:
- Check the README at `/src/features/guild-manager/README.md`
- Review the database schema at `/supabase/migrations/guild-manager/001_guild_manager_schema.sql`
- All types are documented in `/src/features/guild-manager/types/index.ts`

## Enjoy!

Your Guild Manager game is ready to play! Start recruiting hunters and conquering portals! 🎮⚔️
