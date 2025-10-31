import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, MapPin, Shield, Swords } from 'lucide-react';
import { KINGDOMS, type KingdomData, type RegionData } from '../lib/kingdomsData';

interface GuildOnboardingProps {
  onComplete: (guildName: string, kingdom: string, region: string) => void;
}

export function GuildOnboarding({ onComplete }: GuildOnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'kingdom' | 'region' | 'name'>('welcome');
  const [selectedKingdom, setSelectedKingdom] = useState<KingdomData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [guildName, setGuildName] = useState('');

  const handleKingdomSelect = (kingdom: KingdomData) => {
    setSelectedKingdom(kingdom);
    setSelectedRegion(null);
    setStep('region');
  };

  const handleRegionSelect = (region: RegionData) => {
    setSelectedRegion(region);
    setStep('name');
  };

  const handleComplete = () => {
    if (guildName.trim() && selectedKingdom && selectedRegion) {
      onComplete(guildName.trim(), selectedKingdom.id, selectedRegion.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner-Friendly': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Challenging': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-2xl border-2 border-yellow-500/30 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <Sparkles className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Welcome, Guild Master
            </CardTitle>
            <CardDescription className="text-lg">
              Your journey begins here. Build your guild, recruit hunters, and conquer portals across the realm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <h3 className="font-semibold mb-1">Choose Your Home</h3>
                <p className="text-sm text-muted-foreground">Select from 6 kingdoms</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <h3 className="font-semibold mb-1">Pick a Region</h3>
                <p className="text-sm text-muted-foreground">18 unique territories</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <Swords className="h-8 w-8 mx-auto mb-2 text-red-400" />
                <h3 className="font-semibold mb-1">Conquer Portals</h3>
                <p className="text-sm text-muted-foreground">Regional challenges await</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setStep('kingdom')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
              >
                Begin Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'kingdom') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-3xl">Choose Your Kingdom</CardTitle>
            <CardDescription>
              Each kingdom offers unique culture, challenges, and opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KINGDOMS.map((kingdom) => (
                  <Card
                    key={kingdom.id}
                    className="cursor-pointer hover:border-yellow-500/50 transition-all hover:shadow-lg"
                    onClick={() => handleKingdomSelect(kingdom)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {kingdom.name}
                        <Badge variant="outline">{kingdom.government}</Badge>
                      </CardTitle>
                      <CardDescription>{kingdom.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Theme:</p>
                        <p className="text-sm">{kingdom.theme}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Regions Available:</p>
                        <div className="flex flex-wrap gap-2">
                          {kingdom.regions.map((region) => (
                            <Badge key={region.id} variant="secondary" className="text-xs">
                              {region.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-4">
                        Select {kingdom.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'region' && selectedKingdom) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('kingdom')}
              >
                ← Back
              </Button>
            </div>
            <CardTitle className="text-3xl">Choose Your Starting Region</CardTitle>
            <CardDescription>
              Select your guild's home base in {selectedKingdom.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {selectedKingdom.regions.map((region) => (
                <Card
                  key={region.id}
                  className="cursor-pointer hover:border-yellow-500/50 transition-all hover:shadow-lg"
                  onClick={() => handleRegionSelect(region)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {region.name}
                      <div className="flex gap-2">
                        <Badge variant="outline">{region.terrain}</Badge>
                        <Badge className={getDifficultyColor(region.difficulty)}>
                          {region.difficulty}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {region.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Start in {region.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'name' && selectedKingdom && selectedRegion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('region')}
              >
                ← Back
              </Button>
            </div>
            <CardTitle className="text-3xl">Name Your Guild</CardTitle>
            <CardDescription>
              Choose a name that will strike fear into the hearts of monsters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kingdom:</span>
                <span className="font-semibold">{selectedKingdom.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Starting Region:</span>
                <span className="font-semibold">{selectedRegion.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Terrain:</span>
                <Badge variant="outline">{selectedRegion.terrain}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guild-name" className="text-base">Guild Name</Label>
              <Input
                id="guild-name"
                placeholder="Enter your guild name..."
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                maxLength={50}
                className="text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {guildName.length}/50 characters
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg py-6"
              onClick={handleComplete}
              disabled={!guildName.trim()}
            >
              Create Guild & Start Adventure
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
