# Guild Manager Admin Dashboard Design

**Date:** 2025-10-31
**Purpose:** Create admin-only dashboard for managing Guild Manager game backend, including backstory content, portals, guilds, database operations, and image asset generation.

---

## Design Overview

This design establishes a comprehensive admin dashboard accessible only to authorized administrators. The dashboard provides complete control over game content, player data, database operations, and asset management through a tabbed interface.

### Core Design Principles

1. **Admin-Only Access:** Environment variable authentication (single admin)
2. **Separate Route:** Dedicated `/guild-manager/admin` page
3. **Tabbed Interface:** 5 distinct sections for different admin functions
4. **Minimal Database Changes:** No schema modifications required
5. **Safety First:** Confirmations for destructive operations

---

## Access Control

### Authentication Method: Environment Variable

**Implementation:**
- Admin email stored in `VITE_ADMIN_EMAIL` environment variable
- On dashboard load, check authenticated user's email against env var
- Redirect non-admins with "Access Denied" message

**Authentication Flow:**
```
1. User navigates to /guild-manager/admin
2. AdminDashboard component loads
3. Call supabase.auth.getUser()
4. Compare user.email === import.meta.env.VITE_ADMIN_EMAIL
5. If match → Render dashboard
6. If no match → Show access denied screen with redirect to main game
```

**Advantages:**
- Simple implementation, no database changes
- Single admin sufficient for current needs
- Easy to update admin (change env var and redeploy)
- No complex permission system needed

---

## Route Structure

### New Routes
- **Route:** `/guild-manager/admin`
- **Component:** `AdminDashboard.tsx`
- **Location:** `src/features/guild-manager/pages/AdminDashboard.tsx`

### Navigation
- Add "Admin" button next to "Return Home" button in `GuildManager.tsx:219-221`
- Admin button navigates to `/guild-manager/admin`
- Button visible to all users, but route is protected

---

## Component Architecture

### Component Hierarchy
```
AdminDashboard (main page component)
├── AdminHeader
│   ├── Page title
│   ├── Current user email display
│   └── Return to Game button
│
├── Tabs (shadcn/ui Tabs component)
│   ├── BackstoryTab
│   ├── PortalsTab
│   ├── GuildsTab
│   ├── DatabaseTab
│   └── AssetsTab
```

### Page Layout
```tsx
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
  <AdminHeader />
  <Tabs defaultValue="backstory">
    <TabsList>
      <TabsTrigger value="backstory">Backstory</TabsTrigger>
      <TabsTrigger value="portals">Portals</TabsTrigger>
      <TabsTrigger value="guilds">Guilds</TabsTrigger>
      <TabsTrigger value="database">Database</TabsTrigger>
      <TabsTrigger value="assets">Assets</TabsTrigger>
    </TabsList>

    <TabsContent value="backstory"><BackstoryTab /></TabsContent>
    <TabsContent value="portals"><PortalsTab /></TabsContent>
    <TabsContent value="guilds"><GuildsTab /></TabsContent>
    <TabsContent value="database"><DatabaseTab /></TabsContent>
    <TabsContent value="assets"><AssetsTab /></TabsContent>
  </Tabs>
</div>
```

---

## Tab 1: Backstory Viewer

### Purpose
Display existing world-building content including kingdoms, regions, rulers, and portal lore.

### Data Source
Parse and display content from `/docs/plans/2025-10-31-world-building-kingdoms-regions-design.md`

### Display Structure

**Accordion Layout:**
- 6 kingdom sections (Northern Empire, Eastern Dynasty, Western Kingdom, Southern Tribes, Central Republic, Mystic Enclave)
- Each kingdom expands to show:
  - Government type and culture description
  - Supreme ruler with details (name, age, personality, backstory)
  - Capital city
  - Historical significance
  - 3 regions per kingdom

**Region Details:**
- Region name and description
- Regional leader information
- List of locations (for portal naming)
- Example portals with world levels
- Boss portal lore

**Boss Portals Section:**
- Boss Portal (WL 6-8) with historical lore
- Major Boss Portal (WL 8-10) with catastrophic event lore

### Editing Strategy
**Phase 1 (Current Design):** Read-only display, edit markdown file directly
**Phase 2 (Future):** Add markdown editor component for in-app editing

### Implementation Notes
- Use React component to parse markdown on load
- Format with proper typography (headers, lists, bold text)
- Consider using `react-markdown` library for rendering
- Highlight ruler names, kingdom names for visual clarity

---

## Tab 2: Portal Management

### Purpose
Create, read, update, delete portal templates that spawn in the game.

### Features

**Portal Templates Table:**
- Display all portal templates from database
- Columns: Name, Difficulty, World Level, Boss Status, Min Level, Rewards
- Sortable by any column
- Filterable by: difficulty, world level, boss status
- Search by name

