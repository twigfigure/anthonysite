import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function BackstoryTab() {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackstory();
  }, []);

  async function loadBackstory() {
    try {
      const response = await fetch('/docs/plans/2025-10-31-world-building-kingdoms-regions-design.md');
      if (!response.ok) {
        throw new Error('Failed to load backstory document');
      }
      const text = await response.text();
      setMarkdown(text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Make sure the backstory document exists at: <code>docs/plans/2025-10-31-world-building-kingdoms-regions-design.md</code>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>World Building: Kingdoms & Regions</CardTitle>
          <CardDescription>
            Complete world-building documentation with kingdoms, regions, rulers, and portal lore
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}