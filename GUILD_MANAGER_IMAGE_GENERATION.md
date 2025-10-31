# Guild Manager - Image Generation Setup Guide

## Overview

Your Guild Manager now has Gemini AI image generation integrated! When you recruit a new hunter, two unique AI-generated images will be created:

1. **Avatar** - Portrait-style character image (for roster display)
2. **Splash Art** - Full-body epic illustration (for detail view)

Both images are generated with **transparent backgrounds** and stored in Supabase Storage.

---

## Setup Steps

### 1. Run Database Migration

You need to add the new image columns to your `hunters` table.

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `/supabase/migrations/20241030000001_add_hunter_images.sql`
4. Paste into the SQL Editor
5. Click **Run**

**Option B: Using Supabase CLI**

```bash
supabase db push
```

The migration adds two new columns to the `hunters` table:
- `avatar_url` (TEXT) - URL to the portrait image
- `splash_art_url` (TEXT) - URL to the splash art image

### 2. Create Supabase Storage Bucket

You need to create a storage bucket called `hunter-images` to store the generated images.

**Using Supabase Dashboard:**

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name: `hunter-images`
4. **Public bucket**: YES (so images can be displayed)
5. Click **Create bucket**

**Set Storage Policies (Important!):**

After creating the bucket, you need to add policies:

1. Click on the `hunter-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hunter-images');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hunter-images'
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Users can delete their own images**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hunter-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Verify Environment Variables

Make sure your `.env` file has the Gemini API key (already set up from Kindred project):

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## How It Works

### Image Generation Flow

When you recruit a new hunter:

1. **User fills in hunter details** (name, rank, class)
2. **Click "Recruit Hunter"** button
3. **System generates prompts** based on hunter attributes
4. **Gemini AI creates 2 images in parallel:**
   - Avatar (portrait, chest-up)
   - Splash Art (full-body, epic pose)
5. **Images are cropped** to remove excess whitespace
6. **Images uploaded to Supabase Storage** (`hunter-images` bucket)
7. **Hunter created in database** with image URLs
8. **Images displayed** in roster and detail views

**Estimated Time:** 10-20 seconds per recruitment

### Prompt Generation Logic

The prompts are intelligently generated based on:

- **Rank** (F to SSS) → Determines visual quality, effects, and color palette
  - F-rank: Basic gear, muted colors
  - S/SS/SSS-rank: Legendary equipment, glowing effects, divine aura

- **Class** (Fighter, Tank, Mage, etc.) → Determines:
  - Equipment type (armor, robes, weapons)
  - Pose and stance
  - Magical effects

**Example Prompt for an S-Rank Mage:**
```
Create an epic full-body splash art illustration of Aria, a S-rank Mage hunter.

STYLE: Anime/manga splash art, epic action illustration

COMPOSITION:
- Full body character in dynamic action pose
- Casting a powerful spell with magical energy swirling around them
- Transparent background (PNG format)

CHARACTER APPEARANCE:
- Flowing robes or light armor, staff or wand, mystical aura
- Ornate armor with decorative elements, distinguished look
- Color palette: golden yellows, bright oranges, and white

VISUAL EFFECTS:
- Legendary aura with brilliant light effects
- Magical effects matching Mage abilities
- Energy particles surrounding character
...
```

### Cost Estimation

Using Google Gemini 2.5 Flash Image API:

- **Free Tier:** 50 images per day
- **Paid Tier:** ~$0.04 per image

**Per Hunter:**
- 2 images (avatar + splash art)
- **Free tier:** ~25 hunters per day
- **Paid tier:** ~$0.08 per hunter

### File Storage

Images are organized in Supabase Storage:

```
hunter-images/
  {userId}/
    {timestamp}-{random}.png  (avatar)
    {timestamp}-{random}.png  (splash art)
    ...
