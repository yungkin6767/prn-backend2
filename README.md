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

2. Create `.env` file:
```
GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key (optional)
JWT_SECRET=your_secret
```

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