**Create Portal Template:**
- Button opens modal/dialog with form
- Form fields:
  - Name (text input)
  - Difficulty (select: Blue, Green, Yellow, Orange, Red, Purple, Black)
  - World Level (number input, 1-10)
  - Boss flags (checkboxes: is_boss_portal, is_major_boss)
  - Min hunter level (number)
  - Recommended hunters (number)
  - Max hunters (number)
  - Base gold reward (number)
  - Base experience reward (number)
  - Completion time in minutes (number)
  - Entry cost (number)
  - Description (textarea)
  - Loot table (complex nested input - can be simplified to JSON textarea initially)
- Validation on all fields
- Submit creates new portal_template row

**Edit Portal Template:**
- Click row opens edit modal
- Pre-populated form with existing values
- Submit updates portal_template row

**Delete Portal Template:**
- Delete button with confirmation dialog
- "Are you sure you want to delete [Portal Name]? This cannot be undone."
- Hard delete from database

### Database Interaction
- Use `supabase.from('portal_templates')` for CRUD operations
- Real-time updates (optimistic UI updates)
- Error handling with toast notifications

---

## Tab 3: Guilds Overview

### Purpose
Monitor all player guilds, view statistics, inspect hunters and equipment.

### Features

**All Guilds Table:**
- Query all guilds from database
- Columns:
  - Guild Name
  - Owner Email (from user_id join)
  - Region
  - Level
  - World Level
  - Gold
  - Crystals
  - Influence
  - Hunter Count
  - Created Date
- Sortable and filterable
- Search by guild name or owner email

**Guild Details (Expandable Row):**
- Click guild row to expand
- Show all hunters in guild:
  - Hunter card grid (similar to main game display)
  - Name, Rank, Class, Level
  - Stats (STR, AGI, INT, VIT, LUCK)
  - Combat Power
  - Equipment summary (equipped items)
  - Current status (assigned, dead, available)

**Guild Statistics:**
- Total guilds count
- Average world level
- Total gold in economy
- Total crystals in economy
- Total hunters across all guilds
- Rank distribution chart (how many D, C, B, A, S, SS, SSS hunters exist)

### Database Queries
```typescript
// Get all guilds with owner info
const { data: guilds } = await supabase
  .from('guilds')
  .select(`
    *,
    profiles!guilds_user_id_fkey(email)
  `)
  .order('created_at', { ascending: false });

// Get hunters for a specific guild
const { data: hunters } = await supabase
  .from('hunters')
  .select(`
    *,
    equipped_items(
      equipment(*)
    )
  `)
  .eq('guild_id', guildId);
```

---

## Tab 4: Database Tools

### Purpose
Manage database migrations, seed data, and perform administrative database operations.

### Features

**Migration Management:**
- Display migration history from `supabase/migrations/` directory
- List all migration files with timestamps
- Show which migrations have been applied (query Supabase migration table)
- "Run Pending Migrations" button
- Migration status indicator (applied/pending)

**Seed Data Tools:**

1. **Generate Portal Templates**
   - Button: "Seed Portal Templates"
   - Creates portal templates for all kingdoms/regions based on world-building doc
   - Generates portals for WL 1-10 across all regions
   - Confirmation: "This will create approximately 126+ portal templates. Continue?"

2. **Generate Equipment Templates**
   - Button: "Seed Equipment Templates"
   - Creates starter equipment for each class
   - Generates equipment of all rarities
   - Confirmation required

3. **Create Test Guild**
   - Button: "Create Test Guild"
   - Form: Guild name, starting region
   - Creates guild with starter hunters for testing

4. **Reset Database (Danger Zone)**
   - Red button: "Reset All Game Data"
   - Requires typing "DELETE ALL DATA" to confirm
   - Deletes all guilds, hunters, portals, assignments
   - Keeps portal_templates, equipment templates (game config)

**SQL Query Executor:**
- Textarea for raw SQL queries
- "Execute Query" button
- Results displayed in table format
- Error handling and display
- Warning: "Use with caution - no undo"
- Read-only mode toggle (prevents INSERT/UPDATE/DELETE)

### Safety Measures
- All destructive operations require confirmation dialogs
- Show affected row counts before execution
- Display success/error messages with toast notifications
- Log all admin actions (future enhancement)

---

## Tab 5: Assets Manager

### Purpose
Manage image generation prompts and asset library for hunter art, kingdom themes, and game assets.

### Features

#### Section 1: Prompt Templates

**Prompt Templates Library:**
- Display saved prompt templates in card grid
- Template types:
  - Hunter Avatar (512x512, portrait style)
  - Hunter Splash Art (1024x1024, full body action pose)
  - Kingdom Theme (landscape, environmental)
  - Equipment Icons (512x512, item focus)
