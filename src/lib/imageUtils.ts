/**
 * Extracts avatar from splash art by cropping the head/upper body area
 * @param splashArtImage - The full splash art base64 image
 * @returns Avatar image cropped from splash art
 */
export async function extractAvatarFromSplash(splashArtImage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Simply pass through to processAvatarImage which will detect and crop the head
      resolve(splashArtImage);
    };

    img.onerror = () => {
      reject(new Error('Failed to load splash art for avatar extraction'));
    };

    img.src = splashArtImage;
  });
}

/**
 * Legacy function for backward compatibility - now just returns the same image for both
 * @deprecated Use extractAvatarFromSplash and use splash art directly instead
 */
export async function splitHunterImage(base64Image: string): Promise<{
  avatar: string;
  splashArt: string;
}> {
  return {
    avatar: base64Image,
    splashArt: base64Image,
  };
}

/**
 * Returns splash art as-is without cropping
 * The full image is used for splash art display
 * @param imageDataUrl - The image to return
 * @returns The same image as data URL
 */
export async function standardizeImageSize(imageDataUrl: string): Promise<string> {
  // Simply return the image as-is - we want the full splash art
  return imageDataUrl;
}

/**
 * Legacy cropping function - kept for reference but no longer used
 * @deprecated No longer crops, just returns the image
 */
async function legacyStandardizeImageSize(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (!tempCtx) {
        resolve(imageDataUrl);
        return;
      }

      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Find bounding box of non-transparent pixels (character bounds)
      let minX = img.width;
      let minY = img.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const a = data[i + 3]; // Alpha channel

          // Check if pixel is not transparent
          if (a > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If no content found, return original
      if (minX >= maxX || minY >= maxY) {
        resolve(imageDataUrl);
        return;
      }

      // Calculate content dimensions
      const contentWidth = maxX - minX + 1;
      const contentHeight = maxY - minY + 1;

      // Add minimal padding (1% of content size) - just enough to prevent cutoff
      const paddingAmount = Math.max(contentWidth, contentHeight) * 0.01;

      const cropMinX = Math.max(0, Math.floor(minX - paddingAmount));
      const cropMinY = Math.max(0, Math.floor(minY - paddingAmount));
      const cropMaxX = Math.min(img.width - 1, Math.ceil(maxX + paddingAmount));
      const cropMaxY = Math.min(img.height - 1, Math.ceil(maxY + paddingAmount));

      let cropWidth = cropMaxX - cropMinX + 1;
      const cropHeight = cropMaxY - cropMinY + 1;

      // Force consistent narrow aspect ratio (1:2) for all splash art
      // This ensures all characters fill the height container, with width overflow
      const targetAspectRatio = 1 / 2; // width:height

      const targetWidth = cropHeight * targetAspectRatio;

      if (cropWidth > targetWidth) {
        // Character is wider than target, aggressively crop from sides
        cropWidth = targetWidth;
      }
      // If character is narrower than target, keep original width to avoid padding

      // Create portrait-aspect canvas
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(cropWidth);
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // Center character horizontally if we're cropping width
      const drawX = cropWidth < (cropMaxX - cropMinX + 1) ?
        (cropMinX + cropMaxX) / 2 - cropWidth / 2 : cropMinX;

      // Draw cropped character
      ctx.drawImage(
        img,
        drawX, cropMinY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Convert to data URL and upscale to standard dimensions
      const croppedDataUrl = canvas.toDataURL('image/png');

      // Upscale to 1024x2048 (1:2 aspect ratio, moderate upscaling for sharp quality)
      // Since we already enforce 1:2 ratio during cropping, stretch to fill
      upscaleToTarget(croppedDataUrl, 1024, 2048, false).then(resolve).catch(reject);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageDataUrl;
  });
}

/**
 * Processes avatar image with proper portrait framing
 * Ensures head is centered with appropriate headroom
 * Automatically crops to upper body (top 60%) for full-body images
 * @param imageDataUrl - The avatar image to process
 * @returns Processed avatar as data URL
 */
