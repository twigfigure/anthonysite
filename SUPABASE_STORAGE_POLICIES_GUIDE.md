# Supabase Storage Policies - Step-by-Step Guide

## Overview

You need to create 3 policies for the `hunter-images` bucket to allow:
1. **Anyone** to view/download images (public read)
2. **Authenticated users** to upload images
3. **Users** to delete their own images

---

## Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Click **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Fill in:
   - **Name**: `hunter-images`
   - **Public bucket**: Toggle **ON** (this is important!)
   - **File size limit**: Leave default (50 MB is fine)
   - **Allowed MIME types**: Leave empty (allow all)
5. Click **"Create bucket"**

---

## Step 2: Create Policy #1 - Public Read Access

This allows anyone to view the images (so they display on your website).

### Using the Dashboard UI:

1. Click on the `hunter-images` bucket
2. Click the **"Policies"** tab at the top
3. Click **"New Policy"** button
4. Click **"Get started quickly"** or **"Create a policy from scratch"**

### Fill in the form:

**Policy Name:**
```
Public read access
```

**Allowed Operation:**
- ✅ Check **SELECT** only

**Policy Definition:**

Choose **"Custom"** and paste:
```sql
bucket_id = 'hunter-images'
```

**Target roles:**
- Leave as default (or select "public")

5. Click **"Review"**
6. Click **"Save policy"**

### Alternative: Using SQL Editor

If the form is confusing, go to **SQL Editor** and run:

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hunter-images');
```

---

## Step 3: Create Policy #2 - Authenticated Upload

This allows logged-in users to upload images.

### Using the Dashboard UI:

1. Still in the `hunter-images` bucket **Policies** tab
2. Click **"New Policy"** button again
3. Click **"Create a policy from scratch"**

### Fill in the form:

**Policy Name:**
```
Authenticated users can upload
```

**Allowed Operation:**
- ✅ Check **INSERT** only

**Policy Definition:**

Choose **"Custom"** and paste:
```sql
bucket_id = 'hunter-images' AND auth.role() = 'authenticated'
```

**Target roles:**
- Select **"authenticated"** (or leave default)

4. Click **"Review"**
5. Click **"Save policy"**

### Alternative: Using SQL Editor

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hunter-images'
);
```

---

## Step 4: Create Policy #3 - Users Delete Own Images

This allows users to delete only their own uploaded images.

### Using the Dashboard UI:

1. Still in the `hunter-images` bucket **Policies** tab
2. Click **"New Policy"** button again
3. Click **"Create a policy from scratch"**

### Fill in the form:

**Policy Name:**
```
Users can delete own images
```

**Allowed Operation:**
- ✅ Check **DELETE** only

**Policy Definition:**

Choose **"Custom"** and paste:
```sql
bucket_id = 'hunter-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Explanation:** This checks if the authenticated user's ID matches the folder name where the image is stored (remember, images are stored in `{userId}/{filename}.png`).

**Target roles:**
- Select **"authenticated"**

4. Click **"Review"**
5. Click **"Save policy"**

### Alternative: Using SQL Editor

```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hunter-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Summary of Policies

After completing all steps, you should have **3 policies** for the `hunter-images` bucket:

| Policy Name | Allowed Operations | Target Roles | Purpose |
|-------------|-------------------|--------------|---------|
| Public read access | SELECT | public | Anyone can view images |
| Authenticated users can upload | INSERT | authenticated | Logged-in users can upload |
| Users can delete own images | DELETE | authenticated | Users can delete their own images only |

---

## Verification

### Test #1: Public Read Access

1. Upload a test image via your app (recruit a hunter)
2. Copy the image URL from the database
3. Open the URL in an **incognito/private browser window** (not logged in)
4. ✅ Image should display

### Test #2: Authenticated Upload

1. Log in to your website
2. Try to recruit a hunter
3. ✅ Images should upload successfully

### Test #3: Delete Own Images

1. Log in as User A
2. Upload an image (recruit a hunter)
3. Try to delete the image
4. ✅ Should succeed
5. Log in as User B
6. Try to delete User A's image
7. ✅ Should fail (403 Forbidden)

---

## Troubleshooting

### "403 Forbidden" when viewing images

**Problem:** Public read policy not working

**Solution:**
- Make sure the bucket is set to **Public** (check bucket settings)
- Verify the SELECT policy exists and has `TO public`
- Run this SQL to check:
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'hunter-images';
```

### "403 Forbidden" when uploading images

**Problem:** Upload policy not working

**Solution:**
- Make sure you're logged in (check `auth.user()` in console)
- Verify the INSERT policy exists
- Check the policy definition matches exactly

### Images upload but don't display

**Problem:** URLs are correct but images don't load

**Solution:**
- Check browser console for CORS errors
- Verify bucket is **Public**
- Check image URLs are correct (should be `https://[project].supabase.co/storage/v1/object/public/hunter-images/...`)

### Can't delete any images

**Problem:** Delete policy too restrictive or not working

**Solution:**
- Verify the DELETE policy exists
- Check that folder structure matches: `{userId}/{filename}.png`
- Test with this SQL:
```sql
SELECT name, (storage.foldername(name))[1] as folder_name
FROM storage.objects
WHERE bucket_id = 'hunter-images';
```

---

## Quick SQL Script (Run All at Once)

If you prefer to set up all policies at once via SQL Editor:

```sql
-- Policy 1: Public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hunter-images');

-- Policy 2: Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hunter-images');

-- Policy 3: Users delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hunter-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

Copy all of the above, paste into **SQL Editor**, and click **Run**.

---

## Policy Operations Reference

For future reference, here are all the available operations:

- **SELECT** - Read/view files (download, display images)
- **INSERT** - Upload new files
- **UPDATE** - Modify existing files (rarely used for images)
- **DELETE** - Remove files

---

## Security Notes

### Why these policies are safe:

1. **Public read** is safe because:
   - Images are meant to be displayed publicly on your website
   - No sensitive data in the images (they're AI-generated art)
   - Read-only access (can't modify or delete)

2. **Authenticated upload** is safe because:
   - Only logged-in users can upload
   - Prevents spam from anonymous users
   - Each user uploads to their own folder

3. **Delete own images** is safe because:
   - Users can only delete from their own folder (`{userId}/...`)
   - Can't delete other users' images
   - Prevents accidental or malicious deletion

### Optional: Add file size limits

If you want to prevent abuse, add this to the INSERT policy:

```sql
bucket_id = 'hunter-images'
AND auth.role() = 'authenticated'
AND octet_length(decode(storage.extension(name), 'base64')) < 5242880
```

This limits uploads to 5MB per file.

---

## Screenshots Guide (If Needed)

### Where to find Policies tab:

1. Supabase Dashboard
2. Storage (left sidebar)
3. Click on `hunter-images` bucket
4. **"Policies"** tab (next to "Files" tab at the top)

### What "Allowed Operations" looks like:

You'll see checkboxes for:
- ☐ SELECT
- ☐ INSERT
- ☐ UPDATE
- ☐ DELETE

Check the appropriate boxes for each policy as described above.

---

## Complete! 🎉

Once all 3 policies are created, your image generation system will work perfectly. Users can:
- ✅ Upload hunter images when recruiting
- ✅ View images in the roster and detail views
- ✅ Delete their own images (if you add delete functionality later)

If you run into any issues, check the Troubleshooting section above or send me the error message!
