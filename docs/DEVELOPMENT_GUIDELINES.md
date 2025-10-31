# Development Guidelines

## Core Principle: NO HARDCODED DATA

**ALL game data should be stored in the database and editable via the Admin panel.**

This project follows a **data-driven architecture** where game designers (not developers) control game content.

---

## ✅ DO: Store IDs, Display Names Dynamically

### Pattern: Store IDs, Lookup Names

**BAD (Hardcoded):**
```typescript
// ❌ Don't do this!
hunter.kingdom = "Eastern Dynasty";  // Name is hardcoded
hunter.region = "Crimson Highlands";  // Can't change without code update
```

**GOOD (Dynamic):**
```typescript
// ✅ Store IDs instead
hunter.kingdom_id = "eastern-dynasty";
hunter.region_id = "crimson-highlands";

// ✅ Look up current name when displaying
const kingdomName = getKingdomNameFromId(hunter.kingdom_id); // "Eastern Empire" (if changed in admin)
const regionName = getRegionNameFromId(hunter.region_id);    // Current name from DB
```

### Why This Matters

**Before (Hardcoded):**
- User edits "Eastern Dynasty" → "Eastern Empire" in admin panel
- Existing hunters still show "Eastern Dynasty"
- Only NEW hunters show "Eastern Empire"
- ❌ Inconsistent experience

**After (ID-based):**
- User edits kingdom name in admin panel
- ALL hunters automatically show new name (existing + future)
- ✅ Single source of truth
- ✅ Retroactive updates

---

## 🗄️ Database Design Patterns

### 1. Use Foreign Key IDs

```sql
-- ✅ GOOD: Store foreign keys
CREATE TABLE hunters (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT REFERENCES kingdoms(id),
  region_id TEXT REFERENCES regions(id)
);

-- ❌ BAD: Store denormalized names
CREATE TABLE hunters (
  id TEXT PRIMARY KEY,
  kingdom_name TEXT,  -- Don't do this!
  region_name TEXT    -- Don't do this!
);
```

### 2. Admin-Editable Reference Tables

All game content should have an admin interface:

