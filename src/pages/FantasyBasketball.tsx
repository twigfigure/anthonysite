import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Upload, TrendingUp, DollarSign, Users, BarChart3, Settings, AlertTriangle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  name: string;
  position: string;
  preAuctionValue: number;
  actualValue?: number;
  category?: string;
  tier?: number;
}

interface DraftedPlayer {
  name: string;
  position: string;
  projectedValue: number;
  actualPrice: number;
  draftedBy: string; // 'me' or 'opponent'
}

interface PositionInflation {
  position: string;
  averageInflation: number; // percentage
  count: number;
  tier1Inflation?: number;
  tier2Inflation?: number;
  tier3Inflation?: number;
}

interface DraftTrend {
  category: string;
  averageInflation: number;
  count: number;
}

const STAT_CATEGORIES = [
  { id: 'fg%', label: 'Field Goal Percentage (FG%)' },
  { id: 'ft%', label: 'Free Throw Percentage (FT%)' },
  { id: '3ptm', label: '3-point Shots Made (3PTM)' },
  { id: 'pts', label: 'Points Scored (PTS)' },
  { id: 'reb', label: 'Total Rebounds (REB)' },
  { id: 'ast', label: 'Assists (AST)' },
  { id: 'st', label: 'Steals (ST)' },
  { id: 'blk', label: 'Blocked Shots (BLK)' },
  { id: 'to', label: 'Turnovers (TO)' },
];

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
  const [draftedPlayers, setDraftedPlayers] = useState<DraftedPlayer[]>([]);
  const [myPlayers, setMyPlayers] = useState<DraftedPlayer[]>([]);
  const [budgetRemaining, setBudgetRemaining] = useState(leagueSettings.budgetPerTeam || 200);
  const [draftInProgress, setDraftInProgress] = useState(false);

  // Draft entry form state
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [projectedValue, setProjectedValue] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [draftedByMe, setDraftedByMe] = useState(false);

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

  const handleStatCategoryToggle = (categoryId: string) => {
    setLeagueSettings(prev => ({
      ...prev,
      statCategories: prev.statCategories.includes(categoryId)
        ? prev.statCategories.filter(c => c !== categoryId)
        : [...prev.statCategories, categoryId]
    }));
  };

  const handleAddDraftedPlayer = () => {
    if (!playerName || !playerPosition || !projectedValue || !actualPrice) return;

    const newPlayer: DraftedPlayer = {
      name: playerName,
      position: playerPosition,
      projectedValue: parseFloat(projectedValue),
      actualPrice: parseFloat(actualPrice),
      draftedBy: draftedByMe ? 'me' : 'opponent',
    };

    setDraftedPlayers(prev => [...prev, newPlayer]);

    if (draftedByMe) {
      setMyPlayers(prev => [...prev, newPlayer]);
      setBudgetRemaining(prev => prev - parseFloat(actualPrice));
    }

    // Reset form
    setPlayerName('');
    setPlayerPosition('');
    setProjectedValue('');
    setActualPrice('');
    setDraftedByMe(false);
  };

  const startDraft = () => {
    setDraftInProgress(true);
    setBudgetRemaining(leagueSettings.budgetPerTeam || 200);
    setDraftedPlayers([]);
    setMyPlayers([]);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);

      // TODO: Parse CSV files and process player data
      // This will be implemented once you upload the actual CSVs
    }
  };

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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              League Settings
            </CardTitle>
            <CardDescription>
              Configure your league settings to ensure accurate player valuations
            </CardDescription>
          </CardHeader>
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
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* CSV Upload Section */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Draft Data
              </CardTitle>
              <CardDescription>
                Upload your pre-draft rankings, projections, and baseline auction values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload CSV files
                    </p>
                    <p className="text-xs text-gray-500">
                      Player rankings, projections, auction values
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {file}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

                    {/* Draft Entry Form */}
                    <div className="border-t pt-4 space-y-3">
                      <h3 className="font-semibold text-sm">Record Drafted Player</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Player Name"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <Input
                          placeholder="Position (e.g., PG)"
                          value={playerPosition}
                          onChange={(e) => setPlayerPosition(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Projected $"
                          value={projectedValue}
                          onChange={(e) => setProjectedValue(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Actual $"
                          value={actualPrice}
                          onChange={(e) => setActualPrice(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="drafted-by-me"
                          checked={draftedByMe}
                          onCheckedChange={(checked) => setDraftedByMe(checked === true)}
                        />
                        <Label htmlFor="drafted-by-me" className="font-normal cursor-pointer">
                          I drafted this player
                        </Label>
                      </div>
                      <Button onClick={handleAddDraftedPlayer} className="w-full">
                        Add Player
                      </Button>
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

        {/* Bid Calculator & Constraint Checker */}
        {draftInProgress && (
          <Card className="mb-8 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Bid Recommendation Calculator
              </CardTitle>
              <CardDescription>
                Check if you should bid on a player based on value and constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BidCalculator
                maxBid={maxBid}
                getBidRecommendation={getBidRecommendation}
                calculateRecommendedMaxBid={calculateRecommendedMaxBid}
              />
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
