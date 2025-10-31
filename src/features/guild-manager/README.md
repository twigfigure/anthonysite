# Guild Manager Game

A Solo Leveling-inspired guild management game where you build and manage a guild of hunters, send them on portal raids, collect equipment and materials, and progress through world levels.

## Features Implemented (MVP)

### Core Systems
- **Guild Management**: Create and manage your guild with stats tracking (gold, crystals, influence, world level)
- **Hunter System**: Recruit, view, and manage hunters with detailed stats and progression
- **Portal System**: View available portals based on world level (assignment functionality coming soon)
- **Ranks**: F, E, D, C, B, A, S, SS, SSS hunter ranks
- **Classes**: Fighter, Tank, Mage, Healer, Assassin, Ranger, Support
- **Portal Difficulties**: Blue, Green, Yellow, Orange, Red, Purple, Black

### UI Components
- Guild overview dashboard with key stats
- Hunter list with status indicators
- Detailed hunter profile view
- Hunter recruitment system with customizable stats
- Portal list with difficulty indicators
- Responsive design with dark theme

## File Structure

```
src/features/guild-manager/
├── components/
│   ├── GuildOverview.tsx       # Guild stats dashboard
│   ├── HunterList.tsx           # List of all hunters
│   ├── HunterDetails.tsx        # Detailed hunter view
│   ├── RecruitHunterDialog.tsx  # Recruit new hunters
│   └── PortalList.tsx           # Available portals
├── lib/
│   ├── supabase.ts              # Database service functions
│   └── gameHelpers.ts           # Game calculations and utilities
├── pages/
│   └── GuildManager.tsx         # Main page component
├── types/
│   └── index.ts                 # TypeScript interfaces
└── README.md                     # This file

supabase/migrations/guild-manager/
└── 001_guild_manager_schema.sql # Database schema
```

## Database Schema

### Main Tables
- **guilds**: Guild information and progression
- **hunters**: Hunter stats, classes, and attributes
- **equipment**: Gear and artifacts
- **portals**: Portal instances
- **portal_templates**: Base portal configurations
- **hunter_equipment**: Hunter inventory
- **portal_assignments**: Active assignments
- **guild_buildings**: Building system
- **world_bosses**: Boss encounters
- **materials**: Crafting materials
- **skill_books**: Learnable skills

See `/supabase/migrations/guild-manager/001_guild_manager_schema.sql` for full schema.

## Game Mechanics

### Hunter Stats
- **Base Stats**: Strength, Agility, Intelligence, Vitality, Luck
- **Combat Stats**: HP, Mana, Attack Power, Magic Power, Defense, Magic Resistance
- **Progression**: Experience-based leveling with class-specific stat gains

### Death System
- Hunters can die in missions
- Respawn timer increases with each death (5 minutes base + 5 min per death, max 60 min)
- Experience penalty on death (10% base + 2% per previous death, max 50%)

### Combat Power
Calculated from all stats to give an overall power rating for hunters.

### Portal System
- Portals have difficulty ratings (Blue = easiest, Black = disaster level)
- Each world level unlocks new portal types
- Defeating the major boss progresses to the next world level
- Success rate calculated based on hunter levels and combat power

## Setup Instructions

### 1. Run Database Migration

```bash
# Apply the Guild Manager schema to your Supabase instance
# Copy the contents of supabase/migrations/guild-manager/001_guild_manager_schema.sql
# and run it in your Supabase SQL editor
```

### 2. Access the Game

Navigate to `/guild-manager` on your website.

### 3. Authentication

The game requires user authentication. Users must be logged in to create and manage a guild.

## Starter Experience

When a new user visits the Guild Manager for the first time:
1. A guild is automatically created with their email as the base name
2. They receive a B-rank Fighter (Starter Hunter) at level 10
3. They receive a C-rank Support (Guild Administrator) at level 5
4. Starting resources: 5,000 gold, 0 crystals

## Future Features (Planned)

### Phase 2: Core Gameplay
- [ ] Portal assignment system (assign hunters to portals)
- [ ] Mission completion and rewards
- [ ] Auto-assignment feature
- [ ] Real-time mission tracking
- [ ] Equipment drops and inventory management
- [ ] Hunter equipment system

### Phase 3: Progression
- [ ] Building construction and upgrades
- [ ] Material gathering and crafting
- [ ] Skill book learning system
- [ ] World boss battles
- [ ] World level progression

### Phase 4: Advanced Features
- [ ] Guild vs Guild portal rights competition
- [ ] Hunter permadeath option
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Daily quests
- [ ] Premium currency shop

### Phase 5: Multiplayer
- [ ] Guild alliances
- [ ] Cooperative raids
- [ ] PvP arena
- [ ] Trading system

## Game Balance Constants

### Experience Curve
- Level up XP = 100 * (1.5 ^ (level - 1))
- Exponential growth to keep progression meaningful

### Rank Multipliers
| Rank | Multiplier | Description |
|------|-----------|-------------|
| F    | 0.5       | Weakest     |
| E    | 0.7       |             |
| D    | 0.9       |             |
| C    | 1.0       | Standard    |
| B    | 1.2       |             |
| A    | 1.5       |             |
| S    | 2.0       | Elite       |
| SS   | 2.5       |             |
| SSS  | 3.0       | Legendary   |

### Portal Difficulties by World Level
| World Level | Common Portal | Boss Portal |
|-------------|---------------|-------------|
| 1           | Blue          | Green       |
| 2           | Green         | Yellow      |
| 3           | Yellow        | Orange      |
| 4-5         | Orange        | Red         |
| 6-7         | Red           | Purple      |
| 8-10        | Purple        | Black       |

## Development Notes

### Separation from Other Projects
All Guild Manager code is contained within:
- `/src/features/guild-manager/` (frontend)
- `/supabase/migrations/guild-manager/` (database)

This ensures clean separation from other projects like Kindred and Fantasy Basketball.

### Tech Stack
- **Frontend**: React 18, TypeScript
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **State**: React Context + TanStack Query
- **Backend**: Supabase (PostgreSQL)
- **Build**: Vite

### Performance Considerations
- Indexes on frequently queried columns (guild_id, hunter_id, etc.)
- Pagination for large hunter lists (50-100 hunters per guild)
- Optimistic updates for better UX

## Contributing

When adding new features:
1. Keep all code within the `guild-manager` feature folder
2. Update types in `/types/index.ts`
3. Add database changes to a new migration file
4. Update this README with new features
5. Test TypeScript compilation: `npx tsc --noEmit`

## Route

Access the game at: `/guild-manager`

## Contact

For questions or suggestions about Guild Manager, please reach out!