```sql
CREATE TABLE kingdoms (
  id TEXT PRIMARY KEY,           -- Stable ID (never changes)
  name TEXT NOT NULL,            -- Display name (admin can change)
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Point:** The `id` is stable (e.g., `"eastern-dynasty"`), but `name` can change (e.g., "Eastern Dynasty" → "Eastern Empire").

---

## 🎮 Implementation Guide

### Step 1: Define Your Entity

Example: Adding a new "Monster Types" feature.

**Create database table:**
```sql
CREATE TABLE monster_types (
  id TEXT PRIMARY KEY,           -- e.g., "dragon"
  name TEXT NOT NULL,            -- e.g., "Dragon" (admin editable)
  description TEXT,
  base_hp INTEGER,
  base_attack INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Create Service Layer

**File:** `src/features/guild-manager/lib/monsterService.ts`

```typescript
import { supabase } from '@/lib/supabase';

export interface MonsterType {
  id: string;
  name: string;
  description?: string;
  base_hp: number;
  base_attack: number;
}

// Cache with TTL
let monsterTypesCache: MonsterType[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMonsterTypes(forceRefresh = false): Promise<MonsterType[]> {
  const now = Date.now();
  if (!forceRefresh && monsterTypesCache && (now - lastFetch) < CACHE_DURATION) {
    return monsterTypesCache;
  }

  const { data, error } = await supabase
    .from('monster_types')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching monster types:', error);
    return monsterTypesCache || [];
  }

  monsterTypesCache = data || [];
  lastFetch = now;
  return monsterTypesCache;
}

// Helper: Get name from ID (synchronous, uses cache)
export function getMonsterTypeName(id: string): string {
  const type = monsterTypesCache?.find(t => t.id === id);
  return type?.name || id; // Fallback to ID if not found
}

// Clear cache after CRUD operations
export function clearMonsterTypeCache() {
  monsterTypesCache = null;
  lastFetch = 0;
}

// CRUD operations
export async function updateMonsterType(id: string, updates: Partial<MonsterType>) {
  const { error } = await supabase
    .from('monster_types')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  clearMonsterTypeCache(); // Important!
}
```

### Step 3: Build Admin Interface

**File:** `src/features/guild-manager/components/admin/MonsterTypesTab.tsx`

```typescript
import { useState, useEffect } from 'react';
import { getMonsterTypes, updateMonsterType } from '../../lib/monsterService';

export function MonsterTypesTab() {
  const [monsterTypes, setMonsterTypes] = useState([]);

  useEffect(() => {
    loadMonsterTypes();
  }, []);

  async function loadMonsterTypes() {
    const types = await getMonsterTypes(true); // Force refresh
    setMonsterTypes(types);
  }

  async function handleSave(id: string, name: string) {
    await updateMonsterType(id, { name });
    await loadMonsterTypes(); // Reload
  }

  return (
    <div>
      {monsterTypes.map(type => (
        <div key={type.id}>
          <input
            value={type.name}
            onChange={(e) => handleSave(type.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Use in Game Logic

**Store IDs:**
```typescript
// When creating a monster
const monster = await monsterService.createMonster({
  type_id: "dragon",  // ✅ Store ID
  level: 10
});
```

**Display names:**
```typescript
// When displaying to user
import { getMonsterTypeName } from './monsterService';

function MonsterCard({ monster }) {
  const typeName = getMonsterTypeName(monster.type_id); // "Dragon"
  return <div>{typeName}</div>;
}
```

---

## 📋 Checklist for New Features

When adding ANY new game content:

- [ ] Is this data that a game designer might want to change?
- [ ] If YES, create a database table with `id` and `name` columns
- [ ] Create service layer with caching (`get`, `update`, `clearCache`)
- [ ] Build admin interface for editing
- [ ] Store IDs in game entities (e.g., `monster.type_id`)
- [ ] Display names by looking up IDs (e.g., `getMonsterTypeName(id)`)
- [ ] Test that admin edits reflect immediately in game

---

## 🔄 Caching Strategy

Always use caching for reference data:

```typescript
// ✅ Good: 5-minute cache
let cache: DataType[] | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getData(forceRefresh = false): Promise<DataType[]> {
  const now = Date.now();
  if (!forceRefresh && cache && (now - lastFetch) < CACHE_DURATION) {
    return cache;
  }
  // Fetch from database...
  cache = data;
  lastFetch = now;
  return cache;
}

export function clearCache() {
  cache = null;
  lastFetch = 0;
}
```

**Why?** Reduces database calls while ensuring admin edits appear within 5 minutes (or immediately with `clearCache()`).

---

## 🚫 Anti-Patterns to Avoid

### ❌ Hardcoding Arrays/Objects

```typescript
// ❌ DON'T DO THIS
const MONSTER_TYPES = ['dragon', 'goblin', 'orc']; // Hardcoded!

const KINGDOM_NAMES = {
  'eastern-dynasty': 'Eastern Dynasty', // Can't change!
};
```

### ❌ Storing Display Names in Database

```typescript
// ❌ DON'T DO THIS
const hunter = {
  kingdom_name: "Eastern Dynasty"  // What if admin changes it?
};
```

### ❌ Duplicating Data

```typescript
// ❌ DON'T DO THIS
const monster = {
  type_id: "dragon",
  type_name: "Dragon",      // Redundant! Just lookup the name
  type_description: "...",  // Redundant!
};
```

---

## 🎯 Real Examples from This Project

### Kingdoms & Regions

**Before:**
```typescript
// ❌ Hardcoded
const hunter = {
  region: "Crimson Highlands",  // Can't change
  kingdom: "Eastern Dynasty"    // Can't change
};
```

**After:**
```typescript
// ✅ Dynamic
const hunter = {
  region_id: "crimson-highlands",
  kingdom_id: "eastern-dynasty"
};

// Display:
const regionName = getRegionNameFromId(hunter.region_id);
const kingdomName = getKingdomNameFromId(hunter.kingdom_id);
```

Now when admin changes "Eastern Dynasty" → "Eastern Empire", ALL hunters automatically show the new name!

---

## 📝 Summary

**Golden Rule:** If data might change, store it in the database with an admin interface.

**Pattern:**
1. Database table with `id` (stable) and `name` (changeable)
2. Service layer with caching
3. Admin UI for editing
4. Game logic stores IDs, displays names via lookup
5. Result: Retroactive updates, no code changes needed

**Benefits:**
- ✅ Game designers control content
- ✅ No developer needed for content changes
- ✅ Existing data automatically updates
- ✅ Single source of truth
- ✅ Consistent experience

---

## Questions?

If you're unsure whether something should be hardcoded, ask:
- "Could a game designer want to change this without a developer?"
- If YES → Database + Admin UI
- If NO → Hardcode is fine (e.g., UI layout, game mechanics)