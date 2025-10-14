import { supabase } from './supabase';

const BUCKET_NAME = 'kindred-images';

/**
 * Uploads a base64 image to Supabase Storage
 * @param base64Image - The base64 encoded image string (with or without data:image prefix)
 * @param userId - The user's ID for organizing files
 * @returns The public URL of the uploaded image
 */
export async function uploadImageToStorage(
  base64Image: string,
  userId: string
): Promise<string> {
  try {
    // Remove the data:image/png;base64, prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${userId}/${timestamp}-${randomStr}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to storage:', error);
    throw error;
  }
}

/**
 * Deletes an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/kindred-images/[userId]/[filename]
    const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) {
      console.error('Invalid image URL format:', imageUrl);
      return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw error;
  }
}

/**
 * Checks if an image URL is a base64 string (old format) or a storage URL (new format)
 * @param imageUrl - The image URL to check
 * @returns true if base64, false if storage URL
 */
export function isBase64Image(imageUrl: string): boolean {
  return imageUrl.startsWith('data:image');
}
