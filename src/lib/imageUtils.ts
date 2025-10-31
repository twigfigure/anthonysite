/**
 * Splits a combined hunter image (portrait on left, splash art on right) into two separate images
 * @param base64Image - The combined base64 image
 * @returns Object with avatar and splashArt base64 strings
 */
export async function splitHunterImage(base64Image: string): Promise<{
  avatar: string;
  splashArt: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const width = img.width;
      const height = img.height;

      // Split point: exactly 50/50 down the middle
      const splitPoint = Math.floor(width / 2);

      // Extract avatar (left 50%)
      const avatarCanvas = document.createElement('canvas');
      avatarCanvas.width = splitPoint;
      avatarCanvas.height = height;
      const avatarCtx = avatarCanvas.getContext('2d');
      if (!avatarCtx) {
        reject(new Error('Could not get avatar canvas context'));
        return;
      }
      // Draw left half of the image (from 0 to splitPoint)
      avatarCtx.drawImage(img, 0, 0, splitPoint, height, 0, 0, splitPoint, height);
      const avatarBase64 = avatarCanvas.toDataURL('image/png');

      // Extract splash art (right 50%)
      const splashWidth = width - splitPoint;
      const splashCanvas = document.createElement('canvas');
      splashCanvas.width = splashWidth;
      splashCanvas.height = height;
      const splashCtx = splashCanvas.getContext('2d');
      if (!splashCtx) {
        reject(new Error('Could not get splash canvas context'));
        return;
      }
      // Draw right half of the image (from splitPoint to end)
      splashCtx.drawImage(img, splitPoint, 0, splashWidth, height, 0, 0, splashWidth, height);
      const splashBase64 = splashCanvas.toDataURL('image/png');

      resolve({
        avatar: avatarBase64,
        splashArt: splashBase64,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for splitting'));
    };

    img.src = base64Image;
  });
}

/**
 * Crops splash art to tight character bounds with minimal padding
 * This allows CSS to handle final scaling more effectively
 * @param imageDataUrl - The image to crop
 * @returns Tightly cropped image as data URL
 */
export async function standardizeImageSize(imageDataUrl: string): Promise<string> {
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
        // For full-body images, crop to upper 55% (focus on head and shoulders)
        const upperBodyHeight = contentHeight * 0.55;
        finalMaxY = Math.floor(minY + upperBodyHeight);
      } else {
        // For portrait images, crop to upper 65% to show face prominently
        const portraitHeight = contentHeight * 0.65;
        finalMaxY = Math.floor(minY + portraitHeight);
      }

      // Safety check: ensure we have at least some minimum height
      const minAcceptableHeight = 50; // Minimum 50px height
      if (finalMaxY - finalMinY < minAcceptableHeight) {
        // If crop would be too small, use more of the original
        finalMaxY = Math.min(maxY, finalMinY + Math.floor(contentHeight * 0.70));
      }

      // For portrait framing focused on face (3% above for very tight headroom, 5% sides, 12% below for shoulders)
      const adjustedHeight = finalMaxY - finalMinY + 1;
      const topPadding = adjustedHeight * 0.03;
      const sidePadding = contentWidth * 0.05;
      const bottomPadding = adjustedHeight * 0.12;

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

      // If top 25% has less than 5% content, shift the crop down
      if (topContentPercentage < 0.05 && cropMaxY < img.height - 1) {
        const shiftAmount = Math.floor(initialCropHeight * 0.20); // Shift down by 20%
        cropMinY = Math.min(img.height - initialCropHeight, cropMinY + shiftAmount);
        cropMaxY = Math.min(img.height - 1, cropMinY + initialCropHeight);
      }

      const cropWidth = cropMaxX - cropMinX + 1;
      const cropHeight = cropMaxY - cropMinY + 1;

      // Create output canvas
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw cropped image
      ctx.drawImage(
        img,
        cropMinX, cropMinY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      // Convert to data URL and upscale to standard dimensions
      const croppedDataUrl = canvas.toDataURL('image/png');

      // Upscale to 1024x1024 (1:1 aspect ratio, moderate upscaling for sharp portraits)
      upscaleToTarget(croppedDataUrl, 1024, 1024).then(resolve).catch(reject);
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