- Each template card shows:
  - Template name
  - Preview of last generated image (if any)
  - Variables used (e.g., {kingdom}, {class}, {gender}, {rank})
  - Edit and Delete buttons

**Create/Edit Prompt Template:**
- Form fields:
  - Template Name (text)
  - Template Type (select: Avatar, Splash Art, Kingdom, Equipment, Custom)
  - Base Prompt (textarea)
    - Example: "High quality digital art, {class} hunter from {kingdom}, {gender}, {rank} rank, fantasy RPG style"
  - Variables (dynamic list)
    - Variable name and description
    - Example: {kingdom} = "Kingdom name from world-building"
  - Negative Prompt (textarea, optional)
  - Generation Settings:
    - Image size (select: 512x512, 1024x1024, custom)
    - Style preset (if using styled API)
    - Seed (optional, for reproducibility)

**Template Categories:**
```
Hunter Templates:
- Avatar - Male Fighter - Northern Empire
- Avatar - Female Mage - Eastern Dynasty
- Splash Art - Assassin - Western Kingdom
- etc.

Kingdom Templates:
- Northern Empire - Frostspire Peaks
- Eastern Dynasty - Crimson Highlands
- etc.

Equipment Templates:
- Weapon - Legendary Sword
- Armor - Epic Plate
- etc.
```

#### Section 2: Image Generation

**Generation Interface:**
- Two modes: Template-based or Custom prompt

**Template-based Generation:**
1. Select prompt template from dropdown
2. Fill in variable values (form dynamically generated from template variables)
   - Example: Kingdom = "Northern Empire", Class = "Fighter", Gender = "Male"
3. Preview compiled prompt (shows final prompt with variables filled)
4. "Generate Image" button
5. Loading state with progress indicator
6. Generated image preview

**Custom Prompt Generation:**
1. Textarea for custom prompt
2. Image size selector
3. Advanced settings (expandable)
4. "Generate Image" button

**Image Generation Flow:**
```typescript
async function generateImage(prompt: string, settings: GenerationSettings) {
  // Call your existing image generation API
  // Could be DALL-E, Stable Diffusion, Midjourney API, etc.
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    body: JSON.stringify({ prompt, ...settings })
  });

  const { imageUrl } = await response.json();
  return imageUrl;
}
```

#### Section 3: Asset Library

**Asset Grid Display:**
- Grid of all saved images
- Each card shows:
  - Image thumbnail
  - Asset name
  - Category/tags
  - Dimensions
  - Created date
  - Actions (view, download, copy URL, delete)

**Filters and Search:**
- Filter by category (Hunter Avatar, Splash Art, Kingdom, Equipment, Custom)
- Filter by tags (add tags when saving assets)
- Search by name
- Sort by: Date created, Name, Category

**Asset Details Modal:**
- Click image opens full-size view
- Display metadata:
  - File name
  - URL (with copy button)
  - Dimensions
  - File size
  - Prompt used to generate
  - Tags
  - Created date
- Actions:
  - Download original
  - Copy URL to clipboard
  - Edit metadata (name, tags)
  - Delete asset

**Save Generated Image:**
- After generating image, "Save to Asset Library" button
- Form:
  - Asset name (text, auto-filled from prompt template)
  - Category (select)
  - Tags (multi-input, e.g., "northern-empire", "fighter", "male")
  - Notes (textarea, optional)
- Save uploads to storage and creates database record

**Bulk Operations:**
- Select multiple assets (checkboxes)
- Bulk actions:
  - Add tags
  - Change category
  - Download as ZIP
  - Delete multiple

### Database Schema for Assets

**New Table: `image_assets`**
```sql
CREATE TABLE image_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT, -- 'avatar', 'splash_art', 'kingdom', 'equipment', 'custom'
  tags TEXT[], -- Array of tags
  image_url TEXT NOT NULL, -- Supabase storage URL
  thumbnail_url TEXT, -- Optional smaller preview
  prompt_used TEXT, -- The prompt that generated this image
  template_id UUID, -- Reference to prompt template if used
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- bytes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**New Table: `prompt_templates`**
```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template_type TEXT, -- 'avatar', 'splash_art', 'kingdom', 'equipment', 'custom'
  base_prompt TEXT NOT NULL,
  variables JSONB, -- { "kingdom": "Kingdom name", "class": "Hunter class", ... }
  negative_prompt TEXT,
  settings JSONB, -- { "width": 1024, "height": 1024, "style": "fantasy", ... }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Integration with Existing System

**Current Hunter Image Generation:**
- Appears to use external API for generating hunter avatars
- Located in `hunterImagePrompts.ts` (kingdom palettes already defined)

