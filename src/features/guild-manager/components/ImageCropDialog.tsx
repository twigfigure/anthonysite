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

  // Always load from original if available, otherwise fall back to display URL
  const imageUrl = imageType === 'avatar'
    ? (hunter.original_avatar_url || hunter.avatar_url)
    : (hunter.original_splash_art_url || hunter.splash_art_url);
  const imageLabel = imageType === 'avatar' ? 'Avatar' : 'Splash Art';

  // Canvas size - match display container aspect ratios
  // Avatar = square card
  // Splash art = tall vertical container (roughly 400-500px wide × 600px tall in display)
  const canvasWidth = imageType === 'avatar' ? 400 : 400;
  const canvasHeight = imageType === 'avatar' ? 400 : 600;

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

        // Start with default fit zoom and centered position
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
  }, [open, imageUrl, canvasWidth, canvasHeight, hunter, imageType]);

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
    if (!imageRef.current) return;

    setSaving(true);
    try {
      // Calculate the crop from the ORIGINAL full-resolution image
      const img = imageRef.current;

      // Calculate dimensions
      const scale = zoom;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      // Calculate position in original image coordinates
      const x = (canvasWidth - drawWidth) / 2 + offsetX;
      const y = (canvasHeight - drawHeight) / 2 + offsetY;

      // Calculate what portion of the original image is visible
      const cropX = Math.max(0, -x / scale);
      const cropY = Math.max(0, -y / scale);
      const cropWidth = Math.min(img.width - cropX, canvasWidth / scale);
      const cropHeight = Math.min(img.height - cropY, canvasHeight / scale);

      // Create a new canvas at the DISPLAY size for high quality
      // Avatar = square (1024×1024)
      // Splash art = tall vertical (same aspect as preview: 400:600 = 2:3)
      const displayCanvas = document.createElement('canvas');
      const targetWidth = imageType === 'avatar' ? 1024 : 1024;
      const targetHeight = imageType === 'avatar' ? 1024 : 1536; // 2:3 ratio for splash
      displayCanvas.width = targetWidth;
      displayCanvas.height = targetHeight;
      const displayCtx = displayCanvas.getContext('2d');

      if (!displayCtx) {
        throw new Error('Could not create display canvas context');
      }

      // Draw the cropped portion at full resolution
      displayCtx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, targetWidth, targetHeight
      );

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        displayCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      // Upload cropped image to storage
      const croppedImageUrl = await uploadImageToStorage(
        blob,
        guild.user_id,
        'hunter-images'
      );

      // Update hunter record with cropped image
      // Original URLs stay unchanged - we always crop from the original
      const updateData = imageType === 'avatar'
        ? { avatar_url: croppedImageUrl }
        : { splash_art_url: croppedImageUrl };

      await hunterService.updateHunter(hunter.id, updateData);

      toast({
        title: `${imageLabel} Updated`,
        description: `${imageLabel} has been cropped and saved at full resolution.`,
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
