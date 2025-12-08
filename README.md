# PRN Backend

Backend server for PRN Creator app with Vercel serverless functions.

## Features

- AI chat with Ms. PRN (Gemini/OpenAI failover)
- Voice synthesis (OpenAI TTS)
- Authentication (JWT)
- PRN Engine compilation (placeholder)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in `prn-backend/` directory:
```
GOOGLE_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_random_secret_string
```

**To get your API keys:**
- **Google Gemini**: https://ai.google.dev/ → Get API Key
- **OpenAI**: https://platform.openai.com/api-keys → Create new secret key
- **JWT_SECRET**: Any random string (e.g., use `openssl rand -hex 32`)

3. Run locally:
```bash
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

## API Endpoints

- `POST /api/chat` - Chat with Ms. PRN
- `POST /api/voice` - Text-to-speech
- `POST /api/auth` - Authentication (register/login)
- `POST /api/engine/compile` - Compile CC+ code (placeholder)

