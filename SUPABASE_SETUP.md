# Supabase Setup Instructions

## Step 1: Create Database Schema

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/sql
2. Copy the entire contents of `SUPABASE_SCHEMA.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" - this is normal!

## Step 2: Enable Google OAuth (Optional)

If you want to enable "Sign in with Google":

1. Go to Authentication settings: https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/auth/providers
2. Find "Google" in the providers list
3. Click "Enable"
4. You'll need to create a Google OAuth app:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://yhdupznwngzzharprxyp.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - Paste them into Supabase Google provider settings
5. Save

**OR skip this step** and just use email/password authentication!

## Step 3: Enable Email Authentication

Email/password authentication should already be enabled by default, but verify:

1. Go to Authentication settings: https://supabase.com/dashboard/project/yhdupznwngzzharprxyp/auth/providers
2. Make sure "Email" provider is enabled
3. Optional: Disable email confirmation for testing:
   - Go to Authentication > Settings
   - Find "Enable email confirmations"
   - Toggle OFF for easier testing (you can re-enable later)

## Step 4: Test Your Setup

1. The dev server should auto-restart after installing Supabase
2. Visit: http://localhost:8081/kindred
3. Try signing up with an email and password
4. Check if you can generate Kindreds!

## Troubleshooting

### "Auth session missing!"
- Make sure you ran the SQL schema
- Check that authentication is enabled in Supabase

### "Row Level Security policy violation"
- The SQL schema includes RLS policies
- Make sure you ran the entire schema file
- Public viewing is enabled, but only authenticated users can insert

### Google OAuth not working
- Make sure redirect URI is exactly: `https://yhdupznwngzzharprxyp.supabase.co/auth/v1/callback`
- OAuth consent screen must be configured
- Make sure Client ID and Secret are correct
