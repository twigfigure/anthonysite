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
      // For now, we'll just execute direct queries through the client
      // In production, this should be a backend RPC function for safety
      const result = await supabase.from('guilds').select('*').limit(10);

      setQueryResult({
        note: 'Direct query execution not yet implemented. Use Supabase dashboard for SQL queries.',
        sample: result.data
      });

      toast({
        title: 'Query Info',
        description: 'Use Supabase dashboard for direct SQL execution',
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
                placeholder="Enter SQL query...&#10;&#10;Note: For security, direct SQL execution is limited.&#10;Use the Supabase dashboard for unrestricted queries."
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