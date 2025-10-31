import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hunterService } from '../lib/supabase';
import { uploadImageToStorage } from '@/lib/supabaseStorage';
import type { Hunter, Guild } from '../types';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hunter: Hunter;
  guild: Guild;
  onUpdate: () => void;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  hunter,
  guild,
  onUpdate,
}: ImageCropDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && hunter.avatar_url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = hunter.avatar_url;
      img.onload = () => {
        imageRef.current = img;
        drawCanvas();
      };
    }
  }, [open, hunter.avatar_url]);

  useEffect(() => {
    drawCanvas();
  }, [zoom, offsetX, offsetY]);

  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const scale = zoom;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    // Center and apply offsets
    const x = (canvas.width - drawWidth) / 2 + offsetX;
    const y = (canvas.height - drawHeight) / 2 + offsetY;

    // Draw image
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setSaving(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      // Upload to storage
      const avatarUrl = await uploadImageToStorage(
        blob,
        guild.user_id,
        'hunter-images'
      );

      // Update hunter record
      await hunterService.updateHunter(hunter.id, {
        avatar_url: avatarUrl,
      });

      toast({
        title: 'Avatar Updated',
        description: 'Hunter avatar has been successfully cropped and saved.',
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to save avatar',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Avatar - {hunter.name}</DialogTitle>
          <DialogDescription>
            Adjust the zoom and position to center the character's face.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Canvas Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className="border-4 border-purple-500 rounded-lg"
              />
              {/* Center guide crosshair */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-px bg-purple-500/30" />
                <div className="absolute w-px h-full bg-purple-500/30" />
                <div className="absolute w-16 h-16 border-2 border-purple-500/50 rounded-full" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Zoom</Label>
                <span className="text-sm text-muted-foreground">{zoom.toFixed(2)}x</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Horizontal Position */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Horizontal Position</Label>
                <span className="text-sm text-muted-foreground">{offsetX}px</span>
              </div>
              <Slider
                value={[offsetX]}
                onValueChange={([value]) => setOffsetX(value)}
                min={-256}
                max={256}
                step={1}
                className="w-full"
              />
            </div>

            {/* Vertical Position */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Vertical Position</Label>
                <span className="text-sm text-muted-foreground">{offsetY}px</span>
              </div>
              <Slider
                value={[offsetY]}
                onValueChange={([value]) => setOffsetY(value)}
                min={-256}
                max={256}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Avatar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
