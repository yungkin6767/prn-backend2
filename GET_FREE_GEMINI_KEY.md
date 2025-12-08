# How to Get a FREE Google Gemini API Key

## ✅ Google Gemini API is FREE!

Google Gemini offers a **free tier** with generous limits - perfect for development and personal projects.

## Step-by-Step Guide

### 1. Go to Google AI Studio
Visit: **https://ai.google.dev/**

### 2. Sign In
- Click "Get API Key" button
- Sign in with your Google account (Gmail account works)
- **No credit card required!** 🎉

### 3. Create API Key
- Click "Create API Key"
- Choose "Create API key in new project" (or use existing project)
- Your API key will be generated (starts with `AIza...`)
- **Copy it immediately** - you can see it again later in Google Cloud Console

### 4. Free Tier Limits
According to Google's documentation:
- **15 requests per minute (RPM)**
- **1,500 requests per day (RPD)**
- **Free forever** (as of 2024)

### 5. Add to Your Project

Edit `prn-backend/.env`:
```env
GOOGLE_API_KEY=AIzaSy...your_key_here
```

### 6. Restart Backend
```bash
cd prn-backend
npm start
```

## Important Notes

- ✅ **Completely FREE** - no credit card needed
- ✅ **No expiration** - free tier is permanent
- ✅ **Perfect for development** - 1,500 requests/day is plenty for testing
- ⚠️ If you hit the limit, wait 24 hours or upgrade to paid tier
- 💡 That's why we have OpenAI failover - when Gemini quota is exceeded, it automatically switches!

## Troubleshooting

**"Quota exceeded" error?**
- You've hit the 1,500 requests/day limit
- Wait 24 hours for reset, OR
- Make sure you have `OPENAI_API_KEY` set for automatic failover

**Can't find the API key?**
- Go to: https://aistudio.google.com/app/apikey
- Or: https://console.cloud.google.com/apis/credentials

## Alternative: Use OpenAI Only

If you prefer, you can skip Gemini and use OpenAI directly:
- Set `GOOGLE_API_KEY=` (empty)
- Set `OPENAI_API_KEY=sk-your_key_here`
- The router will skip Gemini and use OpenAI

