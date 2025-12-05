import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import type { ManhuaWithSources, ManhuaStatus, ManhuaSource, CreateSourceInput } from '../types';
import { STATUS_LABELS } from '../types';

interface ManhuaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manhua: ManhuaWithSources | null;
  onSave: (data: {
    title: string;
    cover_image_url: string | null;
    description: string | null;
    status: ManhuaStatus;
    current_chapter: number;
    total_chapters: number | null;
    rating: number | null;
    notes: string | null;
  }) => Promise<void>;
  onAddSource: (input: Omit<CreateSourceInput, 'manhua_id'>) => Promise<void>;
  onUpdateSource: (id: string, data: Partial<ManhuaSource>) => Promise<void>;
  onDeleteSource: (id: string) => Promise<void>;
}

export function ManhuaDialog({
  open,
  onOpenChange,
  manhua,
  onSave,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
}: ManhuaDialogProps) {
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ManhuaStatus>('plan_to_read');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [totalChapters, setTotalChapters] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Source form state
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceChapter, setNewSourceChapter] = useState('');
  const [addingSource, setAddingSource] = useState(false);

  useEffect(() => {
    if (manhua) {
      setTitle(manhua.title);
      setCoverUrl(manhua.cover_image_url || '');
      setDescription(manhua.description || '');
      setStatus(manhua.status);
      setCurrentChapter(manhua.current_chapter);
      setTotalChapters(manhua.total_chapters?.toString() || '');
      setRating(manhua.rating?.toString() || '');
      setNotes(manhua.notes || '');
    } else {
      resetForm();
    }
  }, [manhua, open]);

  const resetForm = () => {
    setTitle('');
    setCoverUrl('');
    setDescription('');
    setStatus('plan_to_read');
    setCurrentChapter(0);
    setTotalChapters('');
    setRating('');
    setNotes('');
    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceChapter('');
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        cover_image_url: coverUrl.trim() || null,
        description: description.trim() || null,
        status,
        current_chapter: currentChapter,
        total_chapters: totalChapters ? parseInt(totalChapters) : null,
        rating: rating ? parseInt(rating) : null,
        notes: notes.trim() || null,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) return;
    setAddingSource(true);
    try {
      await onAddSource({
        website_name: newSourceName.trim(),
        website_url: newSourceUrl.trim(),
        latest_chapter: newSourceChapter ? parseInt(newSourceChapter) : 0,
      });
      setNewSourceName('');
      setNewSourceUrl('');
      setNewSourceChapter('');
    } finally {
      setAddingSource(false);
    }
  };

  const isEditing = manhua !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Manhua' : 'Add Manhua'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sources" disabled={!isEditing}>
              Sources {isEditing && manhua.sources.length > 0 && `(${manhua.sources.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Manhua title"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ManhuaStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rating">Rating (1-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="Rate 1-10"
                />
              </div>

              <div>
                <Label htmlFor="currentChapter">Current Chapter</Label>
                <Input
                  id="currentChapter"
                  type="number"
                  min="0"
                  value={currentChapter}
                  onChange={(e) => setCurrentChapter(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="totalChapters">Total Chapters (optional)</Label>
                <Input
                  id="totalChapters"
                  type="number"
                  min="0"
                  value={totalChapters}
                  onChange={(e) => setTotalChapters(e.target.value)}
                  placeholder="Leave empty if ongoing"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the manhua..."
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Personal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your personal notes..."
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4 mt-4">
            {isEditing && (
              <>
                {/* Existing Sources */}
                {manhua.sources.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Sources</Label>
                    {manhua.sources.map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{source.website_name}</span>
                            <a
                              href={source.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sage hover:text-sage/80"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Chapter {source.latest_chapter}</span>
                            {source.last_updated && (
                              <span>Updated: {new Date(source.last_updated).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={source.latest_chapter}
                          onChange={(e) =>
                            onUpdateSource(source.id, {
                              latest_chapter: parseInt(e.target.value) || 0,
                              last_updated: new Date().toISOString(),
                            })
                          }
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDeleteSource(source.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Source */}
                <div className="border-t pt-4">
                  <Label className="mb-2 block">Add New Source</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Website name"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Ch."
                        value={newSourceChapter}
                        onChange={(e) => setNewSourceChapter(e.target.value)}
                        className="w-20"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleAddSource}
                        disabled={addingSource || !newSourceName.trim() || !newSourceUrl.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Manhua'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
