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
