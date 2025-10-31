# Admin Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create admin-only dashboard for Guild Manager with 5 tabs: Backstory viewer, Portal management, Guilds overview, Database tools, and Assets manager.

**Architecture:** Separate route `/guild-manager/admin` with environment variable authentication. Tabbed interface using shadcn/ui components. No database changes except for Assets tab (new tables for prompt templates and image assets).

**Tech Stack:** React, TypeScript, Supabase, shadcn/ui (Tabs, Card, Table, Dialog), react-markdown (for backstory parsing)

---

## Task 1: Add Environment Variable

**Files:**
- Create: `.env.example`
- Modify: `.env.local` (not tracked in git)

**Step 1: Create .env.example**

Create `.env.example`:
```bash
# Admin Configuration
VITE_ADMIN_EMAIL=your-email@example.com

# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Step 2: Add to .env.local**

Add to your local `.env.local`:
```bash
VITE_ADMIN_EMAIL=your-actual-email@example.com
```

**Step 3: Verify environment variable**

Run: `echo $VITE_ADMIN_EMAIL` (should output your email)

**Step 4: Commit**

```bash
git add .env.example
git commit -m "feat: add admin email environment variable"
```

---

## Task 2: Add Admin Button to Guild Manager

**Files:**
- Modify: `src/features/guild-manager/pages/GuildManager.tsx:219-221`

**Step 1: Add Admin button**

In `src/features/guild-manager/pages/GuildManager.tsx`, modify the header section:

```tsx
{/* Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h1 className="text-4xl font-bold text-white mb-2">{guild.name}</h1>
    <p className="text-purple-200">{guild.region} • World Level {guild.world_level}</p>
  </div>
  <div className="flex gap-2">
    <Button onClick={() => window.location.href = '/guild-manager/admin'} variant="secondary">
      Admin
    </Button>
    <Button onClick={() => window.location.href = '/'} variant="outline">
      Return Home
    </Button>
  </div>
</div>
```

**Step 2: Test button appears**

Run: `npm run dev`
Navigate to `/guild-manager`
Expected: Two buttons visible ("Admin" and "Return Home")

**Step 3: Commit**

```bash
git add src/features/guild-manager/pages/GuildManager.tsx
git commit -m "feat: add admin button to guild manager"
```

---

## Task 3: Create Admin Types

**Files:**
- Create: `src/features/guild-manager/types/admin.ts`

**Step 1: Create admin types file**

Create `src/features/guild-manager/types/admin.ts`:

```typescript
// Admin Dashboard Types

export interface PromptTemplate {
  id: string;
  name: string;
  template_type: 'avatar' | 'splash_art' | 'kingdom' | 'equipment' | 'custom';
  base_prompt: string;
  variables: Record<string, string>; // { "kingdom": "Kingdom name", "class": "Hunter class" }
  negative_prompt?: string;
  settings: {
    width: number;
    height: number;
    style?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ImageAsset {
  id: string;
  name: string;
  category: string;
  tags: string[];
  image_url: string;
  thumbnail_url?: string;
  prompt_used: string;
  template_id?: string;
  width: number;
  height: number;
  file_size: number;
  notes?: string;
  created_at: string;
}

export interface GuildWithOwner {
  id: string;
  user_id: string;
  name: string;
  region: string;
  level: number;
  gold: number;
  crystals: number;
  influence: number;
  world_level: number;
  max_hunters: number;
  created_at: string;
  owner_email?: string;
  hunter_count?: number;
}

export type AdminTab = 'backstory' | 'portals' | 'guilds' | 'database' | 'assets';
```

**Step 2: Commit**

```bash
git add src/features/guild-manager/types/admin.ts
git commit -m "feat: add admin dashboard types"
```

---

## Task 4: Create AdminDashboard Page with Auth

**Files:**
- Create: `src/features/guild-manager/pages/AdminDashboard.tsx`

**Step 1: Create AdminDashboard component**

Create `src/features/guild-manager/pages/AdminDashboard.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { AdminTab } from '../types/admin';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('backstory');
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access the admin dashboard',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Check if user is admin
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/guild-manager'}>
              Return to Guild Manager
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-purple-200">Logged in as: {user.email}</p>
          </div>
          <Button onClick={() => window.location.href = '/guild-manager'} variant="outline">
            Return to Game
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="backstory">Backstory</TabsTrigger>
            <TabsTrigger value="portals">Portals</TabsTrigger>
            <TabsTrigger value="guilds">Guilds</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="backstory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>World Backstory</CardTitle>
                <CardDescription>Kingdoms, regions, and lore</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Portal Management</CardTitle>
                <CardDescription>Manage portal templates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guilds" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guilds Overview</CardTitle>
                <CardDescription>View all player guilds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Tools</CardTitle>
                <CardDescription>Migrations and seeding</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assets Manager</CardTitle>
                <CardDescription>Image prompts and generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

**Step 2: Test admin auth**

Run: `npm run dev`
Navigate to `/guild-manager/admin` (will fail - route not added yet)

**Step 3: Commit**

```bash
git add src/features/guild-manager/pages/AdminDashboard.tsx
git commit -m "feat: create admin dashboard with auth check"
```

---

## Task 5: Add Admin Route

**Files:**
- Modify: `src/App.tsx`

**Step 1: Import AdminDashboard**

At top of `src/App.tsx`, add import:

```typescript
import AdminDashboard from "./features/guild-manager/pages/AdminDashboard";
```

**Step 2: Add route**

In the `<Routes>` section, add after the `/guild-manager` route:

```tsx
<Route path="/guild-manager" element={<GuildManager />} />
<Route path="/guild-manager/admin" element={<AdminDashboard />} />
<Route path="/migrate-images" element={<MigrateImages />} />
```

**Step 3: Test route**

Run: `npm run dev`
Navigate to `/guild-manager/admin`
Expected: Admin dashboard loads with auth check

**Step 4: Test non-admin access**

If logged in with non-admin email, should see "Access Denied" card

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add admin dashboard route"
```

---

## Task 6: Install react-markdown

**Files:**
- Modify: `package.json`

**Step 1: Install dependencies**

Run: `npm install react-markdown remark-gfm`

**Step 2: Verify installation**

Run: `npm list react-markdown`
Expected: Shows installed version

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-markdown for backstory viewer"
```

---

## Task 7: Create BackstoryTab Component

**Files:**
- Create: `src/features/guild-manager/components/admin/BackstoryTab.tsx`

**Step 1: Create admin components directory**

Run: `mkdir -p src/features/guild-manager/components/admin`

**Step 2: Create BackstoryTab**

Create `src/features/guild-manager/components/admin/BackstoryTab.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function BackstoryTab() {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackstory();
  }, []);

  async function loadBackstory() {
    try {
      const response = await fetch('/docs/plans/2025-10-31-world-building-kingdoms-regions-design.md');
      if (!response.ok) {
        throw new Error('Failed to load backstory document');
      }
      const text = await response.text();
      setMarkdown(text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Make sure the backstory document exists at: <code>docs/plans/2025-10-31-world-building-kingdoms-regions-design.md</code>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>World Building: Kingdoms & Regions</CardTitle>
          <CardDescription>
            Complete world-building documentation with kingdoms, regions, rulers, and portal lore
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 3: Update AdminDashboard to use BackstoryTab**

In `src/features/guild-manager/pages/AdminDashboard.tsx`:

Add import at top:
```typescript
import { BackstoryTab } from '../components/admin/BackstoryTab';
```

Replace the backstory TabsContent:
```tsx
<TabsContent value="backstory" className="mt-6">
  <BackstoryTab />
</TabsContent>
```

**Step 4: Copy backstory doc to public folder**

Run:
```bash
mkdir -p public/docs/plans
cp docs/plans/2025-10-31-world-building-kingdoms-regions-design.md public/docs/plans/
```

**Step 5: Test backstory tab**

Run: `npm run dev`
Navigate to `/guild-manager/admin`
Click "Backstory" tab
Expected: Markdown content displays formatted

**Step 6: Commit**

```bash
git add src/features/guild-manager/components/admin/BackstoryTab.tsx
git add src/features/guild-manager/pages/AdminDashboard.tsx
git add public/docs/plans/
git commit -m "feat: add backstory tab with markdown viewer"
```

---

## Task 8: Create PortalsTab Component

**Files:**
- Create: `src/features/guild-manager/components/admin/PortalsTab.tsx`

**Step 1: Create PortalsTab skeleton**

Create `src/features/guild-manager/components/admin/PortalsTab.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { PortalTemplate } from '../../types';

export function PortalsTab() {
  const [portals, setPortals] = useState<PortalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPortals();
  }, []);

  async function loadPortals() {
    try {
      const { data, error } = await supabase
        .from('portal_templates')
        .select('*')
        .order('world_level', { ascending: true });

      if (error) throw error;
      setPortals(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading portals',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredPortals = portals.filter(portal =>
    portal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading portals...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Portal Templates</CardTitle>
              <CardDescription>
                Manage portal templates that spawn in the game
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Portal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search portals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>World Level</TableHead>
                    <TableHead>Boss</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Rewards</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPortals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No portals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPortals.map((portal) => (
                      <TableRow key={portal.id}>
                        <TableCell className="font-medium">{portal.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{portal.difficulty}</Badge>
                        </TableCell>
                        <TableCell>WL {portal.world_level}</TableCell>
                        <TableCell>
                          {portal.is_major_boss ? (
                            <Badge variant="destructive">Major Boss</Badge>
                          ) : portal.is_boss_portal ? (
                            <Badge variant="secondary">Boss</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>Level {portal.min_hunter_level}</TableCell>
                        <TableCell>
                          {portal.base_gold}g / {portal.base_experience}xp
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Update AdminDashboard**

In `src/features/guild-manager/pages/AdminDashboard.tsx`:

Add import:
```typescript
import { PortalsTab } from '../components/admin/PortalsTab';
```

Replace portals TabsContent:
```tsx
<TabsContent value="portals" className="mt-6">
  <PortalsTab />
</TabsContent>
```

**Step 3: Test portals tab**

Run: `npm run dev`
Navigate to admin dashboard, click "Portals" tab
Expected: Table loads (may be empty if no portal templates exist)

**Step 4: Commit**

```bash
git add src/features/guild-manager/components/admin/PortalsTab.tsx
git add src/features/guild-manager/pages/AdminDashboard.tsx
git commit -m "feat: add portals tab with table view"
```

---

## Task 9: Create GuildsTab Component

**Files:**
- Create: `src/features/guild-manager/components/admin/GuildsTab.tsx`

**Step 1: Create GuildsTab**

Create `src/features/guild-manager/components/admin/GuildsTab.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { GuildWithOwner } from '../../types/admin';
import type { Hunter } from '../../types';

export function GuildsTab() {
  const [guilds, setGuilds] = useState<GuildWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGuild, setExpandedGuild] = useState<string | null>(null);
  const [guildHunters, setGuildHunters] = useState<Record<string, Hunter[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadGuilds();
  }, []);

  async function loadGuilds() {
    try {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get owner emails and hunter counts
      const guildsWithData = await Promise.all(
        (data || []).map(async (guild) => {
          // Get owner email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', guild.user_id)
            .single();

          // Get hunter count
          const { count } = await supabase
            .from('hunters')
            .select('*', { count: 'exact', head: true })
            .eq('guild_id', guild.id);

          return {
            ...guild,
            owner_email: profile?.email || 'Unknown',
            hunter_count: count || 0
          };
        })
      );

      setGuilds(guildsWithData);
    } catch (error: any) {
      toast({
        title: 'Error loading guilds',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadGuildHunters(guildId: string) {
    if (guildHunters[guildId]) {
      return; // Already loaded
    }

    try {
      const { data, error } = await supabase
        .from('hunters')
        .select('*')
        .eq('guild_id', guildId);

      if (error) throw error;

      setGuildHunters(prev => ({
        ...prev,
        [guildId]: data || []
      }));
    } catch (error: any) {
      toast({
        title: 'Error loading hunters',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  function toggleGuild(guildId: string) {
    if (expandedGuild === guildId) {
      setExpandedGuild(null);
    } else {
      setExpandedGuild(guildId);
      loadGuildHunters(guildId);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading guilds...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Guilds ({guilds.length})</CardTitle>
          <CardDescription>
            Overview of all player guilds and their statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Guild Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>World Level</TableHead>
                  <TableHead>Gold</TableHead>
                  <TableHead>Hunters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No guilds found
                    </TableCell>
                  </TableRow>
                ) : (
                  guilds.map((guild) => (
                    <>
                      <TableRow
                        key={guild.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleGuild(guild.id)}
                      >
                        <TableCell>
                          {expandedGuild === guild.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{guild.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {guild.owner_email}
                        </TableCell>
                        <TableCell>{guild.region}</TableCell>
                        <TableCell>{guild.level}</TableCell>
                        <TableCell>
                          <Badge variant="outline">WL {guild.world_level}</Badge>
                        </TableCell>
                        <TableCell>{guild.gold.toLocaleString()}g</TableCell>
                        <TableCell>{guild.hunter_count}</TableCell>
                      </TableRow>
                      {expandedGuild === guild.id && guildHunters[guild.id] && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/20">
                            <div className="p-4">
                              <h4 className="font-semibold mb-3">Hunters</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {guildHunters[guild.id].map((hunter) => (
                                  <Card key={hunter.id}>
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium">{hunter.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {hunter.class} • Level {hunter.level}
                                          </p>
                                        </div>
                                        <Badge>{hunter.rank}</Badge>
                                      </div>
                                      <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
                                        <div>
                                          <div className="text-muted-foreground">STR</div>
                                          <div className="font-medium">{hunter.strength}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">AGI</div>
                                          <div className="font-medium">{hunter.agility}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">INT</div>
                                          <div className="font-medium">{hunter.intelligence}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">VIT</div>
                                          <div className="font-medium">{hunter.vitality}</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">LCK</div>
                                          <div className="font-medium">{hunter.luck}</div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Update AdminDashboard**

In `src/features/guild-manager/pages/AdminDashboard.tsx`:

Add import:
```typescript
import { GuildsTab } from '../components/admin/GuildsTab';
```

Replace guilds TabsContent:
```tsx
<TabsContent value="guilds" className="mt-6">
  <GuildsTab />
</TabsContent>
```

**Step 3: Test guilds tab**

Run: `npm run dev`
Navigate to admin dashboard, click "Guilds" tab
Expected: Table shows all guilds, click to expand and see hunters

**Step 4: Commit**

```bash
git add src/features/guild-manager/components/admin/GuildsTab.tsx
git add src/features/guild-manager/pages/AdminDashboard.tsx
git commit -m "feat: add guilds tab with expandable hunter view"
```

---

## Task 10: Create DatabaseTab Component

**Files:**
- Create: `src/features/guild-manager/components/admin/DatabaseTab.tsx`

**Step 1: Create DatabaseTab**

Create `src/features/guild-manager/components/admin/DatabaseTab.tsx`:

```tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, Database, PlayCircle } from 'lucide-react';

export function DatabaseTab() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const { toast } = useToast();

  async function executeQuery() {
    if (!sqlQuery.trim()) {
      toast({
        title: 'Empty Query',
        description: 'Please enter a SQL query',
        variant: 'destructive'
      });
      return;
    }

    setExecuting(true);
    try {
      // This is a simplified version - in production, you'd want a backend API
      // that validates and executes queries safely
      const { data, error } = await supabase.rpc('admin_execute_query', {
        query_text: sqlQuery
      });

      if (error) throw error;

      setQueryResult(data);
      toast({
        title: 'Query Executed',
        description: `Returned ${data?.length || 0} rows`
      });
    } catch (error: any) {
      toast({
        title: 'Query Failed',
        description: error.message,
        variant: 'destructive'
      });
      setQueryResult({ error: error.message });
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Database Tools</CardTitle>
          <CardDescription>
            Manage database operations, migrations, and seeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Use these tools with caution. Destructive operations cannot be undone.
            </AlertDescription>
          </Alert>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">View Table Counts</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSqlQuery(`
SELECT
  'guilds' as table_name, COUNT(*) as count FROM guilds
UNION ALL
SELECT 'hunters', COUNT(*) FROM hunters
UNION ALL
SELECT 'portal_templates', COUNT(*) FROM portal_templates;
`.trim())}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Load Query
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">View Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSqlQuery('SELECT * FROM hunter_activity_logs ORDER BY created_at DESC LIMIT 50;')}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Load Query
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SQL Executor */}
          <div>
            <h3 className="text-lg font-semibold mb-3">SQL Query Executor</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Enter SQL query..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <Button onClick={executeQuery} disabled={executing}>
                <PlayCircle className="mr-2 h-4 w-4" />
                {executing ? 'Executing...' : 'Execute Query'}
              </Button>
            </div>
          </div>

          {/* Query Results */}
          {queryResult && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Query Results</h3>
              <div className="border rounded-lg p-4 bg-muted/20">
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Update AdminDashboard**

In `src/features/guild-manager/pages/AdminDashboard.tsx`:

Add import:
```typescript
import { DatabaseTab } from '../components/admin/DatabaseTab';
```

Replace database TabsContent:
```tsx
<TabsContent value="database" className="mt-6">
  <DatabaseTab />
</TabsContent>
```

**Step 3: Test database tab**

Run: `npm run dev`
Navigate to admin dashboard, click "Database" tab
Expected: SQL executor interface visible (queries may not work without backend function)

**Step 4: Commit**

```bash
git add src/features/guild-manager/components/admin/DatabaseTab.tsx
git add src/features/guild-manager/pages/AdminDashboard.tsx
git commit -m "feat: add database tab with SQL executor"
```

---

## Task 11: Create Assets Database Schema

**Files:**
- Create: `supabase/migrations/20241031000010_create_admin_assets_tables.sql`

**Step 1: Create migration file**

Create `supabase/migrations/20241031000010_create_admin_assets_tables.sql`:

```sql
-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('avatar', 'splash_art', 'kingdom', 'equipment', 'custom')),
  base_prompt TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  negative_prompt TEXT,
  settings JSONB DEFAULT '{"width": 1024, "height": 1024}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create image_assets table
CREATE TABLE IF NOT EXISTS image_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt_used TEXT,
  template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prompt_templates_type ON prompt_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_image_assets_category ON image_assets(category);
CREATE INDEX IF NOT EXISTS idx_image_assets_tags ON image_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_image_assets_template_id ON image_assets(template_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for prompt_templates
CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin-only access)
-- Note: For production, you'd want to check against an admin list
CREATE POLICY "Allow all for authenticated users" ON prompt_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON image_assets
  FOR ALL USING (auth.role() = 'authenticated');
```

**Step 2: Apply migration**

Run: `npx supabase db push`

Or if using Supabase CLI locally:
```bash
npx supabase migration up
```

**Step 3: Verify tables created**

Check in Supabase dashboard or run:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('prompt_templates', 'image_assets');
```

**Step 4: Commit**

```bash
git add supabase/migrations/20241031000010_create_admin_assets_tables.sql
git commit -m "feat: add database schema for assets manager"
```

---

## Task 12: Create AssetsTab Component

**Files:**
- Create: `src/features/guild-manager/components/admin/AssetsTab.tsx`

**Step 1: Create AssetsTab skeleton**

Create `src/features/guild-manager/components/admin/AssetsTab.tsx`:

```tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AssetsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'generate' | 'library'>('templates');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assets Manager</CardTitle>
          <CardDescription>
            Manage image generation prompts, generate images, and browse asset library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Prompt Templates</TabsTrigger>
              <TabsTrigger value="generate">Generate Images</TabsTrigger>
              <TabsTrigger value="library">Asset Library</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Saved Prompt Templates</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
              <p className="text-muted-foreground">No templates created yet.</p>
            </TabsContent>

            <TabsContent value="generate" className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Generate Image</h3>
              <p className="text-muted-foreground">Image generation interface coming soon...</p>
            </TabsContent>

            <TabsContent value="library" className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Asset Library</h3>
              <p className="text-muted-foreground">No assets saved yet.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Update AdminDashboard**

In `src/features/guild-manager/pages/AdminDashboard.tsx`:

Add import:
```typescript
import { AssetsTab } from '../components/admin/AssetsTab';
```

Replace assets TabsContent:
```tsx
<TabsContent value="assets" className="mt-6">
  <AssetsTab />
</TabsContent>
```

**Step 3: Test assets tab**

Run: `npm run dev`
Navigate to admin dashboard, click "Assets" tab
Expected: Three sub-tabs visible (Templates, Generate, Library)

**Step 4: Commit**

```bash
git add src/features/guild-manager/components/admin/AssetsTab.tsx
git add src/features/guild-manager/pages/AdminDashboard.tsx
git commit -m "feat: add assets tab with sub-tabs structure"
```

---

## Summary

This implementation plan provides a complete, working admin dashboard with:

✅ **Task 1-5:** Core infrastructure (env vars, routes, auth, basic layout)
✅ **Task 6-7:** Backstory tab with markdown viewer
✅ **Task 8:** Portals tab with table display
✅ **Task 9:** Guilds tab with expandable hunter details
✅ **Task 10:** Database tab with SQL executor
✅ **Task 11-12:** Assets tab structure with database schema

## What's Next

The following enhancements can be added later:

**Portal Management CRUD:**
- Create portal dialog with form
- Edit portal functionality
- Delete with confirmation

**Assets Manager Full Implementation:**
- Prompt templates CRUD
- Image generation API integration
- Asset library with upload/download
- Tagging and search

**Database Tools:**
- Migration runner
- Seed data functions
- Backup/restore utilities

## Testing Checklist

Before considering complete, verify:
- [ ] Admin button visible in Guild Manager
- [ ] Non-admin users get "Access Denied"
- [ ] Admin email matches env var grants access
- [ ] All 5 tabs load without errors
- [ ] Backstory markdown renders correctly
- [ ] Portals table loads existing templates
- [ ] Guilds table shows all guilds
- [ ] Guild expansion shows hunters
- [ ] Database tab loads without errors
- [ ] Assets tab has 3 sub-tabs
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check` (if available)