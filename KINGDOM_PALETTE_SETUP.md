# Kingdom Palette Setup Guide

## Problem Fixed
Kingdom names are editable in the admin backend, but image generation prompts were hardcoded to specific region names. This caused "cannot read properties of undefined (reading 'colors')" errors when kingdom names didn't match.

## Solution
Added `colors` and `theme` fields directly to the kingdoms table, so each kingdom's visual palette stays linked to it regardless of name changes.

## Step 1: Apply Database Migration

Go to your Supabase Dashboard → SQL Editor and run this migration:

```sql
-- Add visual theme columns to kingdoms table for image generation
ALTER TABLE kingdoms
ADD COLUMN IF NOT EXISTS colors TEXT,
ADD COLUMN IF NOT EXISTS theme TEXT;

-- Update existing kingdoms with their visual themes
UPDATE kingdoms SET colors = 'deep navy blues, silver, white, and icy blues', theme = 'cold, regal, disciplined military aesthetic' WHERE id = 'northern-empire';
UPDATE kingdoms SET colors = 'crimson reds, gold, black, and jade greens', theme = 'elegant, traditional, honor-bound warrior aesthetic' WHERE id = 'eastern-dynasty';
UPDATE kingdoms SET colors = 'royal purples, gold, emerald greens, and white', theme = 'noble, chivalrous, classic knight aesthetic' WHERE id = 'western-kingdom';
UPDATE kingdoms SET colors = 'warm oranges, deep browns, terracotta, and bone white', theme = 'tribal, natural, primal warrior aesthetic' WHERE id = 'southern-tribes';
UPDATE kingdoms SET colors = 'steel grays, brass, dark blues, and burgundy', theme = 'industrial, pragmatic, soldier aesthetic' WHERE id = 'central-republic';
UPDATE kingdoms SET colors = 'deep purples, midnight blues, silver, and arcane cyan', theme = 'mysterious, magical, scholarly aesthetic' WHERE id = 'mystic-enclave';
```

## Step 2: Update Your Code to Use Kingdom Palettes

When generating hunter images, fetch the kingdom data and pass the palette:

### Example (Scout/Recruit Dialog):

```typescript
import { getKingdoms } from '../lib/worldbuildingService';

// Fetch kingdom data
const kingdoms = await getKingdoms();
const kingdom = kingdoms.find(k => k.id === kingdomId);

// Generate image with kingdom palette
const imagePrompt = generateHunterCombinedPrompt(
  { name: hunterName, rank, hunterClass },
  kingdom?.colors && kingdom?.theme ? {
    colors: kingdom.colors,
    theme: kingdom.theme,
    regionName: kingdom.name
  } : undefined, // Falls back to random region if no palette data
  gender
);
```

## Step 3: (Optional) Add Fields to Admin UI

Update your admin kingdom editor to allow editing `colors` and `theme` fields so you can customize visual palettes for each kingdom.

## What Changed

### Files Modified:
1. **`/supabase/migrations/20241031230000_add_kingdom_visual_themes.sql`** - Database migration
2. **`src/features/guild-manager/lib/worldbuildingService.ts`** - Added `colors?` and `theme?` to Kingdom interface
3. **`src/features/guild-manager/lib/hunterImagePrompts.ts`** - Updated `generateHunterCombinedPrompt` to accept palette data object instead of region name

### Benefits:
- ✓ Kingdom names can be edited without breaking image generation
- ✓ Each kingdom's visual style stays consistent
- ✓ Backwards compatible (falls back to random region if no palette provided)
- ✓ Customizable palettes in admin UI (when you add the fields)

## Testing

After applying the migration, test by:
1. Scouting or recruiting a new hunter
2. Using the refresh button on an existing hunter
3. Verify no "colors" errors appear in console
