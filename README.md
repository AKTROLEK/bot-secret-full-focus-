# Full Streamer Discord Bot System

A comprehensive Discord bot system for managing streamers with multi-platform support, credit system, analytics, and AI-powered features.

> **📦 This repository contains TWO separate applications:**
> 1. **Discord Bot** (TypeScript + MongoDB) - Main application
> 2. **Dashboard** (Next.js + React) - Separate web interface
>
> Each can be deployed independently and configured to work together via API.
>
> 📖 **[Read the Structure Guide](STRUCTURE.md)** to understand how they work together.

## Quick Links

- 📖 [Structure Guide](STRUCTURE.md) - Understand the architecture
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Deploy bot and dashboard
- 🎯 [Features Documentation](FEATURES.md) - Complete feature list
- 📱 [Dashboard README](dashboard/README.md) - Dashboard-specific docs
- ⚡ [Quick Start Guide](QUICKSTART.md) - Get started in 30 minutes

## Features

### 🎫 Ticket System
- Application submissions for streamers
- Multiple ticket types (application, issue, credit request, promotion, support)
- Role-based access control
- Private ticket channels

### 💰 Credit System
- Automatic credit earning
- Credit transfer between users
- Admin credit management
- Transaction history
- Credit wallet

### 📊 Analytics & Statistics
- Weekly, monthly, and total statistics
- Top streamers leaderboard
- Platform-specific analytics
- Performance tracking

### 🎮 Multi-Platform Support
- YouTube
- Twitch
- TikTok
- Kick
- Instagram Reels
- Facebook Gaming

### 🤖 AI Integration
- Content analysis and suggestions
- Auto-generated titles and descriptions
- Optimal streaming time recommendations
- Violation detection
- Smart replies

### 📅 Scheduling
- Stream schedule management
- Automated reminders
- Activity tracking

### 🌍 Multi-Language Support
- English
- Arabic (العربية)
  - **Note**: Discord does not support Arabic locale for slash command names and descriptions. Command names and descriptions will appear in English, but all bot responses, messages, and the dashboard UI support full Arabic translation. Use the `/language` command to switch between languages.

### 🎁 Rewards System
- Credit-based rewards store
- Multiple reward categories
- Weekly challenges
- Seasonal events

### 📱 Dashboard (Vercel)
- Real-time statistics
- Credit wallet management
- Leaderboard view
- Responsive design
- Dark mode optimized

## Installation

> **Note**: The bot and dashboard are **separate applications** and can be installed/deployed independently.

### Prerequisites
- Node.js 18.x or higher
- MongoDB (for bot)
- Discord Bot Token
- API Keys (YouTube, Twitch, OpenAI, etc.)

---

## 🤖 Bot Installation

### 1. Clone the repository:
```bash
git clone https://github.com/AKTROLEK/bot-secret-full-focus-.git
cd bot-secret-full-focus-
```

### 2. Install bot dependencies:
```bash
npm install
```

### 3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Discord bot token and IDs
- MongoDB connection string
- API keys
- Role and channel IDs

### 4. Build the bot:
```bash
npm run build
```

### 5. Start the bot:
```bash
npm start
```

---

## 📱 Dashboard Installation (Separate)

The dashboard is a **completely independent Next.js application** located in the `/dashboard` directory.

### 1. Navigate to dashboard directory:
```bash
cd dashboard
```

### 2. Install dashboard dependencies:
```bash
npm install
```

### 3. Create dashboard environment file:
```bash
cp .env.local.example .env.local  # or create manually
```

Add your API endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Run dashboard locally:
```bash
npm run dev
```

### 5. Deploy to Vercel:
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel deploy
```

Or use the [Vercel Dashboard](https://vercel.com) to deploy by connecting your GitHub repository and selecting the `/dashboard` directory as the root.

## Usage

### Bot Commands

#### General Commands
- `/apply` - Submit application to become a streamer
- `/leaderboard` - View top streamers
- `/language` - Change language preference

#### Streamer Commands
- `/credits balance` - Check credit balance
- `/credits transfer` - Transfer credits to another user
- `/credits history` - View transaction history
- `/stats weekly` - View weekly statistics
- `/stats monthly` - View monthly statistics
- `/stats total` - View total statistics

#### Admin Commands
- `/admin add-credits` - Add credits to a user
- `/admin remove-credits` - Remove credits from a user

## Platform Integration

### YouTube
Requires YouTube Data API v3 key. Configure in `.env`:
```
YOUTUBE_API_KEY=your_api_key
```

### Twitch
Requires Twitch application credentials:
```
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

### AI Features
Requires OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```

## Dashboard

The dashboard is built with Next.js 14 and optimized for Vercel deployment.

Features:
- Real-time statistics display
- Credit wallet interface
- Top streamers leaderboard
- Language switcher (EN/AR)
- Responsive design

### Local Development
```bash
cd dashboard
npm run dev
```

Visit `http://localhost:3000`

### Production Deployment
The dashboard is designed to be deployed on Vercel for optimal performance:

```bash
cd dashboard
vercel deploy --prod
```

## Architecture

```
bot-secret-full-focus-/
├── src/
│   ├── commands/        # Slash commands
│   │   ├── general/     # Public commands
│   │   ├── streamer/    # Streamer-only commands
│   │   └── admin/       # Admin commands
│   ├── events/          # Event handlers
│   ├── models/          # MongoDB models
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── locales/         # Translations
│   ├── config/          # Configuration
│   └── index.ts         # Main entry point
├── dashboard/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   └── styles/          # CSS styles
└── package.json
```

## Database Schema

### Streamer
- userId
- username
- platforms (YouTube, Twitch, etc.)
- credits
- schedule
- statistics

### CreditTransaction
- userId
- amount
- type
- reason
- timestamp

### Ticket
- id
- userId
- type
- status
- channelId
- content

### PlatformRule
- platform
- minVideosPerWeek
- minStreamHoursPerWeek
- contentType
- requirements

### Reward
- id
- name (EN/AR)
- description (EN/AR)
- cost
- category

### Challenge
- id
- title (EN/AR)
- description (EN/AR)
- reward
- startDate
- endDate
- type
- requirements

## Security

- Environment variables for sensitive data
- Role-based access control
- JWT authentication for dashboard
- Input validation
- Rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.