import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, BarChart3, Settings, AlertTriangle, Wallet, Search, FileSpreadsheet, X, ChevronDown, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as XLSX from 'xlsx';

interface LeagueSettings {
  scoringType: string;
  allowDraftPickTrades: boolean;
  allowInjuredToIL: boolean;
  rosterPositions: string;
  statCategories: string[];
  teamCount?: number;
  budgetPerTeam?: number;
  bidTime?: number;
  nominationTime?: number;
  teamNames?: string[];
}

interface PlayerData {
  round: number;
  rank: number;
  value: number; // BBM value metric
  name: string;
  team: string;
  position: string;
  injury: string;
  gamesPlayed: number;
  minutesPerGame: number;
  pointsPerGame: number;
  threePointersPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  fgPercentage: number;
  ftPercentage: number;
  turnoversPerGame: number;
  usage: number;
  // Value metrics
  pointsValue: number;
  threeValue: number;
  reboundsValue: number;
  assistsValue: number;
  stealsValue: number;
  blocksValue: number;
  fgPercentageValue: number;
  ftPercentageValue: number;
  turnoversValue: number;
  // Optional auction data
  auctionValue?: number;
}

interface DraftedPlayer {
  name: string;
  position: string;
  projectedValue: number;
  actualPrice: number;
  draftedBy: string; // 'me' or opponent team name
}

interface OpponentTeam {
  name: string;
  budget: number;
  players: DraftedPlayer[];
}

interface PositionInflation {
  position: string;
  averageInflation: number; // percentage
  count: number;
  tier1Inflation?: number;
  tier2Inflation?: number;
  tier3Inflation?: number;
}

const STAT_CATEGORIES = [
  { id: 'fg%', label: 'Field Goal Percentage (FG%)', scarcity: 'medium' },
  { id: 'ft%', label: 'Free Throw Percentage (FT%)', scarcity: 'medium' },
  { id: '3ptm', label: '3-point Shots Made (3PTM)', scarcity: 'low' },
  { id: 'pts', label: 'Points Scored (PTS)', scarcity: 'low' },
  { id: 'reb', label: 'Total Rebounds (REB)', scarcity: 'low' },
  { id: 'ast', label: 'Assists (AST)', scarcity: 'high' },
  { id: 'st', label: 'Steals (ST)', scarcity: 'medium' },
  { id: 'blk', label: 'Blocked Shots (BLK)', scarcity: 'high' },
  { id: 'to', label: 'Turnovers (TO)', scarcity: 'low' },
];

// Category scarcity weights for scoring (higher = more valuable)
const SCARCITY_WEIGHTS: Record<string, number> = {
  'blk': 2.5,  // Rarest stat
  'ast': 2.0,  // Very scarce
  'st': 1.5,   // Somewhat scarce
  'fg%': 1.3,
  'ft%': 1.3,
  '3ptm': 1.0,
  'reb': 0.8,
  'pts': 0.5,  // Most abundant stat
  'to': 1.0,
};

// Player tier definitions based on BBM value
interface PlayerTier {
  name: string;
  minValue: number;
  maxValue: number;
  priceRange: string;
  description: string;
}

const PLAYER_TIERS: PlayerTier[] = [
  { name: 'Tier 1', minValue: 0.19, maxValue: 100, priceRange: '$45-60', description: 'Elite MVP-level anchors (Top 15%)' },
  { name: 'Tier 2', minValue: 0.03, maxValue: 0.18, priceRange: '$25-40', description: 'All-Star caliber players (Top 35%)' },
  { name: 'Tier 3', minValue: -0.18, maxValue: 0.02, priceRange: '$10-20', description: 'Solid starters (Top 60%)' },
  { name: 'Tier 4', minValue: -10, maxValue: -0.19, priceRange: '$1-5', description: 'Role players & specialists (Bottom 40%)' },
];

// Player archetype definitions
type PlayerArchetype =
  | 'Assist Anchor'
  | 'Rebound/Blocks Anchor'
  | 'Efficient Scorer'
  | '3PT Specialist'
  | 'Steals Specialist'
  | 'Low-TO Glue Guy'
  | 'Multi-Cat Contributor'
  | 'FG% Anchor'
  | 'FT% Anchor';

// Helper functions for player classification
function getPlayerTier(player: PlayerData): PlayerTier {
  for (const tier of PLAYER_TIERS) {
    if (player.value >= tier.minValue && player.value <= tier.maxValue) {
      return tier;
    }
  }
  return PLAYER_TIERS[PLAYER_TIERS.length - 1]; // Default to lowest tier
}

function getPlayerArchetypes(player: PlayerData): PlayerArchetype[] {
  const archetypes: PlayerArchetype[] = [];

  // Assist Anchor (8+ assists)
  if (player.assistsPerGame >= 8.0) {
    archetypes.push('Assist Anchor');
  }

  // Rebound/Blocks Anchor (10+ reb OR 2+ blk)
  if (player.reboundsPerGame >= 10.0 || player.blocksPerGame >= 2.0) {
    archetypes.push('Rebound/Blocks Anchor');
  }

  // Efficient Scorer (20+ pts with 50%+ FG and 85%+ FT)
  if (player.pointsPerGame >= 20.0 && player.fgPercentage >= 0.50 && player.ftPercentage >= 0.85) {
    archetypes.push('Efficient Scorer');
  }

  // FT% Anchor (high volume FT at high %)
  if (player.ftPercentage >= 0.88 && player.pointsPerGame >= 15) {
    archetypes.push('FT% Anchor');
  }

  // FG% Anchor (high FG% with volume)
  if (player.fgPercentage >= 0.58 && player.pointsPerGame >= 10) {
    archetypes.push('FG% Anchor');
  }

  // 3PT Specialist (2.5+ threes per game)
  if (player.threePointersPerGame >= 2.5) {
    archetypes.push('3PT Specialist');
  }

  // Steals Specialist (1.5+ steals)
  if (player.stealsPerGame >= 1.5) {
    archetypes.push('Steals Specialist');
  }

  // Low-TO Glue Guy (low TO with multi-cat contributions)
  if (player.turnoversPerGame <= 1.5 && player.pointsPerGame >= 10) {
    archetypes.push('Low-TO Glue Guy');
  }

  // Multi-Cat Contributor (contributes to 5+ categories at decent levels)
  const catCount = [
    player.pointsPerGame >= 12,
    player.reboundsPerGame >= 4,
    player.assistsPerGame >= 3,
    player.stealsPerGame >= 0.8,
    player.blocksPerGame >= 0.5,
    player.threePointersPerGame >= 1.0,
    player.fgPercentage >= 0.45,
    player.ftPercentage >= 0.75,
  ].filter(Boolean).length;

  if (catCount >= 5 && archetypes.length === 0) {
    archetypes.push('Multi-Cat Contributor');
  }

  return archetypes.length > 0 ? archetypes : ['Multi-Cat Contributor'];
}

// Calculate player value based on punt strategy
function calculatePuntAdjustedValue(
  player: PlayerData,
  puntCategories: string[]
): number {
  let score = 0;

  // Weight each category by scarcity, skip punted categories
  if (!puntCategories.includes('pts')) {
    score += player.pointsValue * SCARCITY_WEIGHTS['pts'];
  }
  if (!puntCategories.includes('reb')) {
    score += player.reboundsValue * SCARCITY_WEIGHTS['reb'];
  }
  if (!puntCategories.includes('ast')) {
    score += player.assistsValue * SCARCITY_WEIGHTS['ast'];
  }
  if (!puntCategories.includes('st')) {
    score += player.stealsValue * SCARCITY_WEIGHTS['st'];
  }
  if (!puntCategories.includes('blk')) {
    score += player.blocksValue * SCARCITY_WEIGHTS['blk'];
  }
  if (!puntCategories.includes('3ptm')) {
    score += player.threeValue * SCARCITY_WEIGHTS['3ptm'];
  }
  if (!puntCategories.includes('fg%')) {
    score += player.fgPercentageValue * SCARCITY_WEIGHTS['fg%'];
  }
  if (!puntCategories.includes('ft%')) {
    score += player.ftPercentageValue * SCARCITY_WEIGHTS['ft%'];
  }
  if (!puntCategories.includes('to')) {
    score += player.turnoversValue * SCARCITY_WEIGHTS['to'];
  }

  return score;
}

// Analyze team's category strengths
function analyzeTeamCategories(
  players: DraftedPlayer[],
  playerDatabase: PlayerData[]
): { coverage: Record<string, number>; strength: Record<string, 'strong' | 'average' | 'weak'> } | null {
  if (players.length === 0) return null;

  const playerData = players
    .map(p => playerDatabase.find(pd => pd.name.toLowerCase() === p.name.toLowerCase()))
    .filter((p): p is PlayerData => p !== undefined);

  if (playerData.length === 0) return null;

  const coverage = {
    pts: playerData.reduce((sum, p) => sum + p.pointsPerGame, 0) / playerData.length,
    reb: playerData.reduce((sum, p) => sum + p.reboundsPerGame, 0) / playerData.length,
    ast: playerData.reduce((sum, p) => sum + p.assistsPerGame, 0) / playerData.length,
    st: playerData.reduce((sum, p) => sum + p.stealsPerGame, 0) / playerData.length,
    blk: playerData.reduce((sum, p) => sum + p.blocksPerGame, 0) / playerData.length,
    '3ptm': playerData.reduce((sum, p) => sum + p.threePointersPerGame, 0) / playerData.length,
    'fg%': playerData.reduce((sum, p) => sum + p.fgPercentage, 0) / playerData.length,
    'ft%': playerData.reduce((sum, p) => sum + p.ftPercentage, 0) / playerData.length,
    to: playerData.reduce((sum, p) => sum + p.turnoversPerGame, 0) / playerData.length,
  };

  const leagueAvg = {
    pts: 15, reb: 5, ast: 4, st: 1.0, blk: 0.8, '3ptm': 1.5, 'fg%': 0.45, 'ft%': 0.78, to: 2.0
  };

  const strength: Record<string, 'strong' | 'average' | 'weak'> = {};
  Object.entries(coverage).forEach(([cat, val]) => {
    const avg = leagueAvg[cat as keyof typeof leagueAvg];
    if (cat === 'to') {
      strength[cat] = val < avg * 0.9 ? 'strong' : val > avg * 1.1 ? 'weak' : 'average';
    } else {
      strength[cat] = val > avg * 1.1 ? 'strong' : val < avg * 0.9 ? 'weak' : 'average';
    }
  });

  return { coverage, strength };
}

// Calculate head-to-head matchup projection
function calculateH2HMatchup(
  myStrength: Record<string, 'strong' | 'average' | 'weak'>,
  opponentStrength: Record<string, 'strong' | 'average' | 'weak'>,
  puntCategories: string[]
): { wins: number; losses: number; categoryResults: Record<string, 'win' | 'loss' | 'toss-up'> } {
  const categoryResults: Record<string, 'win' | 'loss' | 'toss-up'> = {};
  let wins = 0;
  let losses = 0;

  Object.keys(myStrength).forEach(cat => {
    if (puntCategories.includes(cat)) {
      categoryResults[cat] = 'loss'; // Assume loss if punting
      losses++;
      return;
    }

    const myS = myStrength[cat];
    const oppS = opponentStrength[cat];

    if (myS === 'strong' && oppS !== 'strong') {
      categoryResults[cat] = 'win';
      wins++;
    } else if (myS !== 'strong' && oppS === 'strong') {
      categoryResults[cat] = 'loss';
      losses++;
    } else {
      categoryResults[cat] = 'toss-up';
    }
  });

  return { wins, losses, categoryResults };
}

