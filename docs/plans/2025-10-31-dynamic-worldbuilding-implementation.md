# Dynamic Worldbuilding Implementation Plan

**Goal**: Store kingdom/region IDs instead of names so ALL hunters (existing + future) automatically reflect admin panel changes.

## Changes Made So Far

### 1. Type Updates
- **`types/index.ts`**: Changed `kingdom`/`region` to `kingdom_id`/`region_id`
- These now store IDs like `"eastern-dynasty"` instead of names like `"Eastern Dynasty"`

### 2. Helper Functions Created
- **`gameHelpers.ts`**:
  - `generateRegionId()` - Returns region ID instead of name
  - `getKingdomIdFromRegionId()` - Maps region ID to kingdom ID
  - `getRegionNameFromId()` - Looks up current name from ID
  - `getKingdomNameFromId()` - Looks up current name from ID

- **`worldbuildingService.ts`**:
  - `getKingdomNameById()` - Async lookup from database
  - `getRegionNameById()` - Async lookup from database
  - `getKingdomIdByRegionId()` - Get kingdom ID from region ID

## What Still Needs to Be Done

### 3. Database Migration
Create migration to rename `kingdom` → `kingdom_id` and `region` → `region_id` in hunters table.

```sql
-- Rename columns
ALTER TABLE hunters RENAME COLUMN kingdom TO kingdom_id;
ALTER TABLE hunters RENAME COLUMN region TO region_id;

-- Update existing data to use IDs instead of names
-- (Need to map current names to IDs)
```

### 4. Update Hunter Creation Code
Files that create hunters need to use IDs:
- **`RecruitHunterDialog.tsx`**: Use `generateRegionId()` and `getKingdomIdFromRegionId()`
- **`ScoutDialog.tsx`**: Same as above
- **`GuildManager.tsx`** (`createStarterGuild`): Same as above

### 5. Update UI Display Components
Components that display kingdom/region need to look up names:
- **`HunterDetails.tsx`**: Display `getRegionNameFromId(hunter.region_id)` and `getKingdomNameFromId(hunter.kingdom_id)`
- **`HunterList.tsx`**: Same as above
- Any other components showing hunter origin

### 6. Update Backstory Generation
- **`gameHelpers.ts`** (`generateBackstory`): Function signature needs to accept region_id, then look up name internally

## How It Works After Implementation

1. **Hunter Creation**: Stores `region_id: "crimson-highlands"` and `kingdom_id: "eastern-dynasty"`
2. **Admin Edit**: User changes "Eastern Dynasty" → "Eastern Empire" in admin panel
3. **Display**: UI looks up `kingdom_id: "eastern-dynasty"` → shows "Eastern Empire" (new name)
4. **Result**: ALL hunters from that kingdom automatically show the new name!

## Benefits

✅ Existing hunters retroactively update
✅ No more hardcoded values
✅ Single source of truth (database)
✅ Admin has full control

## Next Steps

1. Create and run database migration
2. Update all hunter creation code
3. Update all display components
4. Test thoroughly