import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, TrendingUp, DollarSign, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [draftedPlayers, setDraftedPlayers] = useState<PlayerData[]>([]);
  const [trends, setTrends] = useState<DraftTrend[]>([]);

  const handleStatCategoryToggle = (categoryId: string) => {
    setLeagueSettings(prev => ({
      ...prev,
      statCategories: prev.statCategories.includes(categoryId)
        ? prev.statCategories.filter(c => c !== categoryId)
        : [...prev.statCategories, categoryId]
    }));
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

                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Start Draft Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis Section */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Market Trend Analysis
            </CardTitle>
            <CardDescription>
              Real-time insights into how your draft is trending vs. projections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <p className="text-sm text-purple-800">
                Upload your CSV data and start tracking draft picks to see trend analysis here.
              </p>
              <p className="text-xs text-purple-600 mt-2">
                Example: If point guards are going 20% over value, you'll see recommendations to target undervalued positions.
              </p>
            </div>
          </CardContent>
        </Card>

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
