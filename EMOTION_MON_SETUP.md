# Emotion-mon Setup with Google Gemini (Imagen 4)

## Overview
Your Emotion-mon generator is now integrated with Google's Gemini API using Imagen 4 (latest model as of June 2025) for AI image generation!

## Setup Instructions

### 1. Get Your Google Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Select a Google Cloud project (or create a new one)
5. Copy your API key

### 2. Update Your .env File
1. Open the `.env` file in your project root
2. Paste your API key:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Dev Server
After adding your API key:
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## Cost Estimate
Google Gemini Imagen 4 pricing:
- **FREE tier**: 50 images per day
- **Paid tier**: ~$0.04 per image after free quota
- 100 Emotion-mons ≈ FREE (if within daily limit) or ~$4.00

Imagen 4 offers improved quality and detail over Imagen 3, while maintaining the same generous free tier!

## Alternative: Use a Different Model
If you want to try a different AI service, you can modify:
- `/src/lib/bananaService.ts` - Change the API endpoint
- Update the environment variables in `.env`

## Troubleshooting

### "API key not configured" error
- Make sure `.env` file exists in the project root
- Check that variable name is `VITE_GEMINI_API_KEY`
- Restart the dev server after adding key

### "API key invalid or Imagen API not enabled" error
- Make sure you enabled Imagen API in your Google Cloud project
- Go to https://console.cloud.google.com/apis/library
- Search for "Generative Language API" and enable it
- Wait a few minutes for it to propagate

### Generation takes too long
- Google Imagen usually takes 5-15 seconds
- First generation might be slower
- Check your internet connection

### Image not showing
- Check browser console for errors (F12)
- Verify you have API quota remaining
- Try a simpler prompt first

## Features
✅ Intelligent prompt generation based on emotional stats
✅ Keyword detection from description text
✅ White background enforcement
✅ Copy prompt for manual use
✅ Loading states and error handling
✅ Toast notifications

## Next Steps
Once working, you can:
- Save generated Emotion-mons to database (Supabase)
- Add download functionality
- Create shareable links
- Build community gallery
