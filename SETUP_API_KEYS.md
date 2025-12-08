# Setting Up Your API Keys

## Current Issue
Your `OPENAI_API_KEY` in `.env` appears to be a Google API key (starts with "AIza"). 
OpenAI API keys start with "sk-".

## How to Fix

### 1. Get Your API Keys

**Google Gemini (Primary) - FREE TIER:**
- Go to: https://ai.google.dev/
- Click "Get API Key" 
- Sign in with your Google account (FREE)
- Create a new API key (FREE - no credit card required)
- Key format: `AIza...` (starts with AIza)
- **Free Tier Limits:**
  - 15 requests per minute (RPM)
  - 1,500 requests per day (RPD)
  - Perfect for development and testing!

**OpenAI (Backup/Failover):**
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)
- ⚠️ You can only see it once, so save it!

### 2. Update Your `.env` File

Edit `prn-backend/.env` and set:

```env
# Google Gemini API Key (Primary)
GOOGLE_API_KEY=AIzaSy...your_google_key_here

# OpenAI API Key (Backup - must start with sk-)
OPENAI_API_KEY=sk-...your_openai_key_here

# JWT Secret (any random string)
JWT_SECRET=your_random_secret_here
```

### 3. Restart Backend

After updating `.env`, restart your backend server:
```bash
cd prn-backend
npm start
```

## How Failover Works

1. **Primary**: Tries Google Gemini first
2. **If Gemini fails/quota exceeded**: Automatically switches to OpenAI
3. **If both fail**: Shows error message

## Testing

- If you only have Gemini key: Works, but no failover
- If you only have OpenAI key: Will skip Gemini and use OpenAI directly
- If you have both: Full failover protection ✅