**Integration Points:**
1. Reuse existing image generation API endpoint
2. Prompt templates can use existing kingdom palette descriptions
3. Generated hunter images can be saved to asset library
4. Asset library images can be manually assigned to hunters (future feature)

---

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create `AdminDashboard.tsx` page component
- [ ] Add route to `App.tsx`
- [ ] Implement environment variable auth check
- [ ] Add "Admin" button to GuildManager.tsx
- [ ] Create AdminHeader component
- [ ] Set up Tabs layout

### Phase 2: Backstory Tab
- [ ] Create BackstoryTab component
- [ ] Implement markdown parsing
- [ ] Build accordion UI for kingdoms/regions
- [ ] Style with proper typography

### Phase 3: Portals Tab
- [ ] Create PortalsTab component
- [ ] Build portal templates table
- [ ] Implement create portal form
- [ ] Implement edit portal form
- [ ] Implement delete confirmation
- [ ] Add filters and search

### Phase 4: Guilds Tab
- [ ] Create GuildsTab component
- [ ] Query all guilds from database
- [ ] Build guilds table
- [ ] Implement expandable guild details
- [ ] Show hunters for selected guild
- [ ] Add statistics dashboard

### Phase 5: Database Tab
- [ ] Create DatabaseTab component
- [ ] List migrations
- [ ] Implement seed data functions
- [ ] Build SQL query executor
- [ ] Add safety confirmations
- [ ] Implement danger zone (reset database)

### Phase 6: Assets Tab
- [ ] Create database migrations for new tables
- [ ] Create AssetsTab component
- [ ] Build prompt templates CRUD
- [ ] Implement image generation interface
- [ ] Create asset library grid
- [ ] Implement asset details modal
- [ ] Add bulk operations
- [ ] Set up Supabase storage bucket for images

### Phase 7: Testing & Polish
- [ ] Test admin auth flow
- [ ] Test all CRUD operations
- [ ] Test image generation and saving
- [ ] Add loading states
- [ ] Add error handling
- [ ] Responsive design check
- [ ] Security audit

---

## File Structure

```
src/features/guild-manager/
├── pages/
│   ├── GuildManager.tsx (add Admin button)
│   └── AdminDashboard.tsx (NEW - main admin page)
│
├── components/
│   ├── admin/ (NEW directory)
│   │   ├── AdminHeader.tsx
│   │   ├── BackstoryTab.tsx
│   │   ├── PortalsTab.tsx
│   │   ├── GuildsTab.tsx
│   │   ├── DatabaseTab.tsx
│   │   ├── AssetsTab.tsx
│   │   ├── PromptTemplateForm.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── AssetLibrary.tsx
│   │   └── AssetCard.tsx
│
├── lib/
│   └── adminService.ts (NEW - admin-specific database operations)
│
└── types/
    └── admin.ts (NEW - admin-specific TypeScript types)

supabase/migrations/
└── YYYYMMDDHHMMSS_create_admin_assets_tables.sql (NEW)

.env.local
└── VITE_ADMIN_EMAIL=your-email@example.com (NEW)
```

---

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use `.env.example` with placeholder for documentation
   - Admin email only checked client-side (acceptable for single admin use case)

2. **Supabase RLS (Row Level Security):**
   - Current implementation relies on client-side check
   - For production: Add RLS policies that check user email against admin list
   - Example policy: `auth.jwt() ->> 'email' = 'admin@example.com'`

3. **Dangerous Operations:**
   - All destructive operations require explicit confirmation
   - SQL executor should be limited (consider read-only mode by default)
   - Database reset requires typing exact phrase

4. **Future Enhancements:**
   - Add admin action logging
   - Implement IP whitelist
   - Add rate limiting on image generation
   - Implement proper backend API for admin operations

---

## Future Enhancements

### Short-term
- Add markdown editor for backstory editing
- Export/import functionality for portal templates
- Player analytics dashboard (retention, progression curves)
- Asset tagging autocomplete

### Medium-term
- Multi-admin support with database admin flag
- Admin action audit log
- Automated portal template generation from world-building data
- Image generation queue for batch processing
- Asset CDN integration

### Long-term
- Full RBAC system with granular permissions
- Content moderation tools
- A/B testing framework for game balance
- Real-time game monitoring dashboard
- Automated backup and restore system

---

## Summary

This design provides a comprehensive admin dashboard with:
- **Simple authentication** via environment variable (single admin)
- **5 functional tabs** covering all requested admin features
- **Backstory viewer** displaying existing world-building content
- **Portal management** for full CRUD on portal templates
- **Guild oversight** to monitor all players and hunters
- **Database tools** for migrations, seeding, and raw queries
- **Asset management** system for image generation, prompt templates, and asset library

The architecture is intentionally simple to match current needs while being extensible for future enhancements. No database schema changes required except for the new Assets tab functionality.