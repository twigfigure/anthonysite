import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, BarChart3, Settings, AlertTriangle, Wallet, Search, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    teamCount: 12,
    budgetPerTeam: 200,
    bidTime: 20,
    nominationTime: 15,
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
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
  const [showPuntStrategy, setShowPuntStrategy] = useState(false);

  // Opponent tracking state
  const [opponentTeams, setOpponentTeams] = useState<OpponentTeam[]>([]);
  const [showCompetitiveLandscape, setShowCompetitiveLandscape] = useState(false);

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

  // Get drafted player names for lookup
  const draftedPlayerNames = useMemo(() =>
    new Set(draftedPlayers.map(p => p.name.toLowerCase())),
    [draftedPlayers]
  );

  // Get available players
  const availablePlayers = useMemo(() =>
    playerDatabase.filter(p => !draftedPlayerNames.has(p.name.toLowerCase())),
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
        const totalInflation = posPlayers.reduce((sum, p) => {
          const inflation = ((p.actualPrice - p.projectedValue) / p.projectedValue) * 100;
          return sum + inflation;
        }, 0);

        inflationData.push({
          position: pos,
          averageInflation: totalInflation / posPlayers.length,
          count: posPlayers.length,
        });
      }
    });

    return inflationData;
  }, [draftedPlayers]);

  // Calculate global inflation
  const globalInflation = useMemo(() => {
    if (draftedPlayers.length === 0) return 0;
    const totalInflation = draftedPlayers.reduce((sum, p) => {
      const inflation = ((p.actualPrice - p.projectedValue) / p.projectedValue) * 100;
      return sum + inflation;
    }, 0);
    return totalInflation / draftedPlayers.length;
  }, [draftedPlayers]);

  // Position needs analysis
  const positionNeeds = useMemo(() => {
    const needs: Record<string, number> = {
      PG: 0, SG: 0, SF: 0, PF: 0, C: 0
    };

    // Count how many of each position I have
    const positionCounts: Record<string, number> = {
      PG: 0, SG: 0, SF: 0, PF: 0, C: 0
    };

    myPlayers.forEach(player => {
      const positions = player.position.split('/');
      positions.forEach(pos => {
        if (positionCounts[pos] !== undefined) {
          positionCounts[pos]++;
        }
      });
    });

    // Calculate needs (higher score = more needed)
    // Simple heuristic: positions with fewer players are more needed
    const maxCount = Math.max(...Object.values(positionCounts), 1);
    Object.keys(needs).forEach(pos => {
      needs[pos] = maxCount - positionCounts[pos];
    });

    return needs;
  }, [myPlayers]);

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
      // Nominate expensive players you don't need
      const expensivePlayers = availablePlayers
        .filter(p => getPlayerTier(p).name === 'Tier 1')
        .filter(p => {
          // Players that conflict with your punt strategy
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
      projectedValue: 0, // We don't have projected value in the new flow
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

    // Initialize opponent teams
    const numTeams = (leagueSettings.teamCount || 10) - 1; // Exclude my team
    const initialBudget = leagueSettings.budgetPerTeam || 200;
    const opponents: OpponentTeam[] = [];

    for (let i = 1; i <= numTeams; i++) {
      opponents.push({
        name: `Team ${i}`,
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

  // Parse BBM Player Rankings format
  const parseBBMData = (jsonData: Record<string, unknown>[]): PlayerData[] => {
    return jsonData.map((row) => ({
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
      auctionValue: 0, // Will be set manually
    }));
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
        setUploadedFiles(['BBM_PlayerRankings.xlsx (auto-loaded)']);
        console.log(`Auto-loaded ${players.length} players from BBM_PlayerRankings.xlsx`);
      } catch (error) {
        console.error('Error auto-loading player data:', error);
      }
    };

    loadDefaultPlayerData();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadedFiles([file.name]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        const players = parseBBMData(jsonData);
        setPlayerDatabase(players);
        console.log(`Loaded ${players.length} players from Excel file`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the format.');
      }
    };

    reader.readAsBinaryString(file);
  };

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
        {/* Introduction Section */}
        <Card className="mb-8 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Dynamic Auction Draft Tool
            </CardTitle>
            <CardDescription>
              Adjust your auction strategy in real-time based on actual draft day trends and spending patterns.
              Upload your pre-draft CSV data and track actual draft prices to identify market inefficiencies.
            </CardDescription>
          </CardHeader>
        </Card>

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
                    onChange={(e) => setLeagueSettings(prev => ({ ...prev, teamCount: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 12"
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

        {/* Punt Strategy Section */}
        <Card className="mb-8 border-purple-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Punt Strategy
                </CardTitle>
                <CardDescription>
                  Select which category to de-emphasize for optimized draft recommendations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPuntStrategy(!showPuntStrategy)}
              >
                {showPuntStrategy ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showPuntStrategy && (
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-purple-300 bg-purple-50">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-sm text-purple-800">
                    <strong>Punt Strategy:</strong> In 9-cat H2H, you only need to win 5-4. By intentionally ignoring one category,
                    you can dominate 7-8 others. Popular punts: FT% (unlocks big men), FG% (guards/shooters), or TO (high-usage stars).
                  </AlertDescription>
                </Alert>

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
              </div>
            </CardContent>
          )}
        </Card>

        <div className="mb-8">
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
                  <>
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

                    {/* Draft Instructions */}
                    <div className="border-t pt-4">
                      <Alert className="border-blue-300 bg-blue-50">
                        <AlertDescription className="text-sm text-blue-800">
                          <strong>How to draft:</strong> Use the Player Database table below to search and nominate players.
                          Click "Nominate" on any player row to record auction results.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* My Players List */}
                    {myPlayers.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-sm mb-2">My Team ({myPlayers.length}/{totalSlots})</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {myPlayers.map((player, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <span className="font-medium">{player.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{player.position}</Badge>
                                <span className="text-gray-600">${player.actualPrice}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player database info */}
        {playerDatabase.length > 0 && (
          <Card className="mb-8 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 text-sm text-blue-800">
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">{uploadedFiles[0] || 'Player database loaded'}</span>
                <Badge className="bg-blue-600">{playerDatabase.length} players</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Coverage & Budget Allocation */}
        {draftInProgress && myPlayers.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Category Coverage Dashboard */}
            {categoryCoverage && (
              <Card className="border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                    Category Coverage
                  </CardTitle>
                  <CardDescription>
                    Your team's strength in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {/* Budget Allocation by Tier */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-600" />
                  Budget by Tier
                </CardTitle>
                <CardDescription>
                  Track balanced spending strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Draft Phase & Nomination Suggestions */}
        {draftInProgress && nominationSuggestions.length > 0 && (
          <Card className="mb-8 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Nomination Suggestions ({draftPhase.charAt(0).toUpperCase() + draftPhase.slice(1)} Phase)
              </CardTitle>
              <CardDescription>
                Strategic nomination recommendations based on current draft phase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-indigo-300 bg-indigo-50">
                  <AlertDescription className="text-sm text-indigo-800">
                    {draftPhase === 'early' && (
                      <><strong>Early Phase:</strong> Nominate expensive players you don't need to drain opponents' budgets.</>
                    )}
                    {draftPhase === 'middle' && (
                      <><strong>Middle Phase:</strong> Nominate your targets before scarcity drives up prices.</>
                    )}
                    {draftPhase === 'late' && (
                      <><strong>Late Phase:</strong> Nominate specialists and sleepers to fill category gaps.</>
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Position Inflation Tracker */}
        {draftInProgress && draftedPlayers.length > 0 && (
          <Card className="mb-8 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Live Position Inflation Tracker
              </CardTitle>
              <CardDescription>
                Real-time inflation by position - see which positions are overvalued
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opponent Analysis & Competitive Landscape */}
        {draftInProgress && myPlayers.length > 0 && opponentTeams.some(t => t.players.length > 0) && (
          <Card className="mb-8 border-rose-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-rose-600" />
                    Competitive Analysis
                  </CardTitle>
                  <CardDescription>
                    Head-to-head matchup projections vs each opponent
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompetitiveLandscape(!showCompetitiveLandscape)}
                >
                  {showCompetitiveLandscape ? 'Hide' : 'Show'}
                </Button>
              </div>
            </CardHeader>
            {showCompetitiveLandscape && (
              <CardContent>
                <div className="space-y-6">
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

                      return (
                        <div key={opponent.name} className="border border-rose-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-rose-900">{opponent.name}</h3>
                              <p className="text-xs text-gray-600">
                                {opponent.players.length} players · ${opponent.budget} remaining
                              </p>
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
                          <div className="mt-3 pt-3 border-t">
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
                            <Alert className="mt-3 border-orange-300 bg-orange-50">
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
                      );
                    })}

                  {/* Strategic recommendations based on league landscape */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-purple-900 mb-2">Draft Strategy Recommendations</h3>
                    {(() => {
                      // Find most contested categories (many teams strong)
                      const categoryContests: Record<string, number> = {};
                      opponentTeams.forEach(team => {
                        const analysis = analyzeTeamCategories(team.players, playerDatabase);
                        if (analysis) {
                          Object.entries(analysis.strength).forEach(([cat, strength]) => {
                            if (strength === 'strong') {
                              categoryContests[cat] = (categoryContests[cat] || 0) + 1;
                            }
                          });
                        }
                      });

                      const contested = Object.entries(categoryContests)
                        .filter(([cat]) => !puntCategories.includes(cat))
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3);

                      const uncontested = STAT_CATEGORIES
                        .filter(c => !puntCategories.includes(c.id))
                        .filter(c => (categoryContests[c.id] || 0) <= 1)
                        .slice(0, 3);

                      return (
                        <div className="space-y-2 text-sm text-purple-800">
                          {contested.length > 0 && (
                            <p>
                              <strong>Most Contested:</strong> {contested.map(([cat]) => cat.toUpperCase()).join(', ')} -
                              Consider pivoting unless you can dominate
                            </p>
                          )}
                          {uncontested.length > 0 && (
                            <p>
                              <strong>Opportunity Categories:</strong> {uncontested.map(c => c.id.toUpperCase()).join(', ')} -
                              Few teams investing here, easy wins available
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
              </CardContent>
            )}
          </Card>
        )}

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
                <div className="space-y-4">
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
                    <div className="overflow-x-auto max-h-96">
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
                            const archetypes = getPlayerArchetypes(player);

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
                                  {player.injury && <span className="ml-1 text-red-500 text-xs">({player.injury})</span>}
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
                                  ) : (
                                    <span className="text-gray-400">-</span>
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
                </div>
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
