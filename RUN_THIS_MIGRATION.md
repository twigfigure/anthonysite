# 🚨 IMPORTANT: Run This Migration Now

Your Kindred page isn't loading because the database is missing the `rarity` and `title` columns.

## Steps to Fix:

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/sql

2. **Copy and paste this SQL:**

```sql
-- Add rarity column
ALTER TABLE public.emotion_mons
ADD COLUMN IF NOT EXISTS rarity TEXT;

-- Add title column
ALTER TABLE public.emotion_mons
ADD COLUMN IF NOT EXISTS title TEXT;

-- Set a default rarity for existing kindreds
UPDATE public.emotion_mons
SET rarity = 'Normal'
WHERE rarity IS NULL;
```

3. **Click "Run"**

4. **Refresh your Kindred page** - your kindreds should now load!

---

That's it! This will add the missing columns and your page will work correctly.
