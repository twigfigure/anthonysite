import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function FantasyBasketball() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<PlayerData[]>([]);
  const [trends, setTrends] = useState<DraftTrend[]>([]);

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
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  1
                </div>
                <h3 className="font-semibold">Upload Pre-Draft Data</h3>
                <p className="text-sm text-gray-600">
                  Import your baseline auction values, player rankings, and projections from CSV files.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <h3 className="font-semibold">Track Live Auction Prices</h3>
                <p className="text-sm text-gray-600">
                  Enter actual prices as players are drafted. The tool detects trends and inflation patterns in real-time.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  3
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
