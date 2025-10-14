# Supabase Storage Setup for Kindred Images

## Step 1: Create Storage Bucket

1. **Go to Supabase Storage:**
   https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/storage/buckets

2. **Click "New Bucket"**

3. **Configure the bucket:**
   - **Name:** `kindred-images`
   - **Public bucket:** ✅ **YES** (Check this box)
   - **File size limit:** 50 MB (default is fine)
   - **Allowed MIME types:** Leave empty (allows all image types)

4. **Click "Create bucket"**

## Step 2: Set Storage Policies (For Public Access)

The bucket needs to be publicly readable so users can see images without authentication.

1. **Go to the Storage Policies page:**
   https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/storage/policies

2. **Select the `kindred-images` bucket**

3. **Add the following policies:**

### Policy 1: Public Read Access
```sql
-- Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'kindred-images' );
```

### Policy 2: Authenticated Upload
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kindred-images'
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Users Can Delete Their Own Images
```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kindred-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Verify Setup

1. The bucket should appear in your Storage dashboard
2. The policies should show as active
3. You're ready to upload images!

## What This Does

- **Before:** Images stored as base64 in database (~300KB per mon)
- **After:** Images stored in Supabase CDN, only URL in database (~100 bytes per mon)
- **Result:** 3000x smaller database records = much faster queries!

## Next Steps

After completing this setup, the app will:
- Upload new images to Supabase Storage automatically
- Display images from CDN (faster, cached by browser)
- Existing base64 images will continue to work (we'll migrate them later)