// Bid Calculator Component
function BidCalculator({
  maxBid,
  getBidRecommendation,
  calculateRecommendedMaxBid,
}: {
  maxBid: number;
  getBidRecommendation: (currentBid: number, projectedValue: number) => {
    shouldBid: boolean;
    message: string;
    color: 'green' | 'orange' | 'red';
  };
  calculateRecommendedMaxBid: (projectedValue: number, fillsTwoNeeds?: boolean) => number;
}) {
  const [testProjectedValue, setTestProjectedValue] = useState('');
  const [testCurrentBid, setTestCurrentBid] = useState('');
  const [fillsTwoNeeds, setFillsTwoNeeds] = useState(false);

  const recommendation = testProjectedValue && testCurrentBid
    ? getBidRecommendation(parseFloat(testCurrentBid), parseFloat(testProjectedValue))
    : null;

  const recommendedMax = testProjectedValue
    ? calculateRecommendedMaxBid(parseFloat(testProjectedValue), fillsTwoNeeds)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="test-projected">Player's Projected Value ($)</Label>
          <Input
            id="test-projected"
            type="number"
            placeholder="e.g., 45"
            value={testProjectedValue}
            onChange={(e) => setTestProjectedValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-bid">Current Bid ($)</Label>
          <Input
            id="test-bid"
            type="number"
            placeholder="e.g., 50"
            value={testCurrentBid}
            onChange={(e) => setTestCurrentBid(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fills-two-needs"
          checked={fillsTwoNeeds}
          onCheckedChange={(checked) => setFillsTwoNeeds(checked === true)}
        />
        <Label htmlFor="fills-two-needs" className="font-normal cursor-pointer text-sm">
          This player fills 2+ categorical needs (allows 25% overpay)
        </Label>
      </div>

      {recommendation && (
        <div className="space-y-3">
          <Alert
            className={
              recommendation.color === 'green'
                ? 'border-green-300 bg-green-50'
                : recommendation.color === 'orange'
                ? 'border-orange-300 bg-orange-50'
                : 'border-red-300 bg-red-50'
            }
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                recommendation.color === 'green'
                  ? 'text-green-600'
                  : recommendation.color === 'orange'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            />
            <AlertDescription
              className={`text-sm font-medium ${
                recommendation.color === 'green'
                  ? 'text-green-800'
                  : recommendation.color === 'orange'
                  ? 'text-orange-800'
                  : 'text-red-800'
              }`}
            >
              {recommendation.message}
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Your Max Bid (Slot-Aware)</p>
                <p className="text-xl font-bold text-blue-900">${maxBid}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Recommended Max (15% Rule)</p>
                <p className="text-xl font-bold text-blue-900">${recommendedMax.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Strategy:</strong> Never exceed the lower of these two values unless the player fills multiple critical needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FantasyBasketball() {
  const [leagueSettings, setLeagueSettings] = useState<LeagueSettings>({
    scoringType: 'Head-to-Head - Categories',
    allowDraftPickTrades: false,
    allowInjuredToIL: true,
    rosterPositions: 'G, G, G, F, F, F, C, Util, Util, BN, BN, BN, BN, IL, IL, IL+',
    statCategories: ['fg%', 'ft%', '3ptm', 'pts', 'reb', 'ast', 'st', 'blk', 'to'],
    teamCount: 10,
    budgetPerTeam: 200,
    bidTime: 20,
    nominationTime: 15,
    teamNames: Array.from({ length: 10 }, (_, i) => `Team ${i + 1}`),
  });

  const [playerDatabase, setPlayerDatabase] = useState<PlayerData[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<DraftedPlayer[]>([]);
  const [myPlayers, setMyPlayers] = useState<DraftedPlayer[]>([]);
  const [budgetRemaining, setBudgetRemaining] = useState(leagueSettings.budgetPerTeam || 200);
  const [draftInProgress, setDraftInProgress] = useState(false);
  const [playerSearch] = useState('');
  const [showLeagueSettings, setShowLeagueSettings] = useState(false);
  const [tableFilter, setTableFilter] = useState<'all' | 'available' | 'drafted'>('available');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  // Punt strategy state
  const [puntCategories, setPuntCategories] = useState<string[]>([]);

  // Opponent tracking state
  const [opponentTeams, setOpponentTeams] = useState<OpponentTeam[]>([]);

  // Draft entry form state
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [projectedValue, setProjectedValue] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [draftedByMe, setDraftedByMe] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<string>('');

  // Nomination modal state
  const [nominatedPlayer, setNominatedPlayer] = useState<PlayerData | null>(null);
  const [nominationPrice, setNominationPrice] = useState('');
  const [nominationTeam, setNominationTeam] = useState<string>('');
  const [nominationIsMine, setNominationIsMine] = useState(false);

  // Table search state
  const [tableSearch, setTableSearch] = useState('');

  // Player database tab state
  const [playerDatabaseTab, setPlayerDatabaseTab] = useState<'players' | 'history'>('players');

  // Draft history edit state
  const [editingDraftIndex, setEditingDraftIndex] = useState<number | null>(null);
  const [editDraftTeam, setEditDraftTeam] = useState<string>('');
  const [editDraftPrice, setEditDraftPrice] = useState<string>('');

  // Collapsible state for opponent teams in competitive analysis
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  // Selected team for roster view
  const [selectedTeamView, setSelectedTeamView] = useState<string>('My Team');

  // Get drafted player names for lookup
  const draftedPlayerNames = useMemo(() =>
    new Set(draftedPlayers.map(p => p.name.toLowerCase())),
    [draftedPlayers]
  );

  // Get available players (excluding drafted and seriously injured)
  const availablePlayers = useMemo(() =>
    playerDatabase.filter(p => {
      // Exclude drafted players
      if (draftedPlayerNames.has(p.name.toLowerCase())) return false;

      // Exclude players with serious injuries
      const injury = p.injury?.toLowerCase() || '';
      if (injury.includes('out for season') ||
          injury.includes('out indefinitely') ||
          injury.includes('out for year')) {
        return false;
      }

      return true;
    }),
    [playerDatabase, draftedPlayerNames]
  );

  // Calculate roster slots from settings
  const totalSlots = useMemo(() => {
    const positions = leagueSettings.rosterPositions.split(',').map(p => p.trim());
    // Count non-bench, non-IL slots
    return positions.filter(p => !p.startsWith('BN') && !p.startsWith('IL')).length;
  }, [leagueSettings.rosterPositions]);

  const slotsRemaining = totalSlots - myPlayers.length;

  // Calculate slot-aware max bid
  const maxBid = useMemo(() => {
    if (slotsRemaining <= 0) return 0;
    return budgetRemaining - (slotsRemaining - 1);
  }, [budgetRemaining, slotsRemaining]);

  // Helper function to assign roster slots for any team
  const assignRosterSlots = useCallback((players: DraftedPlayer[]) => {
    const positions = leagueSettings.rosterPositions.split(',').map(p => p.trim());

    // Helper function to check if a player can fill a position
    const canFillPosition = (playerPos: string, slotPos: string): boolean => {
      const playerPositions = playerPos.split('/').map(p => p.trim());

      // Util can be filled by anyone
      if (slotPos === 'Util') return true;

      // G can be filled by PG or SG
      if (slotPos === 'G') return playerPositions.some(p => p === 'PG' || p === 'SG');

      // F can be filled by SF or PF
      if (slotPos === 'F') return playerPositions.some(p => p === 'SF' || p === 'PF');

      // Exact match for specific positions
      return playerPositions.includes(slotPos);
    };

    // Create slots array
    const slots: Array<{ position: string; player: DraftedPlayer | null }> = positions.map(pos => ({
      position: pos,
      player: null
    }));

    // Track which players have been assigned
    const assignedPlayers = new Set<number>();

    // First pass: assign players to exact position matches (prioritize non-Util slots)
    positions.forEach((slotPos, slotIdx) => {
      if (slotPos.startsWith('BN') || slotPos.startsWith('IL')) return; // Skip bench and IL for now

      for (let i = 0; i < players.length; i++) {
        if (assignedPlayers.has(i)) continue;

        const player = players[i];
        if (canFillPosition(player.position, slotPos)) {
          slots[slotIdx].player = player;
          assignedPlayers.add(i);
          break;
        }
      }
    });

    // Second pass: assign remaining players to bench/IL slots
    for (let i = 0; i < players.length; i++) {
      if (assignedPlayers.has(i)) continue;

      // Find next empty BN or IL slot
      const emptySlotIdx = slots.findIndex((slot) =>
        !slot.player && (slot.position.startsWith('BN') || slot.position.startsWith('IL'))
      );

      if (emptySlotIdx !== -1) {
        slots[emptySlotIdx].player = players[i];
        assignedPlayers.add(i);
      }
    }

    return slots;
  }, [leagueSettings.rosterPositions]);

  // Roster slot assignment for My Team
  const rosterSlots = useMemo(() => {
    return assignRosterSlots(myPlayers);
  }, [myPlayers, assignRosterSlots]);

  // Get roster slots for the currently selected team view
  const selectedTeamRoster = useMemo(() => {
    if (selectedTeamView === 'My Team') {
      return rosterSlots;
    }

    const selectedTeam = opponentTeams.find(t => t.name === selectedTeamView);
    if (selectedTeam) {
      return assignRosterSlots(selectedTeam.players);
    }

    return [];
  }, [selectedTeamView, rosterSlots, opponentTeams, assignRosterSlots]);

  // Calculate inflation by position
  const positionInflation = useMemo(() => {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'];
    const inflationData: PositionInflation[] = [];

    positions.forEach(pos => {
      const posPlayers = draftedPlayers.filter(p =>
        p.position.includes(pos) || (pos === 'G' && (p.position.includes('PG') || p.position.includes('SG'))) ||
        (pos === 'F' && (p.position.includes('SF') || p.position.includes('PF')))
      );

      if (posPlayers.length > 0) {
        const playersWithValue = posPlayers.filter(p => p.projectedValue > 0);
        if (playersWithValue.length === 0) return; // Skip if no players have projected values

        const totalInflation = playersWithValue.reduce((sum, p) => {
          const inflation = ((p.actualPrice - p.projectedValue) / p.projectedValue) * 100;
          return sum + inflation;
        }, 0);

        inflationData.push({
          position: pos,
          averageInflation: totalInflation / playersWithValue.length,
          count: posPlayers.length,
        });
      }
    });

    return inflationData;
  }, [draftedPlayers]);

  // Calculate global inflation
  const globalInflation = useMemo(() => {
    if (draftedPlayers.length === 0) return 0;
    const playersWithValue = draftedPlayers.filter(p => p.projectedValue > 0);
    if (playersWithValue.length === 0) return 0;

    const totalInflation = playersWithValue.reduce((sum, p) => {
      const inflation = ((p.actualPrice - p.projectedValue) / p.projectedValue) * 100;
      return sum + inflation;
    }, 0);
    return totalInflation / playersWithValue.length;
  }, [draftedPlayers]);

  // Position needs analysis based on actual roster slots
  const positionNeeds = useMemo(() => {
    const needs: Record<string, number> = {
      PG: 0, SG: 0, SF: 0, PF: 0, C: 0
    };

    // Parse roster positions from league settings
    const rosterPositions = leagueSettings.rosterPositions.split(',').map(p => p.trim());

    // Filter out bench and IL slots - we only care about starting positions
    const startingSlots = rosterPositions.filter(pos =>
      !pos.startsWith('BN') && !pos.startsWith('IL')
    );

    // Count required positions from roster
    const requiredPositions: Record<string, number> = {
      PG: 0, SG: 0, SF: 0, PF: 0, C: 0
    };

    startingSlots.forEach(slot => {
      if (slot === 'PG') requiredPositions.PG++;
      else if (slot === 'SG') requiredPositions.SG++;
      else if (slot === 'SF') requiredPositions.SF++;
      else if (slot === 'PF') requiredPositions.PF++;
      else if (slot === 'C') requiredPositions.C++;
      else if (slot === 'G') {
        // G slot can be PG or SG
        requiredPositions.PG += 0.5;
        requiredPositions.SG += 0.5;
      } else if (slot === 'F') {
        // F slot can be SF or PF
        requiredPositions.SF += 0.5;
        requiredPositions.PF += 0.5;
      } else if (slot === 'Util') {
        // Util can be anyone - distribute evenly
        requiredPositions.PG += 0.2;
        requiredPositions.SG += 0.2;
        requiredPositions.SF += 0.2;
        requiredPositions.PF += 0.2;
        requiredPositions.C += 0.2;
      }
    });

    // Count how many of each position I have (can fill multiple positions)
    const filledPositions: Record<string, number> = {
      PG: 0, SG: 0, SF: 0, PF: 0, C: 0
    };

    myPlayers.forEach(player => {
      const positions = player.position.split('/').map(p => p.trim());
      // Each player contributes fractionally to each position they can fill
      const contribution = 1 / positions.length;
      positions.forEach(pos => {
        if (filledPositions[pos] !== undefined) {
          filledPositions[pos] += contribution;
        }
      });
    });

    // Calculate needs: required - filled (higher = more needed)
    Object.keys(needs).forEach(pos => {
      const required = requiredPositions[pos] || 0;
      const filled = filledPositions[pos] || 0;
      needs[pos] = Math.max(0, required - filled);
    });

    return needs;
  }, [myPlayers, leagueSettings.rosterPositions]);

  // Calculate category coverage for my team
  const categoryCoverage = useMemo(() => {
    if (myPlayers.length === 0) return null;

    // Find corresponding PlayerData for my players
    const myPlayerData = myPlayers
      .map(p => playerDatabase.find(pd => pd.name.toLowerCase() === p.name.toLowerCase()))
      .filter((p): p is PlayerData => p !== undefined);

    if (myPlayerData.length === 0) return null;

    // Calculate averages for each category
    const coverage = {
      pts: myPlayerData.reduce((sum, p) => sum + p.pointsPerGame, 0) / myPlayerData.length,
      reb: myPlayerData.reduce((sum, p) => sum + p.reboundsPerGame, 0) / myPlayerData.length,
      ast: myPlayerData.reduce((sum, p) => sum + p.assistsPerGame, 0) / myPlayerData.length,
      st: myPlayerData.reduce((sum, p) => sum + p.stealsPerGame, 0) / myPlayerData.length,
      blk: myPlayerData.reduce((sum, p) => sum + p.blocksPerGame, 0) / myPlayerData.length,
      '3ptm': myPlayerData.reduce((sum, p) => sum + p.threePointersPerGame, 0) / myPlayerData.length,
      'fg%': myPlayerData.reduce((sum, p) => sum + p.fgPercentage, 0) / myPlayerData.length,
      'ft%': myPlayerData.reduce((sum, p) => sum + p.ftPercentage, 0) / myPlayerData.length,
      to: myPlayerData.reduce((sum, p) => sum + p.turnoversPerGame, 0) / myPlayerData.length,
    };

    // Determine strength (compared to league averages - simplified)
    const leagueAvg = {
      pts: 15, reb: 5, ast: 4, st: 1.0, blk: 0.8, '3ptm': 1.5, 'fg%': 0.45, 'ft%': 0.78, to: 2.0
    };

    const strength: Record<string, 'strong' | 'average' | 'weak'> = {};
    Object.entries(coverage).forEach(([cat, val]) => {
      const avg = leagueAvg[cat as keyof typeof leagueAvg];
      if (cat === 'to') {
        // Lower is better for turnovers
        strength[cat] = val < avg * 0.9 ? 'strong' : val > avg * 1.1 ? 'weak' : 'average';
      } else {
        strength[cat] = val > avg * 1.1 ? 'strong' : val < avg * 0.9 ? 'weak' : 'average';
      }
    });

    return { coverage, strength };
  }, [myPlayers, playerDatabase]);

  // Dynamic punt strategy recommendations
  const puntRecommendations = useMemo(() => {
    if (!draftInProgress || myPlayers.length < 3) return null;

    interface PuntRecommendation {
      category: string;
      score: number;
      reasons: string[];
      confidence: 'high' | 'medium' | 'low';
    }

    const recommendations: PuntRecommendation[] = [];

    // Analyze each category
    Object.keys(categoryCoverage?.strength || {}).forEach(cat => {
      const reasons: string[] = [];
      let score = 0;

      // Factor 1: My team's weakness in this category
      if (categoryCoverage?.strength[cat] === 'weak') {
        score += 30;
        reasons.push('Your team is naturally weak here');
      } else if (categoryCoverage?.strength[cat] === 'average') {
        score += 10;
      } else if (categoryCoverage?.strength[cat] === 'strong') {
        score -= 40;
        reasons.push('Your team is strong here - not recommended to punt');
      }

      // Factor 2: Opponent concentration (highly contested = harder to win)
      const opponentsStrongInCat = opponentTeams.filter(team => {
        const analysis = analyzeTeamCategories(team.players, playerDatabase);
        return analysis?.strength[cat] === 'strong';
      }).length;

      if (opponentsStrongInCat >= 3) {
        score += 25;
        reasons.push(`${opponentsStrongInCat} opponents are strong here - highly contested`);
      } else if (opponentsStrongInCat >= 2) {
        score += 15;
        reasons.push(`${opponentsStrongInCat} opponents competing here`);
      } else if (opponentsStrongInCat === 0) {
        score -= 20;
        reasons.push('No strong opponents here - winnable category');
      }

      // Factor 3: Remaining value in available players
      const availablePlayerData = availablePlayers.slice(0, 50); // Top 50 available
      const catMapping: Record<string, keyof PlayerData> = {
        'pts': 'pointsPerGame',
        'reb': 'reboundsPerGame',
        'ast': 'assistsPerGame',
        'st': 'stealsPerGame',
        'blk': 'blocksPerGame',
        '3ptm': 'threePointersPerGame',
        'fg%': 'fgPercentage',
        'ft%': 'ftPercentage',
        'to': 'turnoversPerGame'
      };

      if (catMapping[cat]) {
        const key = catMapping[cat];
        const avgAvailable = availablePlayerData.reduce((sum, p) => sum + (p[key] as number), 0) / availablePlayerData.length;
        const avgDrafted = draftedPlayers
          .map(dp => playerDatabase.find(p => p.name.toLowerCase() === dp.name.toLowerCase()))
          .filter((p): p is PlayerData => p !== undefined)
          .reduce((sum, p) => sum + (p[key] as number), 0) / Math.max(draftedPlayers.length, 1);

        // If available players are significantly worse than drafted, consider punting
        const ratio = avgAvailable / avgDrafted;
        if (cat === 'to') {
          // For turnovers, higher is worse
          if (ratio > 1.15) {
            score += 20;
            reasons.push('Limited good options remaining');
          }
        } else {
          if (ratio < 0.85) {
            score += 20;
            reasons.push('Limited good options remaining');
          } else if (ratio > 1.0) {
            score -= 10;
            reasons.push('Good value still available');
          }
        }
      }

      // Factor 4: Category scarcity (scarce categories are harder to build)
      const scarcityWeight = SCARCITY_WEIGHTS[cat] || 1;
      if (scarcityWeight >= 2.0) {
        score += 10;
        reasons.push('Scarce category - harder to build');
      }

      // Determine confidence
      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (score >= 50) confidence = 'high';
      else if (score >= 30) confidence = 'medium';

      recommendations.push({
        category: cat,
        score,
        reasons,
        confidence
      });
    });

    // Sort by score (highest = most recommended to punt)
    return recommendations
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 10); // Only show categories worth considering
  }, [categoryCoverage, opponentTeams, availablePlayers, draftedPlayers, playerDatabase, myPlayers, draftInProgress]);

  // Pivot suggestions for when user should change their punt strategy
  const pivotSuggestions = useMemo(() => {
    if (!draftInProgress || puntCategories.length === 0 || myPlayers.length < 5) return null;

    interface PivotSuggestion {
      currentPunt: string;
      suggestedPivot: string;
      reason: string;
      urgency: 'high' | 'medium' | 'low';
    }

    const pivots: PivotSuggestion[] = [];

    // Check each currently punted category
    puntCategories.forEach(puntedCat => {
      // Check if my team is actually strong in this category now
      const myStrength = categoryCoverage?.strength[puntedCat];

      if (myStrength === 'strong') {
        // Find better category to punt instead
        const betterPunts = puntRecommendations?.filter(rec =>
          rec.score > 20 &&
          !puntCategories.includes(rec.category) &&
          categoryCoverage?.strength[rec.category] !== 'strong'
        );

        if (betterPunts && betterPunts.length > 0) {
          pivots.push({
            currentPunt: puntedCat,
            suggestedPivot: betterPunts[0].category,
            reason: `You've drafted players that are strong in ${puntedCat.toUpperCase()}! Consider pivoting to punt ${betterPunts[0].category.toUpperCase()} instead.`,
            urgency: 'high'
          });
        }
      } else if (myStrength === 'average') {
        // Check if there's a much better punt option
        const betterPunts = puntRecommendations?.filter(rec =>
          rec.confidence === 'high' &&
          rec.score > 40 &&
          !puntCategories.includes(rec.category)
        );

        if (betterPunts && betterPunts.length > 0) {
          pivots.push({
            currentPunt: puntedCat,
            suggestedPivot: betterPunts[0].category,
            reason: `${betterPunts[0].category.toUpperCase()} might be a better punt - you have average ${puntedCat.toUpperCase()} and could compete there.`,
            urgency: 'medium'
          });
        }
      }
    });

    return pivots.length > 0 ? pivots : null;
  }, [draftInProgress, puntCategories, myPlayers, categoryCoverage, puntRecommendations]);

  // Budget spending by tier
  const budgetByTier = useMemo(() => {
    const spending = {
      'Tier 1': 0,
      'Tier 2': 0,
      'Tier 3': 0,
      'Tier 4': 0,
    };

    myPlayers.forEach(player => {
      const playerData = playerDatabase.find(p => p.name.toLowerCase() === player.name.toLowerCase());
      if (playerData) {
        const tier = getPlayerTier(playerData);
        spending[tier.name as keyof typeof spending] += player.actualPrice;
      }
    });

    return spending;
  }, [myPlayers, playerDatabase]);

  // Draft phase detection
  const draftPhase = useMemo((): 'early' | 'middle' | 'late' => {
    const totalTeams = leagueSettings.teamCount || 10;
    const totalPlayers = totalSlots * totalTeams;
    const draftedCount = draftedPlayers.length;
    const percentDrafted = draftedCount / totalPlayers;

    if (percentDrafted < 0.25) return 'early';
    if (percentDrafted < 0.75) return 'middle';
    return 'late';
  }, [draftedPlayers.length, totalSlots, leagueSettings.teamCount]);

  // Top recommendations with enhanced algorithm
  const topRecommendations = useMemo(() => {
    if (availablePlayers.length === 0) return [];

    // Score each available player using punt-adjusted values
    const scoredPlayers = availablePlayers.map(player => {
      // Base score from punt-adjusted value
      let score = calculatePuntAdjustedValue(player, puntCategories);

      // Bonus for filling position needs
      const positions = player.position.split('/');
      const positionNeedBonus = Math.max(...positions.map(pos => positionNeeds[pos] || 0)) * 2.0;

      // Penalty for inflated positions
      const posInflation = positionInflation.find(pi => player.position.includes(pi.position));
      const inflationPenalty = posInflation ? (posInflation.averageInflation / 20) : 0;

      // Bonus for filling missing archetypes
      const archetypes = getPlayerArchetypes(player);
      const tier = getPlayerTier(player);

      // In late phase, prioritize specialists and value
      if (draftPhase === 'late' && tier.name === 'Tier 4') {
        score *= 1.5; // Boost specialists in late rounds
      }

      // Boost high-tier players in early phase
      if (draftPhase === 'early' && (tier.name === 'Tier 1' || tier.name === 'Tier 2')) {
        score *= 1.2;
      }

      score = score + positionNeedBonus - inflationPenalty;

      return { ...player, score, archetypes, tier };
    });

    // Sort by score and return top 10
    return scoredPlayers
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [availablePlayers, positionNeeds, positionInflation, puntCategories, draftPhase]);

  // Nomination suggestions based on draft phase
  const nominationSuggestions = useMemo(() => {
    if (availablePlayers.length === 0 || !draftInProgress) return [];

    const suggestions: { player: PlayerData; reason: string }[] = [];

    if (draftPhase === 'early') {
      if (puntCategories.length > 0) {
        // If punting, nominate expensive players that conflict with your strategy
        const expensivePlayers = availablePlayers
          .filter(p => getPlayerTier(p).name === 'Tier 1')
          .filter(p => {
            const archetypes = getPlayerArchetypes(p);
            if (puntCategories.includes('ft%') && archetypes.includes('FT% Anchor')) return true;
            if (puntCategories.includes('fg%') && archetypes.includes('FG% Anchor')) return true;
            if (puntCategories.includes('ast') && archetypes.includes('Assist Anchor')) return true;
            return false;
          })
          .slice(0, 3);

        expensivePlayers.forEach(p => {
          suggestions.push({
            player: p,
            reason: 'Nominate to drain opponents\' budgets - doesn\'t fit your punt strategy'
          });
        });

        // If we didn't find enough punt-conflicting players, add some top tier players
        if (suggestions.length < 3) {
          const topTier = availablePlayers
            .filter(p => getPlayerTier(p).name === 'Tier 1')
            .filter(p => !suggestions.some(s => s.player.name === p.name))
            .slice(0, 3 - suggestions.length);

          topTier.forEach(p => {
            suggestions.push({
              player: p,
              reason: 'Elite player - nominate early to control the market'
            });
          });
        }
      } else {
        // No punt strategy yet - suggest top available players to gauge market
        const topTier = availablePlayers
          .filter(p => getPlayerTier(p).name === 'Tier 1')
          .slice(0, 3);

        topTier.forEach(p => {
          suggestions.push({
            player: p,
            reason: 'Top-tier player - nominate to gauge market or drain budgets'
          });
        });
      }
    } else if (draftPhase === 'middle') {
      // Nominate targets you want before they're gone
      const targets = topRecommendations.slice(0, 3).map(r => ({
        player: r,
        reason: 'High-value target that fills your needs - nominate before scarcity hits'
      }));

      suggestions.push(...targets);
    } else {
      // Late phase: nominate sleepers/specialists
      const specialists = availablePlayers
        .filter(p => getPlayerTier(p).name === 'Tier 4')
        .filter(p => {
          const archetypes = getPlayerArchetypes(p);
          return archetypes.some(a =>
            a.includes('Specialist') || a === 'Low-TO Glue Guy'
          );
        })
        .slice(0, 5);

      specialists.forEach(p => {
        suggestions.push({
          player: p,
          reason: 'Late-round specialist to fill category gaps'
        });
      });

      // If no specialists found, suggest best available players
      if (suggestions.length === 0) {
        const bestAvailable = topRecommendations.slice(0, 5).map(r => ({
          player: r,
          reason: 'Best available player for your team needs'
        }));
        suggestions.push(...bestAvailable);
      }
    }

    return suggestions.slice(0, 5);
  }, [availablePlayers, draftPhase, puntCategories, topRecommendations, draftInProgress]);

  // Filtered table data
  const tableData = useMemo(() => {
    let filtered = playerDatabase;

    // Filter by availability
    if (tableFilter === 'available') {
      filtered = availablePlayers;
    } else if (tableFilter === 'drafted') {
      filtered = filtered.filter(p => draftedPlayerNames.has(p.name.toLowerCase()));
    }

    // Filter by position
    if (positionFilter !== 'all') {
      filtered = filtered.filter(p => p.position.includes(positionFilter));
    }

    // Filter by search text
    if (tableSearch.trim()) {
      const search = tableSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.team.toLowerCase().includes(search) ||
        p.position.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [playerDatabase, availablePlayers, draftedPlayerNames, tableFilter, positionFilter, tableSearch]);

  const handleStatCategoryToggle = (categoryId: string) => {
    setLeagueSettings(prev => ({
      ...prev,
      statCategories: prev.statCategories.includes(categoryId)
        ? prev.statCategories.filter(c => c !== categoryId)
        : [...prev.statCategories, categoryId]
    }));
  };

  const handleNominatePlayer = (player: PlayerData) => {
    setNominatedPlayer(player);
    setNominationPrice('');
    setNominationTeam('');
    setNominationIsMine(false);
  };

  const handleSubmitNomination = () => {
    if (!nominatedPlayer || !nominationPrice) return;

    const draftedBy = nominationIsMine ? 'me' : nominationTeam;
    if (!draftedBy) return;

    const newPlayer: DraftedPlayer = {
      name: nominatedPlayer.name,
      position: nominatedPlayer.position,
      projectedValue: nominatedPlayer.auctionValue || 1, // Use calculated auction value
      actualPrice: parseFloat(nominationPrice),
      draftedBy,
    };

    setDraftedPlayers(prev => [...prev, newPlayer]);

    if (nominationIsMine) {
      setMyPlayers(prev => [...prev, newPlayer]);
      setBudgetRemaining(prev => prev - parseFloat(nominationPrice));
    } else if (nominationTeam) {
      // Update opponent team
      setOpponentTeams(prev => prev.map(team => {
        if (team.name === nominationTeam) {
          return {
            ...team,
            budget: team.budget - parseFloat(nominationPrice),
            players: [...team.players, newPlayer]
          };
        }
        return team;
      }));
    }

    // Reset modal
    setNominatedPlayer(null);
    setNominationPrice('');
    setNominationTeam('');
    setNominationIsMine(false);
  };

  const handleEditDraftEntry = (index: number) => {
    const player = draftedPlayers[index];
    setEditingDraftIndex(index);
    setEditDraftTeam(player.draftedBy);
    setEditDraftPrice(player.actualPrice.toString());
  };

  const handleSaveDraftEdit = () => {
    if (editingDraftIndex === null || !editDraftPrice || !editDraftTeam) return;

    const oldPlayer = draftedPlayers[editingDraftIndex];
    const priceDiff = parseFloat(editDraftPrice) - oldPlayer.actualPrice;

    const updatedPlayer: DraftedPlayer = {
      ...oldPlayer,
      draftedBy: editDraftTeam,
      actualPrice: parseFloat(editDraftPrice),
    };

    // Update drafted players list
    setDraftedPlayers(prev => prev.map((p, i) => i === editingDraftIndex ? updatedPlayer : p));

    // Update myPlayers and budget if changed
    if (oldPlayer.draftedBy === 'me' && editDraftTeam === 'me') {
      // Still my player, just price changed
      setMyPlayers(prev => prev.map(p => p.name === oldPlayer.name ? updatedPlayer : p));
      setBudgetRemaining(prev => prev - priceDiff);
    } else if (oldPlayer.draftedBy === 'me' && editDraftTeam !== 'me') {
      // Changed from me to opponent
      setMyPlayers(prev => prev.filter(p => p.name !== oldPlayer.name));
      setBudgetRemaining(prev => prev + oldPlayer.actualPrice);
    } else if (oldPlayer.draftedBy !== 'me' && editDraftTeam === 'me') {
      // Changed from opponent to me
      setMyPlayers(prev => [...prev, updatedPlayer]);
      setBudgetRemaining(prev => prev - parseFloat(editDraftPrice));
    }

    // Update opponent teams
    setOpponentTeams(prev => prev.map(team => {
      // Remove from old team
      if (team.name === oldPlayer.draftedBy && oldPlayer.draftedBy !== 'me') {
        return {
          ...team,
          budget: team.budget + oldPlayer.actualPrice,
          players: team.players.filter(p => p.name !== oldPlayer.name)
        };
      }
      // Add to new team
      if (team.name === editDraftTeam && editDraftTeam !== 'me') {
        return {
          ...team,
          budget: team.budget - parseFloat(editDraftPrice),
          players: [...team.players, updatedPlayer]
        };
      }
      return team;
    }));

    // Reset edit state
    setEditingDraftIndex(null);
    setEditDraftTeam('');
    setEditDraftPrice('');
  };

  const handleCancelDraftEdit = () => {
    setEditingDraftIndex(null);
    setEditDraftTeam('');
    setEditDraftPrice('');
  };

  const handleDeleteDraftEntry = (index: number) => {
    const player = draftedPlayers[index];

    // Remove from drafted players
    setDraftedPlayers(prev => prev.filter((_, i) => i !== index));

    // Update myPlayers and budget if it was my player
    if (player.draftedBy === 'me') {
      setMyPlayers(prev => prev.filter(p => p.name !== player.name));
      setBudgetRemaining(prev => prev + player.actualPrice);
    } else {
      // Update opponent team
      setOpponentTeams(prev => prev.map(team => {
        if (team.name === player.draftedBy) {
          return {
            ...team,
            budget: team.budget + player.actualPrice,
            players: team.players.filter(p => p.name !== player.name)
          };
        }
        return team;
      }));
    }
  };

  const handleAddDraftedPlayer = () => {
    if (!playerName || !playerPosition || !projectedValue || !actualPrice) return;

    const draftedBy = draftedByMe ? 'me' : (selectedOpponent || 'opponent');

    const newPlayer: DraftedPlayer = {
      name: playerName,
      position: playerPosition,
      projectedValue: parseFloat(projectedValue),
      actualPrice: parseFloat(actualPrice),
      draftedBy,
    };

    setDraftedPlayers(prev => [...prev, newPlayer]);

    if (draftedByMe) {
      setMyPlayers(prev => [...prev, newPlayer]);
      setBudgetRemaining(prev => prev - parseFloat(actualPrice));
    } else if (selectedOpponent) {
      // Update opponent team
      setOpponentTeams(prev => prev.map(team => {
        if (team.name === selectedOpponent) {
          return {
            ...team,
            budget: team.budget - parseFloat(actualPrice),
            players: [...team.players, newPlayer]
          };
        }
        return team;
      }));
    }

    // Reset form
    setPlayerName('');
    setPlayerPosition('');
    setProjectedValue('');
    setActualPrice('');
    setDraftedByMe(false);
    setSelectedOpponent('');
  };

  const startDraft = () => {
    setDraftInProgress(true);
    setBudgetRemaining(leagueSettings.budgetPerTeam || 200);
    setDraftedPlayers([]);
    setMyPlayers([]);

    // Initialize opponent teams using custom team names
    const numTeams = (leagueSettings.teamCount || 10) - 1; // Exclude my team (assumed to be Team 1)
    const initialBudget = leagueSettings.budgetPerTeam || 200;
    const opponents: OpponentTeam[] = [];
    const teamNames = leagueSettings.teamNames || [];

    // Start from index 1 (skip Team 1 which is "My Team")
    for (let i = 1; i <= numTeams; i++) {
      opponents.push({
        name: teamNames[i] || `Team ${i + 1}`,
        budget: initialBudget,
        players: []
      });
    }

    setOpponentTeams(opponents);
  };

  // Calculate recommended max bid with 15% constraint
  const calculateRecommendedMaxBid = (projectedValue: number, fillsTwoNeeds: boolean = false): number => {
    const maxOverpayPercent = fillsTwoNeeds ? 25 : 15;
    const valueBasedMax = projectedValue * (1 + maxOverpayPercent / 100);
    return Math.min(valueBasedMax, maxBid);
  };

  // Get bid recommendation
  const getBidRecommendation = (currentBid: number, projectedValue: number): {
    shouldBid: boolean;
    message: string;
    color: 'green' | 'orange' | 'red';
  } => {
    const overpayPercent = ((currentBid - projectedValue) / projectedValue) * 100;

    if (currentBid > maxBid) {
      return {
        shouldBid: false,
        message: `STOP! Exceeds your max bid of $${maxBid}`,
        color: 'red'
      };
    }

    if (overpayPercent > 25) {
      return {
        shouldBid: false,
        message: `Do not chase! ${overpayPercent.toFixed(0)}% over value`,
        color: 'red'
      };
    }

    if (overpayPercent > 15) {
      return {
        shouldBid: false,
        message: `Caution: ${overpayPercent.toFixed(0)}% over value. Only if fills 2+ needs`,
        color: 'orange'
      };
    }

    if (overpayPercent > 5) {
      return {
        shouldBid: true,
        message: `Slight overpay (${overpayPercent.toFixed(0)}%)`,
        color: 'orange'
      };
    }

    return {
      shouldBid: true,
      message: `Good value! ${overpayPercent > 0 ? 'Only ' + overpayPercent.toFixed(0) + '% over' : Math.abs(overpayPercent).toFixed(0) + '% under'} projected value`,
      color: 'green'
    };
  };

  // Calculate auction values based on z-scores using VORP method
  const calculateAuctionValues = (players: PlayerData[], teamCount: number, budgetPerTeam: number): PlayerData[] => {
    const totalBudget = teamCount * budgetPerTeam; // e.g., 10 teams × $200 = $2000
    const rosterSize = 13; // Typical roster size
    const draftableCount = teamCount * rosterSize; // e.g., 130 players

    // Calculate total z-score for each player (sum of all 9 categories)
    const playersWithTotalZ = players.map(p => ({
      ...p,
      totalZScore: p.pointsValue + p.threeValue + p.reboundsValue + p.assistsValue +
                   p.stealsValue + p.blocksValue + p.fgPercentageValue +
                   p.ftPercentageValue + p.turnoversValue
    }));

    // Sort by total z-score descending
    const sortedPlayers = [...playersWithTotalZ].sort((a, b) => b.totalZScore - a.totalZScore);

    // Find replacement level (130th player's z-score)
    const replacementIndex = Math.min(draftableCount - 1, sortedPlayers.length - 1);
    const baselineZ = sortedPlayers[replacementIndex]?.totalZScore || 0;

    // Calculate VORP (Value Over Replacement Player) for top draftable players
    const playersWithVORP = sortedPlayers.map((p, index) => {
      // Only top draftableCount players get positive VORP
      const adjustedZ = p.totalZScore - baselineZ;
      const vorp = (index < draftableCount && adjustedZ > 0) ? adjustedZ : 0;
      return { ...p, vorp };
    });

    // Sum of all VORP
    const totalVORP = playersWithVORP.reduce((sum, p) => sum + p.vorp, 0);

    // Reserve $1 for each draftable player
    const reservedBudget = draftableCount; // $1 × 130 = $130
    const remainingBudget = totalBudget - reservedBudget; // $2000 - $130 = $1870

    // Calculate conversion factor ($ per VORP point)
    const conversionFactor = totalVORP > 0 ? remainingBudget / totalVORP : 0;

    // Assign auction values
    return playersWithVORP.map(p => {
      let auctionValue: number;

      if (p.vorp > 0) {
        // Draftable player: $1 base + proportional share of remaining budget
        const vorpDollars = p.vorp * conversionFactor;
        auctionValue = Math.max(1, Math.round(1 + vorpDollars));
      } else {
        // Below replacement: $1 minimum
        auctionValue = 1;
      }

      // Remove temporary fields
      const { totalZScore, vorp, ...playerData } = p;
      return {
        ...playerData,
        auctionValue
      };
    });
  };

  // Parse BBM Player Rankings format
  const parseBBMData = (jsonData: Record<string, unknown>[]): PlayerData[] => {
    const rawPlayers = jsonData.map((row) => ({
      round: row['Round'] || 0,
      rank: row['Rank'] || 0,
      value: row['Value'] || 0,
      name: row['Name'] || '',
      team: row['Team'] || '',
      position: row['Pos'] || '',
      injury: row['Inj'] || '',
      gamesPlayed: row['g'] || 0,
      minutesPerGame: row['minutes/g'] || 0,
      pointsPerGame: row['points/g'] || 0,
      threePointersPerGame: row['3pt/g'] || 0,
      reboundsPerGame: row['rebound/g'] || 0,
      assistsPerGame: row['assists/g'] || 0,
      stealsPerGame: row['steals/g'] || 0,
      blocksPerGame: row['blocks/g'] || 0,
      fgPercentage: row['fg%'] || 0,
      ftPercentage: row['ft%'] || 0,
      turnoversPerGame: row['to/g'] || 0,
      usage: row['USG'] || 0,
      pointsValue: row['pV'] || 0,
      threeValue: row['3V'] || 0,
      reboundsValue: row['rV'] || 0,
      assistsValue: row['aV'] || 0,
      stealsValue: row['sV'] || 0,
      blocksValue: row['bV'] || 0,
      fgPercentageValue: row['fg%V'] || 0,
      ftPercentageValue: row['ft%V'] || 0,
      turnoversValue: row['toV'] || 0,
    }));

    // Calculate auction values based on z-scores
    const teamCount = leagueSettings.teamCount || 10;
    const budgetPerTeam = leagueSettings.budgetPerTeam || 200;
    return calculateAuctionValues(rawPlayers, teamCount, budgetPerTeam);
  };

  // Auto-load BBM_PlayerRankings.xlsx on component mount
  useEffect(() => {
    const loadDefaultPlayerData = async () => {
      try {
        const response = await fetch('/BBM_PlayerRankings.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        const players = parseBBMData(jsonData);
        setPlayerDatabase(players);
        console.log(`Auto-loaded ${players.length} players from BBM_PlayerRankings.xlsx`);
      } catch (error) {
        console.error('Error auto-loading player data:', error);
      }
    };

    loadDefaultPlayerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed - auto-loads from public folder instead
  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files || files.length === 0) return;
  //
  //   const file = files[0];
  //
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const data = e.target?.result;
  //       const workbook = XLSX.read(data, { type: 'binary' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
  //
  //       const players = parseBBMData(jsonData);
  //       setPlayerDatabase(players);
  //       console.log(`Loaded ${players.length} players from Excel file`);
  //     } catch (error) {
  //       console.error('Error parsing Excel file:', error);
  //       alert('Error parsing Excel file. Please check the format.');
  //     }
  //   };
  //
  //   reader.readAsBinaryString(file);
  // };

  // Auto-fill player data when name is selected
  const handlePlayerSelect = (selectedPlayer: PlayerData) => {
    setPlayerName(selectedPlayer.name);
    setPlayerPosition(selectedPlayer.position);
    setProjectedValue((selectedPlayer.auctionValue || 0).toString());
  };

  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!playerSearch || playerSearch.length < 2) return [];
    const search = playerSearch.toLowerCase();
    return playerDatabase
      .filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.position.toLowerCase().includes(search) ||
        p.team.toLowerCase().includes(search)
      )
      .slice(0, 10); // Limit to 10 results
  }, [playerSearch, playerDatabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Fantasy Basketball Auction
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* League Settings Section */}
        <Card className="mb-8 border-indigo-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  League Settings
                </CardTitle>
                <CardDescription>
                  Configure your league settings to ensure accurate player valuations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeagueSettings(!showLeagueSettings)}
              >
                {showLeagueSettings ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showLeagueSettings && (
            <CardContent>
            <div className="space-y-6">
              {/* Basic League Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="scoring-type">Scoring Type</Label>
                  <Select
                    value={leagueSettings.scoringType}
                    onValueChange={(value) => setLeagueSettings(prev => ({ ...prev, scoringType: value }))}
                  >
                    <SelectTrigger id="scoring-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head-to-Head - Categories">Head-to-Head - Categories</SelectItem>
                      <SelectItem value="Head-to-Head - Points">Head-to-Head - Points</SelectItem>
                      <SelectItem value="Roto">Rotisserie (Roto)</SelectItem>
                      <SelectItem value="Points">Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-count">Number of Teams</Label>
                  <Input
                    id="team-count"
                    type="number"
                    value={leagueSettings.teamCount || ''}
                    onChange={(e) => {
                      const newCount = parseInt(e.target.value) || 0;
                      setLeagueSettings(prev => {
                        const currentNames = prev.teamNames || [];
                        const newNames = Array.from({ length: newCount }, (_, i) =>
                          currentNames[i] || `Team ${i + 1}`
                        );
                        return { ...prev, teamCount: newCount, teamNames: newNames };
                      });
                    }}
                    placeholder="e.g., 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Per Team ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={leagueSettings.budgetPerTeam || ''}
                    onChange={(e) => setLeagueSettings(prev => ({ ...prev, budgetPerTeam: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roster-positions">Roster Positions</Label>
                  <Input
                    id="roster-positions"
                    value={leagueSettings.rosterPositions}
                    onChange={(e) => setLeagueSettings(prev => ({ ...prev, rosterPositions: e.target.value }))}
                    placeholder="e.g., G, G, F, F, C, Util, BN, IL"
                  />
                </div>
              </div>

              {/* Draft Timing */}
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="bid-time">Bid Time (seconds)</Label>
                  <Input
                    id="bid-time"
                    type="number"
                    value={leagueSettings.bidTime || ''}
                    onChange={(e) => setLeagueSettings(prev => ({ ...prev, bidTime: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 20"
                  />
                  <p className="text-xs text-gray-500">Time allowed for each bid during auction</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomination-time">Nomination Time (seconds)</Label>
                  <Input
                    id="nomination-time"
                    type="number"
                    value={leagueSettings.nominationTime || ''}
                    onChange={(e) => setLeagueSettings(prev => ({ ...prev, nominationTime: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 15"
                  />
                  <p className="text-xs text-gray-500">Time to nominate a player for auction</p>
                </div>
              </div>

              {/* Team Names */}
              {leagueSettings.teamCount && leagueSettings.teamCount > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-sm text-gray-700">Team Names</h3>
                  <p className="text-xs text-gray-500">
                    Name each team for easier tracking during the draft
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                    {leagueSettings.teamNames?.map((teamName, index) => (
                      <div key={index} className="space-y-1">
                        <Label htmlFor={`team-${index}`} className="text-xs">Team {index + 1}</Label>
                        <Input
                          id={`team-${index}`}
                          value={teamName}
                          onChange={(e) => {
                            setLeagueSettings(prev => {
                              const newNames = [...(prev.teamNames || [])];
                              newNames[index] = e.target.value;
                              return { ...prev, teamNames: newNames };
                            });
                          }}
                          placeholder={`Team ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* League Rules */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm text-gray-700">League Rules</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="draft-trades"
                    checked={leagueSettings.allowDraftPickTrades}
                    onCheckedChange={(checked) => setLeagueSettings(prev => ({
                      ...prev,
                      allowDraftPickTrades: checked === true
                    }))}
                  />
                  <Label htmlFor="draft-trades" className="font-normal cursor-pointer">
                    Allow Draft Pick Trades
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="injured-il"
                    checked={leagueSettings.allowInjuredToIL}
                    onCheckedChange={(checked) => setLeagueSettings(prev => ({
                      ...prev,
                      allowInjuredToIL: checked === true
                    }))}
                  />
                  <Label htmlFor="injured-il" className="font-normal cursor-pointer">
                    Allow injured players from waivers/free agents to be added directly to injury slot
                  </Label>
                </div>
              </div>

              {/* Stat Categories */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm text-gray-700">Scoring Categories</h3>
                <p className="text-xs text-gray-500">
                  Select the statistical categories used in your league
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {STAT_CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={leagueSettings.statCategories.includes(category.id)}
                        onCheckedChange={() => handleStatCategoryToggle(category.id)}
                      />
                      <Label htmlFor={category.id} className="font-normal cursor-pointer text-sm">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-indigo-800">
                  <strong>Why this matters:</strong> Your league settings fundamentally affect player values.
                  For example, in a 9-cat league with turnovers, high-volume scorers become less valuable compared to efficient role players.
                </p>
              </div>
            </div>
            </CardContent>
          )}
        </Card>

        {/* Live Draft Tracking & Position Inflation Tracker - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Live Draft Tracking */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Live Draft Tracking
              </CardTitle>
              <CardDescription>
                Track actual auction prices as they happen during your draft
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!draftInProgress ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 mb-2">
                        Record each player's actual auction price to identify:
                      </p>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>Position/category inflation trends</li>
                        <li>Over/under valued players</li>
                        <li>Remaining budget opportunities</li>
                        <li>Dynamic value adjustments</li>
                      </ul>
                    </div>
                    <Button onClick={startDraft} className="w-full" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Start Draft Session
                    </Button>
                  </>
                ) : (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="remaining">Remaining</TabsTrigger>
                      <TabsTrigger value="category">Category</TabsTrigger>
                      <TabsTrigger value="budget">Budget</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      {/* Budget & Max Bid Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Wallet className="w-4 h-4 text-green-700" />
                            <p className="text-xs font-semibold text-green-700 uppercase">Budget Left</p>
                          </div>
                          <p className="text-3xl font-bold text-green-900">${budgetRemaining}</p>
                          <p className="text-xs text-green-600 mt-1">{slotsRemaining} slots remaining</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-orange-700" />
                            <p className="text-xs font-semibold text-orange-700 uppercase">Max Bid</p>
                          </div>
                          <p className="text-3xl font-bold text-orange-900">${maxBid}</p>
                          <p className="text-xs text-orange-600 mt-1">Slot-aware limit</p>
                        </div>
                      </div>

                      {/* Max Bid Warning */}
                      {maxBid < 10 && slotsRemaining > 3 && (
                        <Alert className="border-red-300 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-sm text-red-800">
                            <strong>Low budget alert!</strong> You have {slotsRemaining} slots but only ${budgetRemaining} left. Max bid is ${maxBid}.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Team Roster Selector */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-sm">Team Roster</h3>
                          <Select
                            value={selectedTeamView}
                            onValueChange={setSelectedTeamView}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="My Team">My Team</SelectItem>
                              {opponentTeams.map((team) => (
                                <SelectItem key={team.name} value={team.name}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {selectedTeamView === 'My Team'
                            ? `${myPlayers.length}/${rosterSlots.length} players`
                            : `${opponentTeams.find(t => t.name === selectedTeamView)?.players.length || 0}/${selectedTeamRoster.length} players`
                          }
                        </div>
                        <div className="space-y-1.5 max-h-80 overflow-y-auto">
                          {selectedTeamRoster.map((slot, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center text-sm p-2 rounded ${
                                slot.player
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200 border-dashed'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <Badge
                                  variant="outline"
                                  className={`min-w-[45px] justify-center ${
                                    slot.position.startsWith('BN')
                                      ? 'border-gray-400 text-gray-600'
                                      : slot.position.startsWith('IL')
                                      ? 'border-red-400 text-red-600'
                                      : 'border-blue-400 text-blue-600'
                                  }`}
                                >
                                  {slot.position}
                                </Badge>
                                {slot.player ? (
                                  <>
                                    <span className="font-medium flex-1">{slot.player.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {slot.player.position}
                                    </Badge>
                                    <span className="text-green-700 font-semibold">${slot.player.actualPrice}</span>
                                  </>
                                ) : (
                                  <span className="text-gray-400 italic flex-1">Empty</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="remaining" className="space-y-4">
                      {/* Remaining Players by Position & Tier */}
                      {(() => {
                        const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
                        const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];

                        // Calculate counts for each tier and position
                        const tierPositionCounts = tiers.map(tierName => {
                          const tierData = positions.map(pos => {
                            // Count total players in this tier+position
                            const totalPlayers = playerDatabase.filter(p => {
                              const playerTier = getPlayerTier(p);
                              const playerPositions = p.position.split('/').map(pp => pp.trim());
                              return playerTier.name === tierName && playerPositions.includes(pos);
                            }).length;

                            // Count available (undrafted) players in this tier+position
                            const availablePlayers = playerDatabase.filter(p => {
                              const playerTier = getPlayerTier(p);
                              const playerPositions = p.position.split('/').map(pp => pp.trim());
                              const isDrafted = draftedPlayers.some(dp =>
                                dp.name.toLowerCase() === p.name.toLowerCase()
                              );
                              return playerTier.name === tierName &&
                                     playerPositions.includes(pos) &&
                                     !isDrafted;
                            }).length;

                            return {
                              position: pos,
                              total: totalPlayers,
                              available: availablePlayers
                            };
                          });

                          return {
                            tier: tierName,
                            positions: tierData
                          };
                        });

                        return (
                          <div className="space-y-4">
                            {tierPositionCounts.map(({ tier, positions: posData }) => (
                              <div key={tier} className="border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-3 text-gray-700">{tier}</h4>
                                <div className="grid grid-cols-5 gap-2">
                                  {posData.map(({ position, total, available }) => {
                                    const percentageLeft = total > 0 ? (available / total) * 100 : 0;
                                    const isLow = percentageLeft < 25;
                                    const isMedium = percentageLeft >= 25 && percentageLeft < 50;

                                    return (
                                      <div
                                        key={position}
                                        className={`border rounded p-2 text-center ${
                                          available === 0
                                            ? 'bg-red-50 border-red-300'
                                            : isLow
                                            ? 'bg-orange-50 border-orange-300'
                                            : isMedium
                                            ? 'bg-yellow-50 border-yellow-300'
                                            : 'bg-green-50 border-green-300'
                                        }`}
                                      >
                                        <div className="font-bold text-xs text-gray-600 mb-1">{position}</div>
                                        <div className={`text-lg font-bold ${
                                          available === 0
                                            ? 'text-red-700'
                                            : isLow
                                            ? 'text-orange-700'
                                            : isMedium
                                            ? 'text-yellow-700'
                                            : 'text-green-700'
                                        }`}>
                                          {available}/{total}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            <Alert className="border-blue-300 bg-blue-50">
                              <AlertDescription className="text-xs text-blue-800">
                                <strong>Color coding:</strong> Green = 50%+ available, Yellow = 25-50%, Orange = &lt;25%, Red = All drafted
                              </AlertDescription>
                            </Alert>
                          </div>
                        );
                      })()}
                    </TabsContent>

                    <TabsContent value="category" className="space-y-4">
                      {/* Category Coverage Content */}
                      {categoryCoverage && myPlayers.length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(categoryCoverage.strength)
                            .filter(([cat]) => !puntCategories.includes(cat))
                            .map(([cat, strength]) => (
                              <div key={cat} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{cat.toUpperCase()}</span>
                                <Badge
                                  className={
                                    strength === 'strong'
                                      ? 'bg-green-500'
                                      : strength === 'weak'
                                      ? 'bg-red-500'
                                      : 'bg-gray-400'
                                  }
                                >
                                  {strength}
                                </Badge>
                              </div>
                            ))}
                          {puntCategories.length > 0 && (
                            <>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-gray-500 mb-2">Punted Categories:</p>
                                {puntCategories.map(cat => (
                                  <div key={cat} className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-400">{cat.toUpperCase()}</span>
                                    <Badge variant="outline" className="border-gray-300 text-gray-400">
                                      Ignored
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <Alert className="border-teal-300 bg-teal-50">
                          <AlertDescription className="text-sm text-teal-800">
                            Draft players to see your team's category coverage
                          </AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>

                    <TabsContent value="budget" className="space-y-3">
                      {/* Budget by Tier Content */}
                      {myPlayers.length > 0 ? (
                        <>
                          {PLAYER_TIERS.map(tier => {
                            const spent = budgetByTier[tier.name as keyof typeof budgetByTier];
                            return (
                              <div key={tier.name} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm font-semibold">{tier.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">{tier.priceRange}</span>
                                  </div>
                                  <span className="font-bold text-amber-700">${spent}</span>
                                </div>
                                <p className="text-xs text-gray-600">{tier.description}</p>
                              </div>
                            );
                          })}
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center font-bold">
                              <span>Total Spent</span>
                              <span className="text-amber-700">
                                ${(leagueSettings.budgetPerTeam || 200) - budgetRemaining}
                              </span>
                            </div>
                            <Alert className="mt-3 border-amber-300 bg-amber-50">
                              <AlertDescription className="text-xs text-amber-800">
                                <strong>Balanced Strategy:</strong> Aim for 1 Tier-1 (~$50), 2-3 Tier-2 (~$25-40 each),
                                3-5 Tier-3 (~$10-20), rest in Tier-4.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </>
                      ) : (
                        <Alert className="border-amber-300 bg-amber-50">
                          <AlertDescription className="text-sm text-amber-800">
                            Draft players to see budget allocation by tier
                          </AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strategy & Analysis */}
          {draftInProgress && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Strategy & Analysis
              </CardTitle>
              <CardDescription>
                Punt strategy, market analysis, competitive intelligence, and strategic nominations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="punt" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="punt">Punt Strategy</TabsTrigger>
                  <TabsTrigger value="inflation">Position Inflation</TabsTrigger>
                  <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
                  <TabsTrigger value="nominations">Nominations</TabsTrigger>
                </TabsList>

                <TabsContent value="punt" className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <Alert className="border-purple-300 bg-purple-50">
                    <AlertTriangle className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-sm text-purple-800">
                      <strong>Punt Strategy:</strong> In 9-cat H2H, you only need to win 5-4. By intentionally ignoring one category,
                      you can dominate 7-8 others. Popular punts: FT% (unlocks big men), FG% (guards/shooters), or TO (high-usage stars).
                    </AlertDescription>
                  </Alert>

                  {/* Dynamic Punt Recommendations */}
                  {puntRecommendations && puntRecommendations.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-purple-900">AI-Powered Punt Recommendations</h4>
                          <p className="text-xs text-purple-700 mt-1">
                            Based on your drafted players, opponent strategies, and available talent pool
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {puntRecommendations.slice(0, 3).map((rec) => (
                          <div
                            key={rec.category}
                            className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                              puntCategories.includes(rec.category)
                                ? 'border-red-400 bg-red-50'
                                : 'border-purple-200 hover:border-purple-400'
                            }`}
                            onClick={() => {
                              setPuntCategories(prev =>
                                prev.includes(rec.category)
                                  ? prev.filter(c => c !== rec.category)
                                  : [...prev, rec.category]
                              );
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-purple-900">
                                  {rec.category.toUpperCase()}
                                </span>
                                <Badge
                                  className={
                                    rec.confidence === 'high'
                                      ? 'bg-green-500'
                                      : rec.confidence === 'medium'
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-400'
                                  }
                                >
                                  {rec.confidence} confidence
                                </Badge>
                              </div>
                              {puntCategories.includes(rec.category) ? (
                                <Badge className="bg-red-500">Currently Punted</Badge>
                              ) : (
                                <span className="text-xs text-purple-600 font-medium">Click to punt</span>
                              )}
                            </div>
                            <ul className="space-y-1">
                              {rec.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                                  <span className="text-purple-500 mt-0.5">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {puntRecommendations.length > 3 && (
                        <p className="text-xs text-purple-600 mt-2 text-center">
                          Showing top 3 recommendations • {puntRecommendations.length - 3} more categories analyzed below
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pivot Suggestions */}
                  {pivotSuggestions && pivotSuggestions.length > 0 && (
                    <Alert className="border-orange-400 bg-gradient-to-r from-orange-50 to-red-50">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <AlertDescription>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold text-orange-900 mb-1">Strategy Pivot Recommended!</h4>
                            <p className="text-xs text-orange-700">
                              Your draft has evolved - consider adjusting your punt strategy
                            </p>
                          </div>
                          {pivotSuggestions.map((pivot, idx) => (
                            <div
                              key={idx}
                              className={`bg-white border-2 rounded-lg p-3 ${
                                pivot.urgency === 'high'
                                  ? 'border-red-400'
                                  : 'border-orange-300'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      pivot.urgency === 'high'
                                        ? 'bg-red-500'
                                        : 'bg-orange-500'
                                    }
                                  >
                                    {pivot.urgency} priority
                                  </Badge>
                                  <span className="text-sm font-semibold text-gray-700">
                                    Stop punting {pivot.currentPunt.toUpperCase()} → Start punting {pivot.suggestedPivot.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{pivot.reason}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 text-xs"
                                onClick={() => {
                                  setPuntCategories(prev =>
                                    prev.filter(c => c !== pivot.currentPunt).concat(pivot.suggestedPivot)
                                  );
                                }}
                              >
                                Apply This Pivot
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-3 gap-3">
                    {STAT_CATEGORIES.map((category) => {
                      const isPunted = puntCategories.includes(category.id);
                      return (
                        <div
                          key={category.id}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            isPunted
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => {
                            setPuntCategories(prev =>
                              prev.includes(category.id)
                                ? prev.filter(c => c !== category.id)
                                : [...prev, category.id]
                            );
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">{category.id.toUpperCase()}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {category.scarcity === 'high' && '⭐ High scarcity'}
                                {category.scarcity === 'medium' && '◆ Medium scarcity'}
                                {category.scarcity === 'low' && '○ Common'}
                              </p>
                            </div>
                            {isPunted && (
                              <Badge className="bg-red-500">Punted</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {puntCategories.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-900 mb-2">
                        Active Punt Strategy: {puntCategories.map(c => c.toUpperCase()).join(', ')}
                      </p>
                      <p className="text-xs text-purple-700">
                        Recommendations are now optimized to ignore {puntCategories.map(c => c.toUpperCase()).join(', ')} and
                        maximize value in remaining categories. Players weak in punted categories will rank higher.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="inflation" className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {draftedPlayers.length > 0 ? (
                    <>
                      {/* Global Inflation */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">Global Inflation</span>
                          <Badge className={globalInflation > 10 ? 'bg-red-500' : globalInflation > 0 ? 'bg-orange-500' : 'bg-green-500'}>
                            {globalInflation > 0 ? '+' : ''}{globalInflation.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{draftedPlayers.length} players drafted</p>
                      </div>

                      {/* Position-Specific Inflation */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {positionInflation.map((pos) => (
                          <div key={pos.position} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm">{pos.position}</span>
                              <Badge
                                variant="outline"
                                className={
                                  pos.averageInflation > 15
                                    ? 'border-red-500 text-red-700 bg-red-50'
                                    : pos.averageInflation > 5
                                    ? 'border-orange-500 text-orange-700 bg-orange-50'
                                    : 'border-green-500 text-green-700 bg-green-50'
                                }
                              >
                                {pos.averageInflation > 0 ? '+' : ''}{pos.averageInflation.toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">{pos.count} drafted</p>
                            {pos.averageInflation > 20 && (
                              <p className="text-xs text-red-600 mt-1 font-medium">
                                ⚠️ Highly inflated - consider other positions
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <Alert className="border-purple-300 bg-purple-50">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-sm text-purple-800">
                          <strong>Strategy Tip:</strong> Target positions with negative or low inflation for value plays.
                          Positions with 15%+ inflation are significantly overpriced.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <Alert className="border-purple-300 bg-purple-50">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-sm text-purple-800">
                        Start drafting players to see real-time position inflation tracking
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="competitive" className="max-h-[600px] overflow-y-auto">
                  {/* Competitive Analysis Content */}
                  {myPlayers.length > 0 && opponentTeams.some(t => t.players.length > 0) ? (
                    <div className="space-y-6 pr-2">
                      {/* My team analysis */}
                      {categoryCoverage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-sm text-blue-900 mb-2">Your Team's Projected Strengths</h3>
                          <div className="flex gap-2 flex-wrap">
                            {Object.entries(categoryCoverage.strength)
                              .filter(([cat]) => !puntCategories.includes(cat))
                              .map(([cat, strength]) => (
                                <Badge
                                  key={cat}
                                  className={
                                    strength === 'strong'
                                      ? 'bg-green-500'
                                      : strength === 'weak'
                                      ? 'bg-red-500'
                                      : 'bg-gray-400'
                                  }
                                >
                                  {cat.toUpperCase()}: {strength}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Opponent matchups */}
                      <div className="space-y-3">
                        {opponentTeams
                          .filter(team => team.players.length > 0)
                          .map(opponent => {
                            const opponentAnalysis = analyzeTeamCategories(opponent.players, playerDatabase);
                            if (!opponentAnalysis || !categoryCoverage) return null;

                            const matchup = calculateH2HMatchup(
                              categoryCoverage.strength,
                              opponentAnalysis.strength,
                              puntCategories
                            );

                            const isExpanded = expandedTeams.has(opponent.name);

                            return (
                              <Collapsible
                                key={opponent.name}
                                open={isExpanded}
                                onOpenChange={(open) => {
                                  setExpandedTeams(prev => {
                                    const newSet = new Set(prev);
                                    if (open) {
                                      newSet.add(opponent.name);
                                    } else {
                                      newSet.delete(opponent.name);
                                    }
                                    return newSet;
                                  });
                                }}
                              >
                                <div className="border border-rose-200 rounded-lg bg-white">
                                  <CollapsibleTrigger className="w-full p-4 hover:bg-rose-50/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-2">
                                        <ChevronDown className={`w-4 h-4 text-rose-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        <div className="text-left">
                                          <h3 className="font-semibold text-rose-900">{opponent.name}</h3>
                                          <p className="text-xs text-gray-600">
                                            {opponent.players.length} players · ${opponent.budget} remaining
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className={`text-2xl font-bold ${
                                          matchup.wins > matchup.losses ? 'text-green-600' :
                                          matchup.wins < matchup.losses ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                          {matchup.wins}-{matchup.losses}
                                        </p>
                                        <p className="text-xs text-gray-500">Projected cats</p>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="px-4 pb-4 space-y-3">
                                      {/* Category by category breakdown */}
                                      <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(matchup.categoryResults).map(([cat, result]) => (
                                          <div
                                            key={cat}
                                            className={`text-center p-2 rounded text-xs font-medium ${
                                              result === 'win' ? 'bg-green-100 text-green-800' :
                                              result === 'loss' ? 'bg-red-100 text-red-800' :
                                              'bg-gray-100 text-gray-600'
                                            }`}
                                          >
                                            {cat.toUpperCase()}
                                            <div className="text-xs font-normal mt-0.5">
                                              {result === 'win' ? '✓' : result === 'loss' ? '✗' : '~'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Opponent's strong categories */}
                                      <div className="pt-3 border-t">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Their strengths:</p>
                                        <div className="flex gap-1 flex-wrap">
                                          {Object.entries(opponentAnalysis.strength)
                                            .filter(([, strength]) => strength === 'strong')
                                            .map(([cat]) => (
                                              <Badge key={cat} className="text-xs bg-rose-100 text-rose-700">
                                                {cat.toUpperCase()}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>

                                      {/* Strategic recommendations */}
                                      {matchup.wins <= matchup.losses && (
                                        <Alert className="border-orange-300 bg-orange-50">
                                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                                          <AlertDescription className="text-xs text-orange-800">
                                            <strong>Behind in matchup:</strong> Focus on toss-up categories and shore up weak areas.
                                            Target players strong in {
                                              Object.entries(matchup.categoryResults)
                                                .filter(([, result]) => result === 'toss-up')
                                                .map(([cat]) => cat.toUpperCase())
                                                .slice(0, 3)
                                                .join(', ')
                                            }
                                          </AlertDescription>
                                        </Alert>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            );
                          })}
                      </div>

                      {/* Strategic recommendations based on league landscape */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="font-semibold text-sm text-purple-900 mb-2">Draft Strategy Recommendations</h3>
                        {(() => {
                          const strongCategories = opponentTeams
                            .filter(t => t.players.length > 0)
                            .flatMap(t => {
                              const analysis = analyzeTeamCategories(t.players, playerDatabase);
                              if (!analysis) return [];
                              return Object.entries(analysis.strength)
                                .filter(([, s]) => s === 'strong')
                                .map(([cat]) => cat);
                            });

                          const categoryCounts = strongCategories.reduce((acc, cat) => {
                            acc[cat] = (acc[cat] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);

                          const contested = Object.entries(categoryCounts)
                            .filter(([, count]) => count >= 2)
                            .map(([cat]) => cat.toUpperCase());

                          return (
                            <div className="space-y-2 text-sm text-purple-900">
                              {contested.length > 0 && (
                                <p>
                                  <strong>Highly contested categories:</strong> {contested.join(', ')} -
                                  Multiple teams competing, consider punting if you're behind
                                </p>
                              )}
                              {categoryCoverage && (
                                <p>
                                  <strong>Your weak spots:</strong> {
                                    Object.entries(categoryCoverage.strength)
                                      .filter(([cat, s]) => s === 'weak' && !puntCategories.includes(cat))
                                      .map(([cat]) => cat.toUpperCase())
                                      .join(', ') || 'None identified'
                                  } - Prioritize these in remaining picks
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <Alert className="border-rose-300 bg-rose-50">
                      <AlertDescription className="text-sm text-rose-800">
                        Track opponent teams to see competitive analysis and head-to-head projections
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="nominations" className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {nominationSuggestions.length > 0 ? (
                    <>
                      <Alert className="border-indigo-300 bg-indigo-50">
                        <AlertDescription className="text-sm text-indigo-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4" />
                            <strong>{draftPhase.charAt(0).toUpperCase() + draftPhase.slice(1)} Phase Strategy</strong>
                          </div>
                          {draftPhase === 'early' && (
                            <>{puntCategories.length > 0
                              ? 'Nominate expensive players that conflict with your punt strategy to drain opponents\' budgets.'
                              : 'Nominate top-tier players to gauge market value or drain opponents\' budgets. Set a punt strategy for more tailored suggestions.'
                            }</>
                          )}
                          {draftPhase === 'middle' && (
                            <>Nominate your targets before scarcity drives up prices.</>
                          )}
                          {draftPhase === 'late' && (
                            <>Nominate specialists and sleepers to fill category gaps.</>
                          )}
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        {nominationSuggestions.map((suggestion, idx) => {
                          const tier = getPlayerTier(suggestion.player);
                          const archetypes = getPlayerArchetypes(suggestion.player);
                          return (
                            <div key={idx} className="border border-indigo-200 rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold">{suggestion.player.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {suggestion.player.position} · {tier.name}
                                  </p>
                                </div>
                                <Badge variant="outline" className="border-indigo-500 text-indigo-700">
                                  Rank #{suggestion.player.rank}
                                </Badge>
                              </div>
                              <div className="flex gap-1 flex-wrap mb-2">
                                {archetypes.slice(0, 2).map((arch, i) => (
                                  <Badge key={i} className="text-xs bg-indigo-100 text-indigo-700">
                                    {arch}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-indigo-700 italic">{suggestion.reason}</p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Alert className="border-indigo-300 bg-indigo-50">
                      <AlertDescription className="text-sm text-indigo-800">
                        Nomination suggestions will appear once the draft starts
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Player Table & Draft Recommendations - Side by Side */}
        {draftInProgress && playerDatabase.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Draft Recommendations - Right (1 column) */}
            <div className="lg:col-span-1 lg:order-2">
              <Card className="border-emerald-200 h-full sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Top Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on team needs & value
                  </CardDescription>
                </CardHeader>
                <CardContent>
              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {/* Top Recommended Players */}
                <div className="space-y-2">
                    {topRecommendations.map((player, idx) => {
                      const isDrafted = draftedPlayerNames.has(player.name.toLowerCase());
                      const draftedInfo = isDrafted
                        ? draftedPlayers.find(p => p.name.toLowerCase() === player.name.toLowerCase())
                        : null;

                      return (
                        <div
                          key={player.rank}
                          className={`border rounded-lg p-3 ${
                            isDrafted ? 'bg-gray-100 border-gray-300' : 'bg-white border-emerald-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                                <span className="font-semibold">{player.name}</span>
                                {isDrafted && <Badge variant="secondary">Drafted</Badge>}
                                <Badge variant="outline" className="text-xs">
                                  {player.tier?.name || 'N/A'}
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-1 text-xs text-gray-600">
                                <span>{player.position}</span>
                                <span>·</span>
                                <span>{player.team}</span>
                                <span>·</span>
                                <span>Rank #{player.rank}</span>
                              </div>
                              {/* Archetypes */}
                              <div className="flex gap-1 flex-wrap mt-2">
                                {player.archetypes?.slice(0, 3).map((arch: string, i: number) => (
                                  <Badge key={i} className="text-xs bg-emerald-100 text-emerald-700">
                                    {arch}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-emerald-600">
                                Score: {player.score?.toFixed(1) || player.value.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {player.pointsPerGame.toFixed(1)} pts · {player.assistsPerGame.toFixed(1)} ast
                              </p>
                              <p className="text-xs text-gray-500">
                                {player.reboundsPerGame.toFixed(1)} reb · {player.blocksPerGame.toFixed(1)} blk
                              </p>
                              {draftedInfo && (
                                <p className="text-xs font-semibold text-red-600">
                                  Sold: ${draftedInfo.actualPrice}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Why recommended */}
                          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            {player.position.split('/').some(pos => positionNeeds[pos] > 0) && 'Fills position need · '}
                            {player.score && player.score > 5 && 'Excellent punt-adjusted value · '}
                            {!positionInflation.find(pi => player.position.includes(pi.position) && pi.averageInflation > 10) && 'Low inflation position · '}
                            {player.tier?.name === 'Tier 4' && draftPhase === 'late' && 'Late-round specialist'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Database Table - Left/Center (3 columns) */}
        <div className="lg:col-span-3 lg:order-1">
          <Card className="border-slate-200 h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-slate-600" />
                    Player Database
                  </CardTitle>
                  <CardDescription>
                    Search and nominate players for auction
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={playerDatabaseTab} onValueChange={(v) => setPlayerDatabaseTab(v as 'players' | 'history')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="players">Player Database</TabsTrigger>
                  <TabsTrigger value="history">Draft History ({draftedPlayers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="players" className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search players by name, team, position..."
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        className="pl-9"
                      />
                      {tableSearch && (
                        <button
                          onClick={() => setTableSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <Select value={tableFilter} onValueChange={(v: string) => setTableFilter(v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Players</SelectItem>
                        <SelectItem value="available">Available Only</SelectItem>
                        <SelectItem value="drafted">Drafted Only</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="PG">PG</SelectItem>
                        <SelectItem value="SG">SG</SelectItem>
                        <SelectItem value="SF">SF</SelectItem>
                        <SelectItem value="PF">PF</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge variant="outline" className="self-center">
                      {tableData.length} players
                    </Badge>
                  </div>

                  {/* Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-[640px]">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="border-b">
                            <th className="text-left px-1 py-1.5 font-semibold">Rank</th>
                            <th className="text-left px-1 py-1.5 font-semibold">Player</th>
                            <th className="text-left px-1 py-1.5 font-semibold">Tier</th>
                            <th className="text-left px-1 py-1.5 font-semibold">Pos</th>
                            <th className="text-right px-1 py-1.5 font-semibold">PTS</th>
                            <th className="text-right px-1 py-1.5 font-semibold">3PM</th>
                            <th className="text-right px-1 py-1.5 font-semibold">REB</th>
                            <th className="text-right px-1 py-1.5 font-semibold">AST</th>
                            <th className="text-right px-1 py-1.5 font-semibold">STL</th>
                            <th className="text-right px-1 py-1.5 font-semibold">BLK</th>
                            <th className="text-right px-1 py-1.5 font-semibold">FG%</th>
                            <th className="text-right px-1 py-1.5 font-semibold">FT%</th>
                            <th className="text-right px-1 py-1.5 font-semibold">TO</th>
                            <th className="text-center px-1 py-1.5 font-semibold">Status</th>
                            <th className="text-right px-1 py-1.5 font-semibold">Auction $</th>
                            {draftInProgress && <th className="text-center px-1 py-1.5 font-semibold">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((player) => {
                            const isDrafted = draftedPlayerNames.has(player.name.toLowerCase());
                            const draftedInfo = isDrafted
                              ? draftedPlayers.find(p => p.name.toLowerCase() === player.name.toLowerCase())
                              : null;
                            const tier = getPlayerTier(player);

                            return (
                              <tr
                                key={player.rank}
                                className={`border-b hover:bg-slate-50 ${
                                  isDrafted ? 'bg-gray-50' : ''
                                }`}
                              >
                                <td className="px-1 py-1.5 text-gray-600">{player.rank}</td>
                                <td className="px-1 py-1.5 font-medium">
                                  {player.name}
                                  {player.injury && (
                                    <span className={`ml-1 text-xs ${
                                      player.injury.toLowerCase().includes('out for season') ||
                                      player.injury.toLowerCase().includes('out indefinitely') ||
                                      player.injury.toLowerCase().includes('out for year')
                                        ? 'text-red-700 font-bold'
                                        : 'text-orange-500'
                                    }`}>
                                      ({player.injury})
                                    </span>
                                  )}
                                </td>
                                <td className="px-1 py-1.5">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      tier.name === 'Tier 1' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                                      tier.name === 'Tier 2' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                      tier.name === 'Tier 3' ? 'border-green-500 text-green-700 bg-green-50' :
                                      'border-gray-400 text-gray-600'
                                    }`}
                                  >
                                    {tier.name}
                                  </Badge>
                                </td>
                                <td className="px-1 py-1.5">
                                  <Badge variant="outline" className="text-xs">
                                    {player.position}
                                  </Badge>
                                </td>
                                <td className="px-1 py-1.5 text-right">{player.pointsPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{player.threePointersPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{player.reboundsPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{player.assistsPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{player.stealsPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{player.blocksPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-right">{(player.fgPercentage * 100).toFixed(1)}%</td>
                                <td className="px-1 py-1.5 text-right">{(player.ftPercentage * 100).toFixed(1)}%</td>
                                <td className="px-1 py-1.5 text-right">{player.turnoversPerGame.toFixed(1)}</td>
                                <td className="px-1 py-1.5 text-center">
                                  {isDrafted ? (
                                    <Badge variant="secondary">Drafted</Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-green-500 text-green-700">
                                      Available
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-1 py-1.5 text-right">
                                  {draftedInfo ? (
                                    <span className="font-semibold">${draftedInfo.actualPrice}</span>
                                  ) : player.auctionValue ? (
                                    <span className="text-blue-600 font-medium">${player.auctionValue}</span>
                                  ) : (
                                    <span className="text-gray-400">$1</span>
                                  )}
                                </td>
                                {draftInProgress && (
                                  <td className="px-1 py-1.5 text-center">
                                    {!isDrafted ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleNominatePlayer(player)}
                                        className="text-xs"
                                      >
                                        Nominate
                                      </Button>
                                    ) : (
                                      <span className="text-xs text-gray-400">Drafted</span>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  {draftedPlayers.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        No players drafted yet. Start drafting to see your draft history here.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-[640px]">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100 sticky top-0">
                            <tr className="border-b">
                              <th className="text-left px-3 py-2 font-semibold">#</th>
                              <th className="text-left px-3 py-2 font-semibold">Player</th>
                              <th className="text-left px-3 py-2 font-semibold">Position</th>
                              <th className="text-left px-3 py-2 font-semibold">Drafted By</th>
                              <th className="text-right px-3 py-2 font-semibold">Price</th>
                              <th className="text-right px-3 py-2 font-semibold">Value</th>
                              <th className="text-right px-3 py-2 font-semibold">Inflation</th>
                              <th className="text-center px-3 py-2 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {draftedPlayers.map((player, index) => {
                              const isEditing = editingDraftIndex === index;
                              const inflation = player.projectedValue > 0
                                ? ((player.actualPrice - player.projectedValue) / player.projectedValue) * 100
                                : 0;

                              return (
                                <tr key={index} className="border-b hover:bg-slate-50">
                                  <td className="px-3 py-2 text-gray-600">{index + 1}</td>
                                  <td className="px-3 py-2 font-medium">{player.name}</td>
                                  <td className="px-3 py-2">
                                    <Badge variant="outline" className="text-xs">
                                      {player.position}
                                    </Badge>
                                  </td>
                                  <td className="px-3 py-2">
                                    {isEditing ? (
                                      <Select value={editDraftTeam} onValueChange={setEditDraftTeam}>
                                        <SelectTrigger className="h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="me">My Team</SelectItem>
                                          {opponentTeams.map((team) => (
                                            <SelectItem key={team.name} value={team.name}>
                                              {team.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <span className={player.draftedBy === 'me' ? 'font-semibold text-green-700' : ''}>
                                        {player.draftedBy === 'me' ? 'My Team' : player.draftedBy}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {isEditing ? (
                                      <Input
                                        type="number"
                                        value={editDraftPrice}
                                        onChange={(e) => setEditDraftPrice(e.target.value)}
                                        className="h-8 w-20 text-right"
                                      />
                                    ) : (
                                      <span className="font-semibold">${player.actualPrice}</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-right text-gray-600">
                                    ${player.projectedValue}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    <span className={`font-medium ${
                                      inflation > 15 ? 'text-red-600' :
                                      inflation > 5 ? 'text-orange-600' :
                                      inflation < -5 ? 'text-green-600' :
                                      'text-gray-600'
                                    }`}>
                                      {inflation > 0 ? '+' : ''}{inflation.toFixed(1)}%
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {isEditing ? (
                                      <div className="flex justify-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleSaveDraftEdit}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Check className="w-4 h-4 text-green-600" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleCancelDraftEdit}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="w-4 h-4 text-gray-600" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex justify-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEditDraftEntry(index)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit2 className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            if (confirm(`Delete ${player.name} from draft history?`)) {
                                              handleDeleteDraftEntry(index);
                                            }
                                          }}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    )}

        {/* Nomination Modal */}
        <Dialog open={nominatedPlayer !== null} onOpenChange={() => setNominatedPlayer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nominate Player</DialogTitle>
              <DialogDescription>
                Record the auction results for this player
              </DialogDescription>
            </DialogHeader>
            {nominatedPlayer && (
              <div className="space-y-4">
                {/* Player Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{nominatedPlayer.name}</h3>
                      <p className="text-sm text-gray-600">
                        {nominatedPlayer.position} · {nominatedPlayer.team}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Rank #{nominatedPlayer.rank}</Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {getPlayerTier(nominatedPlayer).name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">PTS</p>
                      <p className="font-semibold">{nominatedPlayer.pointsPerGame.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">REB</p>
                      <p className="font-semibold">{nominatedPlayer.reboundsPerGame.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">AST</p>
                      <p className="font-semibold">{nominatedPlayer.assistsPerGame.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">BLK</p>
                      <p className="font-semibold">{nominatedPlayer.blocksPerGame.toFixed(1)}</p>
                    </div>
                  </div>
                </div>

                {/* Auction Price Input */}
                <div className="space-y-2">
                  <Label htmlFor="nomination-price">Auction Price ($)</Label>
                  <Input
                    id="nomination-price"
                    type="number"
                    placeholder="Enter final auction price"
                    value={nominationPrice}
                    onChange={(e) => setNominationPrice(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Team Selection */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nomination-is-mine"
                      checked={nominationIsMine}
                      onCheckedChange={(checked) => {
                        setNominationIsMine(checked === true);
                        if (checked) setNominationTeam('');
                      }}
                    />
                    <Label htmlFor="nomination-is-mine" className="font-normal cursor-pointer">
                      I won this player
                    </Label>
                  </div>

                  {!nominationIsMine && opponentTeams.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="nomination-team">Or select opponent team:</Label>
                      <Select
                        value={nominationTeam}
                        onValueChange={setNominationTeam}
                      >
                        <SelectTrigger id="nomination-team">
                          <SelectValue placeholder="Select team that won..." />
                        </SelectTrigger>
                        <SelectContent>
                          {opponentTeams.map((team) => (
                            <SelectItem key={team.name} value={team.name}>
                              {team.name} (${team.budget} left, {team.players.length} players)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Bid Recommendation */}
                {nominationIsMine && nominationPrice && (
                  <Alert className={
                    parseFloat(nominationPrice) > maxBid
                      ? 'border-red-300 bg-red-50'
                      : 'border-blue-300 bg-blue-50'
                  }>
                    <AlertDescription className="text-sm">
                      {parseFloat(nominationPrice) > maxBid ? (
                        <span className="text-red-800">
                          <strong>Warning:</strong> This exceeds your max bid of ${maxBid}
                        </span>
                      ) : (
                        <span className="text-blue-800">
                          Your max bid is ${maxBid}. Budget remaining after: ${budgetRemaining - parseFloat(nominationPrice)}
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitNomination}
                    disabled={!nominationPrice || (!nominationIsMine && !nominationTeam)}
                    className="flex-1"
                  >
                    Confirm Draft
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setNominatedPlayer(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* How It Works Section */}
        <Card className="mt-8 border-gray-200">
          <CardHeader>
            <CardTitle>How This Tool Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  1
                </div>
                <h3 className="font-semibold">Configure League Settings</h3>
                <p className="text-sm text-gray-600">
                  Set up your scoring type, roster positions, stat categories, and league rules to ensure accurate valuations.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  2
                </div>
                <h3 className="font-semibold">Upload Pre-Draft Data</h3>
                <p className="text-sm text-gray-600">
                  Import your baseline auction values, player rankings, and projections from CSV files.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <h3 className="font-semibold">Track Live Auction Prices</h3>
                <p className="text-sm text-gray-600">
                  Enter actual prices as players are drafted. The tool detects trends and inflation patterns in real-time.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  4
                </div>
                <h3 className="font-semibold">Get Dynamic Recommendations</h3>
                <p className="text-sm text-gray-600">
                  See which positions/categories are overvalued, find bargains, and adjust your strategy on the fly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
