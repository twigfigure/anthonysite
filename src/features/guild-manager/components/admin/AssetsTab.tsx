import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AssetsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'generate' | 'library'>('templates');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assets Manager</CardTitle>
          <CardDescription>
            Manage image generation prompts, generate images, and browse asset library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Prompt Templates</TabsTrigger>
              <TabsTrigger value="generate">Generate Images</TabsTrigger>
              <TabsTrigger value="library">Asset Library</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Saved Prompt Templates</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
              <p className="text-muted-foreground">No templates created yet.</p>
            </TabsContent>

            <TabsContent value="generate" className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Generate Image</h3>
              <p className="text-muted-foreground">Image generation interface coming soon...</p>
            </TabsContent>

            <TabsContent value="library" className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Asset Library</h3>
              <p className="text-muted-foreground">No assets saved yet.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
