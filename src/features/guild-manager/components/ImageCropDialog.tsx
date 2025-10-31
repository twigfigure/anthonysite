import { useState, useRef, useEffect, useCallback } from 'react';
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
  imageType?: 'avatar' | 'splash';
}

export function ImageCropDialog({
  open,
  onOpenChange,
  hunter,
  guild,
  onUpdate,
  imageType = 'avatar',
}: ImageCropDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const initialZoomRef = useRef<number>(1);
  const { toast } = useToast();

  const imageUrl = imageType === 'avatar' ? hunter.avatar_url : hunter.splash_art_url;
  const imageLabel = imageType === 'avatar' ? 'Avatar' : 'Splash Art';

  // Canvas size based on image type (both scaled down 35%)
  // Avatar = square, Splash art = tall vertical rectangle
  const canvasWidth = imageType === 'avatar' ? 333 : 250; // 512 * 0.65 ≈ 333, 384 * 0.65 ≈ 250
  const canvasHeight = imageType === 'avatar' ? 333 : 499; // 512 * 0.65 ≈ 333, 768 * 0.65 ≈ 499

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate dimensions
    const scale = zoom;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    // Center and apply offsets
    const x = (canvas.width - drawWidth) / 2 + offsetX;
    const y = (canvas.height - drawHeight) / 2 + offsetY;

    // Draw image
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }, [zoom, offsetX, offsetY, imageLoaded]);

  useEffect(() => {
    if (open && imageUrl) {
      setImageLoaded(false);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        imageRef.current = img;

        // Calculate initial zoom to fit the entire image in the canvas
        const fitZoom = Math.min(
          canvasWidth / img.width,
          canvasHeight / img.height
        );

        // Store initial zoom for reset function
        initialZoomRef.current = fitZoom;

        // Set zoom to fit image and reset offsets
        setZoom(fitZoom);
        setOffsetX(0);
        setOffsetY(0);
        setImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        setImageLoaded(false);
      };
    }
  }, [open, imageUrl, canvasWidth, canvasHeight]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.nativeEvent.offsetX - offsetX,
      y: e.nativeEvent.offsetY - offsetY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const newOffsetX = e.nativeEvent.offsetX - dragStart.x;
    const newOffsetY = e.nativeEvent.offsetY - dragStart.y;

    // Clamp offsets to slider limits
    setOffsetX(Math.max(-256, Math.min(256, newOffsetX)));
    setOffsetY(Math.max(-256, Math.min(256, newOffsetY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setSaving(true);
    try {
      // Save exactly what's shown in the preview canvas (including zoom and position)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      // Upload to storage
      const imageUrl = await uploadImageToStorage(
        blob,
        guild.user_id,
        'hunter-images'
      );

      // Update hunter record
      const updateData = imageType === 'avatar'
        ? { avatar_url: imageUrl }
        : { splash_art_url: imageUrl };

      await hunterService.updateHunter(hunter.id, updateData);

      toast({
        title: `${imageLabel} Updated`,
        description: `Hunter ${imageLabel.toLowerCase()} has been successfully updated.`,
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: `Failed to save ${imageLabel.toLowerCase()}`,
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setZoom(initialZoomRef.current);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop {imageLabel} - {hunter.name}</DialogTitle>
          <DialogDescription>
            {imageType === 'avatar'
              ? "Adjust the zoom and position to center the character's face."
              : "Adjust the zoom and position to frame the character's full body."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Canvas Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="border-4 border-purple-500 rounded-lg cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
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
                min={0.1}
                max={3}
                step={0.05}
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
            {saving ? 'Saving...' : `Save ${imageLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
