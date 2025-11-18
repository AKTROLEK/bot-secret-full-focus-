# Quick Start Guide

Get your Full Streamer Discord Bot System up and running in minutes!

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB installed or MongoDB Atlas account
- Discord account with server admin access
- Basic knowledge of Discord bots

## Step 1: Discord Bot Setup (5 minutes)

### 1.1 Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name your application (e.g., "Streamer Bot")
4. Click "Create"

### 1.2 Create Bot User
1. Click "Bot" in left sidebar
2. Click "Add Bot"
3. Confirm by clicking "Yes, do it!"
4. Copy the bot token (keep it secret!)

### 1.3 Enable Intents
Enable these intents:
- ✅ Server Members Intent
- ✅ Message Content Intent
- ✅ Presence Intent

### 1.4 Get Application ID
1. Click "General Information"
2. Copy "Application ID" (this is your CLIENT_ID)

### 1.5 Get Guild ID
1. Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
2. Right-click your server icon
3. Click "Copy ID" (this is your GUILD_ID)

## Step 2: Create Roles and Channels (5 minutes)

### 2.1 Create Roles
In your Discord server, create these roles:
- 🔴 Social Media Manager
- 🟢 Social Team
- 🔵 Streamer Management
- 🟡 Streamer

Copy each role ID (right-click role > Copy ID)

### 2.2 Create Channels
Create these channels:
- 📋 #tickets (category)
- 📢 #announcements
- 📊 #logs

Copy each channel ID

## Step 3: Database Setup (5 minutes)

### Option A: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

Your connection string: `mongodb://localhost:27017/streamer-bot`

### Option B: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0`
6. Get connection string
7. Replace `<password>` with your password

## Step 4: Get API Keys (10 minutes)

### YouTube API (Optional but recommended)
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy API key

### Twitch API (Optional)
1. Go to https://dev.twitch.tv
2. Register application
3. Copy Client ID and Client Secret

### OpenAI API (Optional)
1. Go to https://platform.openai.com
2. Create account
3. Generate API key
4. Copy API key

## Step 5: Install Bot (5 minutes)

### 5.1 Clone Repository
```bash
git clone https://github.com/AKTROLEK/bot-secret-full-focus-.git
cd bot-secret-full-focus-
```

### 5.2 Install Dependencies
```bash
npm install
```

### 5.3 Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your values:
```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here

# Database
MONGODB_URI=your_mongodb_connection_string

# API Keys (optional)
YOUTUBE_API_KEY=your_youtube_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_secret
OPENAI_API_KEY=your_openai_key

# Roles
SOCIAL_MEDIA_MANAGER_ROLE_ID=role_id
SOCIAL_TEAM_ROLE_ID=role_id
STREAMER_MANAGEMENT_ROLE_ID=role_id
STREAMER_ROLE_ID=role_id

# Channels
TICKET_CATEGORY_ID=category_id
LOG_CHANNEL_ID=channel_id
ANNOUNCEMENT_CHANNEL_ID=channel_id
```

### 5.4 Build Project
```bash
npm run build
```

### 5.5 Start Bot
```bash
npm start
```

You should see: `✅ Logged in as Your Bot Name`

## Step 6: Invite Bot to Server (2 minutes)

Create invite URL:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your application ID.

1. Visit the URL
2. Select your server
3. Click "Authorize"
4. Complete captcha

## Step 7: Test Commands (2 minutes)

In your Discord server, try:
- `/apply` - Test application system
- `/leaderboard` - View leaderboard
- `/language` - Change language
- `/rules` - View platform rules

## Step 8: Deploy Dashboard (10 minutes)

### 8.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 8.2 Deploy
```bash
cd dashboard
vercel login
vercel
```

Follow the prompts to deploy.

### 8.3 Update Environment
After deployment, add your bot API URL to Vercel:
```
NEXT_PUBLIC_API_URL=http://your-bot-url:3000
```

## Congratulations! 🎉

Your Full Streamer Discord Bot System is now running!

## Next Steps

1. **Customize Platform Rules**
   - Use database to update platform requirements
   
2. **Add Rewards**
   - Modify rewards in database or SetupService.ts

3. **Configure Automation**
   - Review cron schedules in index.ts
   
4. **Monitor Performance**
   - Check logs in `logs/` directory
   
5. **Backup Data**
   - Set up MongoDB backups

## Common Issues

### Bot not responding to commands?
- Check bot token is correct
- Verify bot has permissions
- Ensure intents are enabled
- Wait up to 1 hour for Discord to refresh

### Database connection error?
- Verify MongoDB is running
- Check connection string format
- Ensure IP is whitelisted (MongoDB Atlas)

### Commands in wrong language?
- Use `/language` to switch
- Check locale files in src/locales/

### Dashboard not loading data?
- Verify API URL is correct
- Check CORS settings
- Ensure bot API is running on port 3000

## Support

- 📖 Full Documentation: [README.md](README.md)
- 🚀 Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🔌 API Reference: [API.md](API.md)
- ✨ Features List: [FEATURES.md](FEATURES.md)

## Production Deployment

For production deployment:
1. Use PM2 for process management
2. Setup MongoDB backups
3. Configure SSL/HTTPS
4. Enable rate limiting
5. Monitor logs
6. Set up alerts

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production setup.

---

**Enjoy managing your streamer community! 🎮🎬**
