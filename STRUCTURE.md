# Project Structure

This document explains how the Full Streamer System is organized as **two separate, independent applications**.

## 🏗️ Architecture

```
bot-secret-full-focus-/
│
├── 🤖 Bot Application (Root)
│   ├── src/                      # Bot source code (TypeScript)
│   │   ├── commands/            # Discord slash commands
│   │   ├── services/            # Business logic services
│   │   ├── models/              # MongoDB/Mongoose models
│   │   ├── utils/               # Helper functions
│   │   └── index.ts             # Bot entry point
│   │
│   ├── package.json             # Bot dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── .env.example             # Bot environment template
│   └── README.md                # Main documentation
│
└── 📱 Dashboard Application (Separate)
    └── dashboard/               # Next.js application
        ├── app/                 # Next.js 14 App Router
        ├── components/          # React components
        ├── styles/              # CSS and Tailwind
        ├── public/              # Static assets
        ├── package.json         # Dashboard dependencies (separate!)
        ├── .env.local.example   # Dashboard environment template
        └── README.md            # Dashboard documentation
```

## 🔄 How They Work Together

### Independent Deployment

1. **Bot** runs as a Node.js server:
   - Handles Discord events
   - Manages database (MongoDB)
   - Exposes REST API on port 3000 (configurable)

2. **Dashboard** runs as a Next.js app:
   - Independent frontend application
   - Fetches data from bot's API
   - Can be deployed to Vercel/Netlify
   - No direct database access

### Communication Flow

```
Discord ← Bot Server (TypeScript) → MongoDB
                ↓
            REST API
                ↓
        Dashboard (Next.js) → Users (Browser)
```

## 📦 Two Separate `package.json` Files

### Root `package.json` (Bot)
```json
{
  "name": "full-streamer-discord-bot",
  "dependencies": {
    "discord.js": "^14.14.1",
    "mongoose": "^8.0.3",
    "express": "^4.18.2",
    ...
  }
}
```

### `dashboard/package.json` (Dashboard)
```json
{
  "name": "streamer-dashboard",
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    ...
  }
}
```

## 🚀 Deployment Options

### Scenario 1: Both on Same Server
```bash
# Terminal 1: Run bot
npm install
npm run build
npm start

# Terminal 2: Run dashboard
cd dashboard
npm install
npm run build
npm start
```

### Scenario 2: Separate Deployments (Recommended)

**Bot:**
- VPS (DigitalOcean, Linode, AWS EC2)
- Cloud platform (Railway, Render)
- Docker container

**Dashboard:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- Any static hosting

## 🔐 Environment Variables

### Bot `.env`
```env
# Discord
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# Database
MONGODB_URI=mongodb://localhost:27017/streamer_db

# API
API_PORT=3000
CORS_ORIGIN=https://your-dashboard.vercel.app

# External APIs
YOUTUBE_API_KEY=your_key
TWITCH_CLIENT_ID=your_id
OPENAI_API_KEY=your_key
```

### Dashboard `.env.local`
```env
# Bot API
NEXT_PUBLIC_API_URL=https://your-bot-api.com

# Optional
NEXT_PUBLIC_SITE_NAME=Streamer Dashboard
```

## 🛠️ Development Workflow

### Working on Bot
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build
npm run build

# Start production
npm start
```

### Working on Dashboard
```bash
# Navigate to dashboard
cd dashboard

# Install dependencies
npm install

# Start development
npm run dev

# Build
npm run build

# Start production
npm start
```

## 📊 Database Access

**Important:** Only the bot has direct database access!

- ✅ **Bot**: Direct MongoDB connection via Mongoose
- ❌ **Dashboard**: NO direct database access
- ✅ **Dashboard**: Fetches data via bot's REST API

This separation ensures:
- Better security
- Easier deployment
- Scalability
- Independent updates

## 🔄 API Endpoints (Bot → Dashboard)

The bot exposes these API endpoints for the dashboard:

```
GET  /api/stats              # Get statistics
GET  /api/leaderboard        # Get top streamers
GET  /api/credits/:userId    # Get user credits
POST /api/credits/transfer   # Transfer credits
GET  /api/schedule/:userId   # Get user schedule
...
```

## 🎯 Benefits of Separation

1. **Independent Scaling**
   - Scale bot and dashboard separately
   - Dashboard can use CDN

2. **Technology Independence**
   - Update Next.js without affecting bot
   - Change bot implementation without touching dashboard

3. **Deployment Flexibility**
   - Bot on VPS, dashboard on Vercel
   - Different deployment schedules
   - Easier rollbacks

4. **Development Efficiency**
   - Different teams can work independently
   - Separate dependency management
   - Clearer responsibilities

## 🔧 Modifying the Structure

### Adding Bot Features
1. Edit files in `src/`
2. Add new commands in `src/commands/`
3. Create services in `src/services/`
4. Update bot's `package.json` if needed
5. Expose new API endpoints if dashboard needs them

### Adding Dashboard Features
1. Navigate to `dashboard/`
2. Create components in `components/`
3. Add pages in `app/`
4. Update dashboard's `package.json` if needed
5. Use bot's API endpoints for data

## 📝 Summary

- **Two Applications**: Bot (backend) + Dashboard (frontend)
- **Two package.json**: Independent dependencies
- **API Communication**: Dashboard fetches from bot's API
- **Independent Deployment**: Deploy separately or together
- **Clear Separation**: Backend logic vs. frontend UI

This architecture provides maximum flexibility and follows modern best practices for full-stack applications.