export async function processAvatarImage(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // Draw image to temp canvas for analysis
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (!tempCtx) {
        resolve(imageDataUrl);
        return;
      }

      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Find bounding box of non-transparent pixels
      let minX = img.width;
      let minY = img.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const a = data[i + 3];

          if (a > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If no content found, return original
      if (minX >= maxX || minY >= maxY) {
        resolve(imageDataUrl);
        return;
      }

      const contentWidth = maxX - minX + 1;
      const contentHeight = maxY - minY + 1;

      // Check aspect ratio to determine if it's a full-body or portrait image
      const aspectRatio = contentHeight / contentWidth;
      const isFullBody = aspectRatio > 1.5; // Tall aspect ratio = likely full body

      const finalMinY = minY;
      let finalMaxY;

      if (isFullBody) {
        // For full-body images, crop to upper 25% (very tight focus on head/face only)
        const upperBodyHeight = contentHeight * 0.25;
        finalMaxY = Math.floor(minY + upperBodyHeight);
      } else {
        // For portrait images, crop to upper 35% to show face prominently
        const portraitHeight = contentHeight * 0.35;
        finalMaxY = Math.floor(minY + portraitHeight);
      }

      // Safety check: ensure we have at least some minimum height
      const minAcceptableHeight = 50; // Minimum 50px height
      if (finalMaxY - finalMinY < minAcceptableHeight) {
        // If crop would be too small, use more of the original
        finalMaxY = Math.min(maxY, finalMinY + Math.floor(contentHeight * 0.70));
      }

      // For portrait framing focused on face (20% above for headroom to capture hair/helmets, 8% sides, 25% below for shoulders/chest)
      const adjustedHeight = finalMaxY - finalMinY + 1;
      const topPadding = adjustedHeight * 0.20;
      const sidePadding = contentWidth * 0.08;
      const bottomPadding = adjustedHeight * 0.25;

      // Calculate initial crop area with padding
      const cropMinX = Math.max(0, minX - sidePadding);
      const cropMaxX = Math.min(img.width - 1, maxX + sidePadding);
      let cropMinY = Math.max(0, finalMinY - topPadding);
      let cropMaxY = Math.min(img.height - 1, finalMaxY + bottomPadding);

      // Smart vertical centering: detect if there's excessive empty space above the character
      // Check the top 25% of the cropped area for substantial content
      const initialCropHeight = cropMaxY - cropMinY + 1;
      const topCheckHeight = Math.floor(initialCropHeight * 0.25);
      const checkWidth = Math.floor(cropMaxX - cropMinX + 1);

      // Count pixels with content in top area
      let topContentPixels = 0;
      const totalCheckPixels = topCheckHeight * checkWidth;

      for (let y = Math.floor(cropMinY); y < Math.floor(cropMinY + topCheckHeight); y++) {
        for (let x = Math.floor(cropMinX); x < Math.floor(cropMaxX); x++) {
          if (y >= 0 && y < img.height && x >= 0 && x < img.width) {
            const i = (y * img.width + x) * 4;
            const a = data[i + 3];
            if (a > 10) {
              topContentPixels++;
            }
          }
        }
      }

      // Calculate percentage of content in top area
      const topContentPercentage = topContentPixels / totalCheckPixels;

      // If top 25% has less than 3% content, shift the crop down slightly
      if (topContentPercentage < 0.03 && cropMaxY < img.height - 1) {
        const shiftAmount = Math.floor(initialCropHeight * 0.10); // Shift down by 10%
        cropMinY = Math.min(img.height - initialCropHeight, cropMinY + shiftAmount);
        cropMaxY = Math.min(img.height - 1, cropMinY + initialCropHeight);
      }

      let cropWidth = cropMaxX - cropMinX + 1;
      let cropHeight = cropMaxY - cropMinY + 1;

      // Apply 1.35x zoom by cropping a smaller area (1/1.35 = ~0.74 of original)
      const zoomFactor = 1.35;
      const zoomedWidth = cropWidth / zoomFactor;
      const zoomedHeight = cropHeight / zoomFactor;

      // Center the zoomed crop area
      const centerX = (cropMinX + cropMaxX) / 2;
      const centerY = (cropMinY + cropMaxY) / 2;

      const zoomedMinX = Math.max(0, Math.floor(centerX - zoomedWidth / 2));
      const zoomedMaxX = Math.min(img.width - 1, Math.floor(centerX + zoomedWidth / 2));
      const zoomedMinY = Math.max(0, Math.floor(centerY - zoomedHeight / 2));
      const zoomedMaxY = Math.min(img.height - 1, Math.floor(centerY + zoomedHeight / 2));

      const finalCropWidth = zoomedMaxX - zoomedMinX + 1;
      const finalCropHeight = zoomedMaxY - zoomedMinY + 1;

      // Create output canvas with zoomed crop dimensions
      canvas.width = finalCropWidth;
      canvas.height = finalCropHeight;

      // Draw zoomed crop
      ctx.drawImage(
        img,
        zoomedMinX, zoomedMinY, finalCropWidth, finalCropHeight,
        0, 0, finalCropWidth, finalCropHeight
      );

      // Return the cropped and zoomed image - let CSS handle the display
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load avatar image'));
    };

    img.src = imageDataUrl;
  });
}

/**
 * Upscales an image to target dimensions using high-quality bilinear interpolation
 * Preserves aspect ratio by fitting the image within target dimensions and centering
 * @param imageDataUrl - The image to upscale
 * @param targetWidth - Target width in pixels
 * @param targetHeight - Target height in pixels
 * @param maintainAspectRatio - If true, preserve aspect ratio with transparent padding
 * @returns Upscaled image as data URL
 */
async function upscaleToTarget(
  imageDataUrl: string,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (maintainAspectRatio) {
        // Calculate scale to fit within target dimensions
        const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (targetWidth - scaledWidth) / 2;
        const y = (targetHeight - scaledHeight) / 2;

        // Draw scaled and centered image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      } else {
        // Stretch to fill target dimensions (old behavior)
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for upscaling'));
    };

    img.src = imageDataUrl;
  });
}

/**
 * Crops white space from an image and returns a new cropped data URL
 */
export async function cropWhiteSpace(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageDataUrl); // Return original if canvas not supported
        return;
      }

      // Draw image to canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find bounding box of non-white pixels
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      // White threshold (allowing slight variations)
      const threshold = 250;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Check if pixel is not white (and not transparent)
          if (a > 10 && (r < threshold || g < threshold || b < threshold)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Add small padding
      const padding = 5;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width - 1, maxX + padding);
      maxY = Math.min(canvas.height - 1, maxY + padding);

      // If no non-white pixels found, return original
      if (minX >= maxX || minY >= maxY) {
        resolve(imageDataUrl);
        return;
      }

      // Create cropped canvas
      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');

      if (!croppedCtx) {
        resolve(imageDataUrl);
        return;
      }

      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      // Draw white background
      croppedCtx.fillStyle = 'white';
      croppedCtx.fillRect(0, 0, cropWidth, cropHeight);

      // Draw cropped image
      croppedCtx.drawImage(
        canvas,
        minX, minY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Convert to data URL
      resolve(croppedCanvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageDataUrl;
  });
}