```

---

## Image Display

### Roster View (HunterList.tsx)

Hunters display their **avatar** in the roster grid:
- Transparent background images
- Fallback to gradient placeholder if no image
- Shows rank, level, and status badges

### Detail View (HunterDetails.tsx)

Selected hunter shows **splash art** in full glory:
- Epic full-body illustration
- Transparent background overlaid on rank-colored gradient
- Character name and stats below

---

## Features

### Intelligent Prompts

- **Rank-based color palettes** (F = grays, SSS = crimson/gold)
- **Class-specific equipment** (Tank = shield, Assassin = daggers)
- **Rank-specific effects** (S+ ranks get glowing aura)
- **Dynamic poses** (Fighter = combat stance, Healer = casting)

### Transparent Backgrounds

All images are generated with transparent backgrounds (PNG format):
- Avatar images overlay cleanly in roster
- Splash art images overlay on gradient backgrounds
- Professional game-quality appearance

### Automatic Cropping

White space is automatically removed:
- Uses canvas-based cropping algorithm
- Preserves image quality
- Adds small padding for aesthetics

---

## Testing

### Test Recruitment

1. Navigate to `/guild-manager`
2. Click **"Recruit"** button
3. Fill in hunter details:
   - Name: Test Hunter
   - Rank: Try different ranks (F, B, S, SSS)
   - Class: Try different classes
4. Click **"Recruit Hunter"**
5. Watch the toast notifications:
   - "Generating hunter images..."
   - "Uploading images..."
   - "Hunter recruited!"
6. See the hunter appear with custom avatar
7. Click on the hunter to see splash art

### Verify Images

**Check Supabase Storage:**
1. Go to Supabase Dashboard → Storage
2. Open `hunter-images` bucket
3. Navigate to your user folder
4. You should see 2 PNG files per hunter

**Check Database:**
```sql
SELECT name, rank, class, avatar_url, splash_art_url
FROM hunters
WHERE guild_id = 'your-guild-id';
```

---

## Troubleshooting

### "Failed to recruit hunter"

**Check Gemini API Key:**
- Verify `VITE_GEMINI_API_KEY` is set in `.env`
- Make sure the key is valid and has quota remaining

**Check Supabase Storage:**
- Verify `hunter-images` bucket exists
- Check storage policies are set correctly

### Images Not Displaying

**Check Image URLs:**
- Make sure URLs are public (bucket is public)
- Verify URLs are correct in database

**Check CORS:**
- Supabase Storage should allow CORS by default
- If issues persist, check browser console for errors

### "Storage upload error"

**Check Authentication:**
- Make sure you're logged in
- Verify user has authenticated access

**Check Bucket Policies:**
- Re-run the policy SQL commands from Step 2

### API Rate Limits

**Free Tier Exceeded:**
- Google Gemini free tier: 50 images/day
- Wait 24 hours or upgrade to paid tier

**Solution:**
- Add error handling to detect rate limits
- Display friendly message to user

---

## File Reference

### New Files Created

1. `/src/features/guild-manager/lib/hunterImagePrompts.ts`
   - Prompt generation functions
   - Rank/class-specific logic

2. `/supabase/migrations/20241030000001_add_hunter_images.sql`
   - Database migration for image columns

### Modified Files

1. `/src/features/guild-manager/types/index.ts`
   - Added `avatar_url` and `splash_art_url` to Hunter interface

2. `/src/features/guild-manager/components/RecruitHunterDialog.tsx`
   - Integrated image generation on recruitment
   - Parallel image generation and upload

3. `/src/features/guild-manager/components/HunterList.tsx`
   - Display avatar images in roster
   - Fallback to gradient placeholder

4. `/src/features/guild-manager/components/HunterDetails.tsx`
   - Display splash art in detail view
   - Fallback to placeholder icon

5. `/src/lib/supabaseStorage.ts`
   - Added `bucketName` parameter for multi-bucket support

### Shared Files (From Kindred)

These files are reused from your Kindred project:

- `/src/lib/bananaService.ts` - Gemini API integration
- `/src/lib/imageUtils.ts` - White space cropping
- `/src/lib/supabaseStorage.ts` - Image upload/storage

---

## Next Steps

### Optional Enhancements

1. **Image Preview During Recruitment**
   - Show generated images before creating hunter
   - Allow regeneration if user doesn't like the art

2. **Multiple Art Styles**
   - Add style selection (anime, realistic, pixel art)
   - Store preferred style in guild settings

3. **Image Regeneration**
   - Add "Regenerate Art" button in hunter details
   - Keep old images or replace

4. **Batch Generation**
   - Generate images for existing hunters without art
   - Background job to process multiple hunters

5. **Image Caching**
   - Cache generated images locally
   - Reduce Supabase bandwidth

---

## Summary

You now have a complete AI image generation system for Guild Manager! Every recruited hunter will have unique, custom-generated artwork with:

✅ Portrait avatar for roster display
✅ Epic splash art for detail view
✅ Transparent backgrounds
✅ Rank and class-specific styling
✅ Automatic cropping and upload
✅ Supabase Storage integration

The system uses the same Gemini API as your Kindred project, so no additional API setup is needed.

**Total setup time:** ~5-10 minutes
**Cost:** FREE for first 25 hunters/day, then ~$0.08 per hunter

Enjoy creating your unique hunter roster! ⚔️🎨
