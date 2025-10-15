import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Trophy, Download, Share2, Copy, Check, Loader2, X, LogIn, LogOut, User, Info, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateEmotionMonPrompt, type RarityLevel } from "@/lib/emotionMonPrompt";
import { generateImageWithBanana } from "@/lib/bananaService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/lib/supabase";
import { uploadImageToStorage, deleteImageFromStorage } from "@/lib/supabaseStorage";

const Kindred = () => {
  const [health, setHealth] = useState(80);
  const [mood, setMood] = useState(60);
  const [energy, setEnergy] = useState(100);
  const [faith, setFaith] = useState(100);
  const [description, setDescription] = useState("");
  const [generatedMon, setGeneratedMon] = useState<any>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nickname, setNickname] = useState("");
  const [selectedMon, setSelectedMon] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [allMons, setAllMons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [breedingParent, setBreedingParent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kindredFables, setKindredFables] = useState<string[]>([]);
  const [showKindredSelector, setShowKindredSelector] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  // Check if current user is admin
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const handleMonClick = (mon: any) => {
    setSelectedMon(mon);
    setIsModalOpen(true);
  };

  // Fetch all mons from database on mount and when user changes
  useEffect(() => {
    // Always fetch mons when component mounts or user changes
    fetchMons();
    // Load Kindred Fables from database (same for everyone)
    fetchKindredFables();
  }, [user]); // Re-fetch when user state changes (including when auth loads)

  const fetchKindredFables = async () => {
    try {
      const { data, error } = await supabase
        .from('kindred_fables')
        .select('kindred_ids')
        .single();

      if (error) throw error;

      if (data?.kindred_ids) {
        setKindredFables(data.kindred_ids);
      }
    } catch (error) {
      console.error('Error fetching kindred fables:', error);
    }
  };

  const saveKindredFables = async (newFables: string[]) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can edit Kindred Fables",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('kindred_fables')
        .update({
          kindred_ids: newFables,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('id', (await supabase.from('kindred_fables').select('id').single()).data?.id);

      if (error) throw error;

      toast({
        title: "Kindred Fables Updated",
        description: "Featured Kindreds have been updated",
      });
    } catch (error) {
      console.error('Error saving kindred fables:', error);
      toast({
        title: "Save Failed",
        description: "Failed to update Kindred Fables",
        variant: "destructive",
      });
    }
  };

  const fetchMons = async () => {
    try {
      // Fetch all mons for Kindred Fables display
      // (since featured mons can be from any user)
      const { data, error } = await supabase
        .from('emotion_mons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllMons(data || []);
    } catch (error) {
      console.error('Error fetching mons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user's own mons (will be the same as allMons when logged in)
  const myMons = allMons.filter(mon => user && mon.user_id === user.id);

  // Paginated mons for display
  const displayedMons = myMons.slice(0, displayLimit);
  const hasMoreMons = myMons.length > displayLimit;

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 20);
  };

  const handleGenerate = async (forcedRarity?: RarityLevel) => {
    if (!user) {
      setAuthModalOpen(true);
      toast({
        title: "Sign in Required",
        description: "Please sign in to generate Emotion-mons",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate intelligent prompt based on stats and description
      const result = generateEmotionMonPrompt(
        { health, mood, energy, faith },
        description,
        forcedRarity
      );

      // Find the breeding parent if selected (and not "none")
      const parentMon = (breedingParent && breedingParent !== "none")
        ? allMons.find(m => m.id === breedingParent)
        : null;

      toast({
        title: parentMon ? "Breeding your Emotion-mon..." : "Generating your Emotion-mon...",
        description: parentMon
          ? `Using ${parentMon.name} as reference... this may take 5-15 seconds`
          : "This may take 5-15 seconds",
      });

      // Get API key from environment
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('Google Gemini API key not configured. Please check your .env file.');
      }

      // Generate image with Google Gemini - include reference if breeding
      const base64Image = await generateImageWithBanana({
        prompt: result.prompt,
        apiKey,
        referenceImage: parentMon?.image_url,
      });

      // Upload to Supabase Storage instead of using base64
      toast({
        title: "Uploading to storage...",
        description: "Saving your Emotion-mon image",
      });

      const storageUrl = await uploadImageToStorage(base64Image, user.id);

      const colorClass = `from-${['sage', 'dusk', 'amber'][Math.floor(Math.random() * 3)]}`;

      // Don't save to database yet - just set in local state for preview
      setGeneratedMon({
        name: result.name,
        generated_name: result.name,
        nickname: null,
        health,
        mood,
        energy,
        faith,
        description,
        prompt: result.prompt,
        color_palette: result.colorPalette,
        primary_trait: result.primaryTrait,
        rarity: result.rarity,
        title: result.title,
        image_url: storageUrl,
        color_class: colorClass,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        stats: { health, mood, energy, faith },
        color: colorClass,
        isSaved: false, // Flag to indicate not yet saved to database
      });

      // Reset nickname when new mon is generated
      setNickname("");

      toast({
        title: "Emotion-mon Generated!",
        description: `Preview your ${result.name} and click Submit to save`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Emotion-mon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    if (generatedMon?.prompt) {
      navigator.clipboard.writeText(generatedMon.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);

      toast({
        title: "Prompt Copied!",
        description: "Paste this into any AI image generator if needed",
      });
    }
  };

  const handleSubmit = async () => {
    if (!user || !generatedMon || generatedMon.isSaved) return;

    setIsSubmitting(true);

    try {
      // Save to database with nickname
      const { data: savedMon, error: saveError } = await supabase
        .from('emotion_mons')
        .insert({
          user_id: user.id,
          name: generatedMon.generated_name,
          generated_name: generatedMon.generated_name,
          nickname: nickname || null,
          health: generatedMon.health,
          mood: generatedMon.mood,
          energy: generatedMon.energy,
          faith: generatedMon.faith,
          description: generatedMon.description,
          prompt: generatedMon.prompt,
          color_palette: generatedMon.color_palette,
          primary_trait: generatedMon.primary_trait,
          rarity: generatedMon.rarity,
          title: generatedMon.title || null,
          image_url: generatedMon.image_url,
          color_class: generatedMon.color_class,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Update generated mon with saved data
      setGeneratedMon({
        ...generatedMon,
        ...savedMon,
        isSaved: true,
      });

      // Refresh the list to show in collections
      await fetchMons();

      toast({
        title: "Emotion-mon Saved!",
        description: nickname
          ? `${nickname} the ${generatedMon.generated_name} has been added to your collection`
          : `${generatedMon.generated_name} has been added to your collection`,
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save Emotion-mon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (monId: string) => {
    if (!user) return;

    try {
      // First, get the mon to find its image URL
      const monToDelete = allMons.find(m => m.id === monId);

      // Delete from database
      const { error } = await supabase
        .from('emotion_mons')
        .delete()
        .eq('id', monId)
        .eq('user_id', user.id); // Ensure user can only delete their own mons

      if (error) throw error;

      // Delete image from storage if it's a storage URL (not base64)
      if (monToDelete?.image_url && !monToDelete.image_url.startsWith('data:image')) {
        try {
          await deleteImageFromStorage(monToDelete.image_url);
        } catch (storageError) {
          console.error('Failed to delete image from storage:', storageError);
          // Don't fail the whole operation if storage delete fails
        }
      }

      toast({
        title: "Emotion-mon Deleted",
        description: "Your Emotion-mon has been removed",
      });

      // Remove from kindred fables if present
      setKindredFables(prev => prev.filter(id => id !== monId));

      // Close the modal
      setIsModalOpen(false);
      setSelectedMon(null);

      // Refresh the list
      await fetchMons();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete Emotion-mon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenKindredSelector = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    setShowKindredSelector(true);
  };

  const handleSelectKindredForSlot = async (monId: string) => {
    if (selectedSlotIndex === null) return;
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can edit Kindred Fables",
        variant: "destructive",
      });
      return;
    }

    const newFables = [...kindredFables];
    // Ensure array has 12 slots
    while (newFables.length < 12) {
      newFables.push('');
    }
    // Remove the mon from any other slot first
    const existingIndex = newFables.indexOf(monId);
    if (existingIndex !== -1) {
      newFables[existingIndex] = '';
    }
    newFables[selectedSlotIndex] = monId;

    setKindredFables(newFables);
    await saveKindredFables(newFables);

    setShowKindredSelector(false);
    setSelectedSlotIndex(null);
  };

  const handleRemoveFromSlot = async (slotIndex: number) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can edit Kindred Fables",
        variant: "destructive",
      });
      return;
    }

    const newFables = [...kindredFables];
    newFables[slotIndex] = '';
    setKindredFables(newFables);
    await saveKindredFables(newFables);
  };

  // Get mons for kindred fables (12 slots)
  // Featured mons can be from any user, not just the logged-in user
  const kindredFableSlots = Array(12).fill(null).map((_, index) => {
    const monId = kindredFables[index];
    if (!monId) return null;
    return allMons.find(mon => mon.id === monId) || null;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back Home
              </Link>
              <div className="w-px h-6 bg-border" />
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber" />
                Kindred Spirit Den
              </h1>
            </div>

            {/* Auth Button */}
            <div>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Transform your emotional state into a unique pixel art creature
          </p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-4">
        {/* Top Section - Kindred Fables */}
        <div className="mb-6">
          {/* Kindred Fables - Single Row */}
          <Card className="p-5 bg-black border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-sage" />
              Kindred Fables
            </h3>
            {!user ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 mb-3">
                  Sign in to view Kindred Fables
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <p className="text-xs text-gray-400 mb-2">
                    Admin: Click empty slots to curate featured Kindreds from all users
                  </p>
                )}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {kindredFableSlots.map((mon, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-48 h-48 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-sage/50 transition-all ${mon || isAdmin ? 'cursor-pointer' : 'cursor-default'} group relative overflow-hidden`}
                      onClick={() => {
                        if (mon) {
                          handleMonClick({
                            ...mon,
                            stats: { health: mon.health, mood: mon.mood, energy: mon.energy, faith: mon.faith },
                            color: mon.color_class,
                            date: new Date(mon.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          });
                        } else if (isAdmin) {
                          handleOpenKindredSelector(index);
                        }
                      }}
                    >
                    {mon ? (
                      <>
                        {mon.image_url ? (
                          <img
                            src={mon.image_url}
                            alt={mon.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${mon.color_class}`} />
                        )}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot(index);
                            }}
                            className="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        {mon.rarity && (
                          <div className={`absolute bottom-1 left-1 px-1 py-0.5 rounded text-[8px] font-bold ${
                            mon.rarity === 'Normal' ? 'bg-gray-200 text-gray-700' :
                            mon.rarity === 'Rare' ? 'bg-blue-200 text-blue-700' :
                            mon.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' :
                            mon.rarity === 'Lord' ? 'bg-violet-200 text-violet-700' :
                            mon.rarity === 'Mythic' ? 'bg-orange-200 text-orange-700' :
                            'bg-cyan-200 text-cyan-700'
                          }`}>
                            {mon.rarity.substring(0, 1)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr_0.8fr] gap-4">
          {/* Left Column - Create */}
          <div className="space-y-4 h-full">
            {/* Input Form */}
            <Card className="p-6 border-border h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-sage rounded-full animate-pulse" />
                  Hatch your Kindred Spirit
                </h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">How it works</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your emotional state is transformed into a unique pixel art creature.
                        Each stat influences the creature's appearance, colors, and characteristics.
                        Save your mons as a visual diary of your emotional journey.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Sliders */}
                <div className="space-y-6">
                  {/* Health Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Health</label>
                      <span className="text-sm text-muted-foreground">{health}%</span>
                    </div>
                    <Slider
                      value={[health]}
                      onValueChange={(val) => setHealth(val[0])}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-destructive [&_[role=slider]]:border-destructive"
                    />
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(health / 20) ? "bg-destructive" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mood Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Mood</label>
                      <span className="text-sm text-muted-foreground">{mood}%</span>
                    </div>
                    <Slider
                      value={[mood]}
                      onValueChange={(val) => setMood(val[0])}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                    />
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(mood / 20) ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Energy Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Energy</label>
                      <span className="text-sm text-muted-foreground">{energy}%</span>
                    </div>
                    <Slider
                      value={[energy]}
                      onValueChange={(val) => setEnergy(val[0])}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-500"
                    />
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(energy / 20) ? "bg-yellow-500" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Faith Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Faith</label>
                      <span className="text-sm text-muted-foreground">{faith}%</span>
                    </div>
                    <Slider
                      value={[faith]}
                      onValueChange={(val) => setFaith(val[0])}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                    />
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(faith / 20) ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Description, Breeding, Generate */}
                <div className="space-y-4 flex flex-col">
                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      How are you feeling? (Optional)
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your current emotional state..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Breeding Selection */}
                  {user && myMons.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Breeding (Optional)
                      </label>
                      <Select value={breedingParent || "none"} onValueChange={setBreedingParent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent mon for breeding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No breeding - Create new</SelectItem>
                          {myMons
                            .filter(mon => mon.image_url) // Only mons with images
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((mon) => (
                              <SelectItem key={mon.id} value={mon.id}>
                                {mon.nickname || mon.name}
                                {' '}
                                ({new Date(mon.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use a previous mon's appearance as a reference for the new generation
                      </p>
                    </div>
                  )}

                  {/* Spacer to push button to bottom */}
                  <div className="flex-1"></div>

                  <Button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                    className="w-full bg-amber hover:bg-amber/90 text-white"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {breedingParent && breedingParent !== "none" ? "Breeding..." : "Generating..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {breedingParent && breedingParent !== "none" ? "Breed Kindred Soul" : "Hatch Kindred Soul"}
                      </>
                    )}
                  </Button>

                  {/* Rarity Test Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground text-center">Rarity Testing</p>
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        onClick={() => handleGenerate('Normal')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Normal
                      </Button>
                      <Button
                        onClick={() => handleGenerate('Rare')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs text-blue-600"
                      >
                        Rare
                      </Button>
                      <Button
                        onClick={() => handleGenerate('Epic')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs text-purple-600"
                      >
                        Epic
                      </Button>
                      <Button
                        onClick={() => handleGenerate('Lord')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs text-violet-600"
                      >
                        Lord
                      </Button>
                      <Button
                        onClick={() => handleGenerate('Mythic')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs text-orange-600"
                      >
                        Mythic
                      </Button>
                      <Button
                        onClick={() => handleGenerate('Constellation')}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                        className="text-xs text-cyan-600"
                      >
                        Constellation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Output Section */}
          <div className="space-y-6 h-full">
            {/* Generated Mon Display - Always visible with placeholder */}
            <Card className={`p-6 h-full flex flex-col ${generatedMon ? 'border-amber/30 bg-amber/5' : 'border-border bg-muted/30'}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className={`w-5 h-5 ${generatedMon ? 'text-amber' : 'text-muted-foreground'}`} />
                {generatedMon ? 'Your Kindred Spirit!' : 'Your Kindred Spirit Preview'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Creature Display */}
                <div className="space-y-3">
                  <div className="aspect-square bg-white rounded-lg border-2 border-border flex items-center justify-center relative overflow-hidden">
                    {generatedMon?.image_url ? (
                      <img
                        src={generatedMon.image_url}
                        alt={generatedMon.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg mx-auto mb-2 opacity-40" />
                        <p className="text-xs text-muted-foreground italic">
                          Your Emotion-mon will appear here
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1.5">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-7 text-xs px-2 bg-amber hover:bg-amber/90"
                      disabled={!generatedMon || generatedMon?.isSaved || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : generatedMon?.isSaved ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Submit
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2" disabled={!generatedMon}>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2" disabled={!generatedMon}>
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Stats & Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className={`text-2xl font-bold mb-1 ${!generatedMon && 'text-muted-foreground'}`}>
                      {generatedMon
                        ? (nickname ? `${nickname} the ${generatedMon.name}` : generatedMon.name)
                        : 'Awaiting Creation...'
                      }
                    </h4>
                    {generatedMon?.title && (
                      <p className="text-sm text-amber italic mb-1">{generatedMon.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mb-2">
                      {generatedMon ? `Born on ${generatedMon.date}` : 'Not yet created'}
                    </p>
                    {generatedMon?.rarity && (
                      <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${
                        generatedMon.rarity === 'Normal' ? 'bg-gray-200 text-gray-700' :
                        generatedMon.rarity === 'Rare' ? 'bg-blue-200 text-blue-700' :
                        generatedMon.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' :
                        generatedMon.rarity === 'Lord' ? 'bg-violet-200 text-violet-700' :
                        generatedMon.rarity === 'Mythic' ? 'bg-orange-200 text-orange-700' :
                        'bg-cyan-200 text-cyan-700'
                      }`}>
                        {generatedMon.rarity}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Add nickname (optional)"
                        className="h-8 text-xs"
                        disabled={!generatedMon}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Health</span>
                        <span className="text-xs text-muted-foreground">
                          {generatedMon ? `${generatedMon.stats.health}%` : '—'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${generatedMon ? 'bg-destructive' : 'bg-muted-foreground/20'}`}
                          style={{ width: generatedMon ? `${generatedMon.stats.health}%` : '0%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Mood</span>
                        <span className="text-xs text-muted-foreground">
                          {generatedMon ? `${generatedMon.stats.mood}%` : '—'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${generatedMon ? 'bg-blue-500' : 'bg-muted-foreground/20'}`}
                          style={{ width: generatedMon ? `${generatedMon.stats.mood}%` : '0%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Energy</span>
                        <span className="text-xs text-muted-foreground">
                          {generatedMon ? `${generatedMon.stats.energy}%` : '—'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${generatedMon ? 'bg-yellow-500' : 'bg-muted-foreground/20'}`}
                          style={{ width: generatedMon ? `${generatedMon.stats.energy}%` : '0%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Faith</span>
                        <span className="text-xs text-muted-foreground">
                          {generatedMon ? `${generatedMon.stats.faith}%` : '—'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${generatedMon ? 'bg-green-500' : 'bg-muted-foreground/20'}`}
                          style={{ width: generatedMon ? `${generatedMon.stats.faith}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {generatedMon?.description && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground italic">
                        "{generatedMon.description}"
                      </p>
                    </div>
                  )}

                  {/* Primary Trait Badge */}
                  {generatedMon?.primaryTrait && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber/10 border border-amber/20 rounded-full">
                      <Sparkles className="w-3 h-3 text-amber" />
                      <span className="text-xs font-mono text-amber">{generatedMon.primaryTrait} Type</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Prompt Display */}
              {generatedMon?.prompt && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      className="flex items-center gap-2 text-sm font-semibold hover:text-sage transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-sage" />
                      AI Generation Prompt
                      <ChevronDown className={`w-4 h-4 transition-transform ${showPrompt ? 'rotate-180' : ''}`} />
                    </button>
                    {showPrompt && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPrompt}
                        className="text-xs"
                      >
                        {copiedPrompt ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {showPrompt && (
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                        {generatedMon.prompt}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - My Kindreds */}
          <div className="space-y-6">
            <Card className="p-5 border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-dusk" />
                My Kindreds
              </h3>
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to see your collection
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : myMons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  You haven't created any Emotion-mons yet. Generate your first one!
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {displayedMons.map((mon) => (
                    <div
                      key={mon.id}
                      onClick={() => handleMonClick({
                        ...mon,
                        stats: { health: mon.health, mood: mon.mood, energy: mon.energy, faith: mon.faith },
                        color: mon.color_class,
                        date: new Date(mon.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      })}
                      className="p-3 bg-card border border-border rounded-lg hover:border-dusk/30 transition-all cursor-pointer group"
                    >
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1 break-words">{mon.nickname || mon.name}</h4>
                          {mon.rarity && (
                            <div className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                              mon.rarity === 'Normal' ? 'bg-gray-200 text-gray-700' :
                              mon.rarity === 'Rare' ? 'bg-blue-200 text-blue-700' :
                              mon.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' :
                              mon.rarity === 'Lord' ? 'bg-violet-200 text-violet-700' :
                              mon.rarity === 'Mythic' ? 'bg-orange-200 text-orange-700' :
                              'bg-cyan-200 text-cyan-700'
                            }`}>
                              {mon.rarity}
                            </div>
                          )}
                          {mon.title && (
                            <p className="text-[10px] text-amber italic mb-0.5">{mon.title}</p>
                          )}
                          <p className="text-xs text-muted-foreground font-mono mb-1.5">
                            {new Date(mon.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {/* Health */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < Math.floor(mon.health / 20) ? "bg-destructive" : "bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            {/* Mood */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < Math.floor(mon.mood / 20) ? "bg-blue-500" : "bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            {/* Energy */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < Math.floor(mon.energy / 20) ? "bg-yellow-500" : "bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            {/* Faith */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < Math.floor(mon.faith / 20) ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {mon.image_url ? (
                          <img
                            src={mon.image_url}
                            alt={mon.name}
                            className="w-32 h-32 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform object-contain"
                          />
                        ) : (
                          <div className={`w-32 h-32 bg-gradient-to-br ${mon.color_class} rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform`} />
                        )}
                      </div>
                    </div>
                  ))}
                  </div>

                  {/* Load More Button */}
                  {hasMoreMons && (
                    <div className="pt-3 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadMore}
                        className="w-full"
                      >
                        Load More ({myMons.length - displayLimit} remaining)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mon Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedMon?.name}
            </DialogTitle>
            {selectedMon?.title && (
              <p className="text-sm text-amber italic">{selectedMon.title}</p>
            )}
          </DialogHeader>

          {selectedMon && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mon Display */}
              <div className="space-y-3">
                <div className="aspect-square bg-white rounded-lg border-2 border-border flex items-center justify-center">
                  {selectedMon.image_url ? (
                    <img
                      src={selectedMon.image_url}
                      alt={selectedMon.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedMon.color} rounded-lg`} />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Mon Details */}
              <div className="space-y-4">
                <div>
                  {selectedMon.rarity && (
                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${
                      selectedMon.rarity === 'Normal' ? 'bg-gray-200 text-gray-700' :
                      selectedMon.rarity === 'Rare' ? 'bg-blue-200 text-blue-700' :
                      selectedMon.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' :
                      selectedMon.rarity === 'Lord' ? 'bg-violet-200 text-violet-700' :
                      selectedMon.rarity === 'Mythic' ? 'bg-orange-200 text-orange-700' :
                      'bg-cyan-200 text-cyan-700'
                    }`}>
                      {selectedMon.rarity}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-mono mb-1">
                    Born on {selectedMon.date}
                  </p>
                  {selectedMon.creator && (
                    <p className="text-xs text-muted-foreground">
                      by {selectedMon.creator}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Health</span>
                      <span className="text-xs text-muted-foreground">{selectedMon.stats.health}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive rounded-full"
                        style={{ width: `${selectedMon.stats.health}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Mood</span>
                      <span className="text-xs text-muted-foreground">{selectedMon.stats.mood}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedMon.stats.mood}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Energy</span>
                      <span className="text-xs text-muted-foreground">{selectedMon.stats.energy}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${selectedMon.stats.energy}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Faith</span>
                      <span className="text-xs text-muted-foreground">{selectedMon.stats.faith}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${selectedMon.stats.faith}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    This Emotion-mon was generated based on the emotional state at the time of creation.
                  </p>
                </div>

                {/* Delete Button - Only show if user owns the mon */}
                {user && selectedMon.user_id === user.id && (
                  <div className="pt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(selectedMon.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Emotion-mon
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Kindred Selector Modal */}
      <Dialog open={showKindredSelector} onOpenChange={setShowKindredSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Select Kindred for Slot {selectedSlotIndex !== null ? selectedSlotIndex + 1 : ''}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose from all Kindreds created by any user
            </p>
          </DialogHeader>

          {allMons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No Kindreds have been created yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {allMons.map((mon) => (
                <div
                  key={mon.id}
                  onClick={() => handleSelectKindredForSlot(mon.id)}
                  className="p-3 bg-card border border-border rounded-lg hover:border-sage/50 transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-white rounded-lg border border-border flex items-center justify-center mb-2 overflow-hidden">
                    {mon.image_url ? (
                      <img
                        src={mon.image_url}
                        alt={mon.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${mon.color_class}`} />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold mb-1 truncate">{mon.nickname || mon.name}</h4>
                  {mon.rarity && (
                    <div className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                      mon.rarity === 'Normal' ? 'bg-gray-200 text-gray-700' :
                      mon.rarity === 'Rare' ? 'bg-blue-200 text-blue-700' :
                      mon.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' :
                      mon.rarity === 'Lord' ? 'bg-violet-200 text-violet-700' :
                      mon.rarity === 'Mythic' ? 'bg-orange-200 text-orange-700' :
                      'bg-cyan-200 text-cyan-700'
                    }`}>
                      {mon.rarity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Kindred;
