import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { uploadImageToStorage, isBase64Image } from "@/lib/supabaseStorage";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface MigrationResult {
  monId: string;
  monName: string;
  status: 'pending' | 'migrating' | 'success' | 'error';
  error?: string;
}

const MigrateImages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const migrateAllImages = async () => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please sign in to migrate your images",
        variant: "destructive",
      });
      return;
    }

    setMigrating(true);
    setCompleted(false);

    try {
      // Fetch all user's mons
      const { data: mons, error: fetchError } = await supabase
        .from('emotion_mons')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (!mons || mons.length === 0) {
        toast({
          title: "No Mons Found",
          description: "You don't have any Emotion-mons to migrate",
        });
        setMigrating(false);
        return;
      }

      // Filter only base64 images
      const base64Mons = mons.filter(mon => isBase64Image(mon.image_url));

      if (base64Mons.length === 0) {
        toast({
          title: "All Images Already Migrated!",
          description: "All your images are already using Supabase Storage",
        });
        setMigrating(false);
        return;
      }

      // Initialize results
      const initialResults: MigrationResult[] = base64Mons.map(mon => ({
        monId: mon.id,
        monName: mon.nickname || mon.name,
        status: 'pending'
      }));
      setResults(initialResults);

      toast({
        title: "Migration Started",
        description: `Migrating ${base64Mons.length} images to Supabase Storage...`,
      });

      // Migrate each mon
      for (let i = 0; i < base64Mons.length; i++) {
        const mon = base64Mons[i];

        // Update status to migrating
        setResults(prev => prev.map(r =>
          r.monId === mon.id ? { ...r, status: 'migrating' } : r
        ));

        try {
          // Upload base64 image to storage
          const storageUrl = await uploadImageToStorage(mon.image_url, user.id);

          // Update database with new URL
          const { error: updateError } = await supabase
            .from('emotion_mons')
            .update({ image_url: storageUrl })
            .eq('id', mon.id)
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          // Mark as success
          setResults(prev => prev.map(r =>
            r.monId === mon.id ? { ...r, status: 'success' } : r
          ));

        } catch (error) {
          console.error(`Failed to migrate mon ${mon.id}:`, error);

          // Mark as error
          setResults(prev => prev.map(r =>
            r.monId === mon.id
              ? { ...r, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
              : r
          ));
        }

        // Small delay to avoid rate limiting
        if (i < base64Mons.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      setCompleted(true);

      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      toast({
        title: "Migration Complete!",
        description: `Successfully migrated ${successCount} images. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
      });

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to="/kindred" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Kindred
          </Link>
          <h1 className="text-3xl font-bold mt-4">Image Migration Tool</h1>
          <p className="text-muted-foreground mt-2">
            Migrate your existing base64 images to Supabase Storage for better performance
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Why Migrate?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Faster loading:</strong> Images load from CDN instead of database</li>
                <li>• <strong>Smaller database:</strong> Each mon becomes 3000x smaller (300KB → 100 bytes)</li>
                <li>• <strong>Better caching:</strong> Browser caches images for instant repeat loads</li>
                <li>• <strong>Reduced costs:</strong> Less database storage and bandwidth usage</li>
              </ul>
              <p className="text-sm text-blue-800 mt-3">
                <strong>Note:</strong> This is a one-time migration. New mons automatically use Supabase Storage.
              </p>
            </div>
          </div>
        </Card>

        {/* Migration Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Migration Status</h2>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please sign in to migrate your images</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Click the button below to start migrating your images to Supabase Storage
              </p>
              <Button
                onClick={migrateAllImages}
                disabled={migrating}
                size="lg"
              >
                {migrating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking images...
                  </>
                ) : (
                  'Start Migration'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.monId}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {result.status === 'pending' && (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      {result.status === 'migrating' && (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {result.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {result.status === 'error' && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{result.monName}</p>
                        {result.error && (
                          <p className="text-xs text-red-600">{result.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {result.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {completed && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Migration Complete!</p>
                      <p className="text-sm text-muted-foreground">
                        {results.filter(r => r.status === 'success').length} succeeded,{' '}
                        {results.filter(r => r.status === 'error').length} failed
                      </p>
                    </div>
                    <Link to="/kindred">
                      <Button>Go to Kindred</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MigrateImages;
