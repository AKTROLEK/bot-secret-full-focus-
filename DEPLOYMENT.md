# Deployment Guide

This guide covers deploying both the **Discord Bot** and **Dashboard** as **separate, independent applications**.

## 📦 Architecture Overview

The system consists of TWO separate applications:

1. **Discord Bot** (TypeScript + MongoDB)
   - Handles all Discord interactions
   - Manages database and business logic
   - Exposes REST API for dashboard
   - Deploy on: VPS, Cloud platforms, or Docker

2. **Dashboard** (Next.js + React)
   - Web interface for viewing statistics
   - Completely independent frontend
   - Connects to bot via API
   - Deploy on: Vercel, Netlify, or any static hosting

**They can be deployed separately and communicate via API.**

---

## 🤖 Bot Deployment

### Prerequisites
1. Node.js 18+ installed
2. MongoDB instance (local or cloud like MongoDB Atlas)
3. Discord Bot with necessary permissions

### Steps

1. **Create Discord Application**
   - Go to https://discord.com/developers/applications
   - Create new application
   - Navigate to "Bot" section
   - Create bot and copy token
   - Enable necessary intents:
     - Server Members Intent
     - Message Content Intent
     - Presence Intent

2. **Setup MongoDB**
   - Create MongoDB database
   - Get connection string
   - Add to `.env` file

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Fill in all required values in `.env`

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start Bot**
   ```bash
   npm start
   ```

### Production Deployment Options

#### Option 1: VPS/Dedicated Server
```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
pm2 start dist/index.js --name streamer-bot

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option 2: Docker
```bash
# Build image
docker build -t streamer-bot .

# Run container
docker run -d --name streamer-bot --env-file .env streamer-bot
```

#### Option 3: Cloud Platforms (Heroku, Railway, etc.)
- Push code to repository
- Connect repository to platform
- Configure environment variables
- Deploy

## 📱 Dashboard Deployment (Separate Application)

The dashboard is a **completely independent Next.js application** that can be deployed separately from the bot.

### Option 1: Vercel (Recommended) ⭐

#### Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository connected

#### Method A: Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory**: Set to `dashboard`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Add Environment Variables**
   - `NEXT_PUBLIC_API_URL` - Your bot API URL (e.g., `https://your-bot-api.com`)
   
4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

#### Method B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Dashboard**
   ```bash
   cd dashboard
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Follow Prompts**
   - Login to Vercel
   - Link to existing project or create new
   - Configure settings
   - Deploy

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Go to https://app.netlify.com
   - Import your GitHub repository

2. **Configure Build**
   - **Base directory**: `dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `dashboard/.next`

3. **Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy**

### Option 3: Self-Hosted

1. **Build Dashboard**
   ```bash
   cd dashboard
   npm install
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Use Process Manager**
   ```bash
   # PM2
   pm2 start npm --name "dashboard" -- start
   
   # Or systemd service
   ```

4. **Configure Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name dashboard.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Environment Variables for Dashboard

Add these in your deployment platform:

```env
# Required
NEXT_PUBLIC_API_URL=https://your-bot-api-url.com

# Optional
NEXT_PUBLIC_SITE_NAME=Streamer Dashboard
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔗 Connecting Bot and Dashboard

### Bot Configuration

1. **Enable API Server** (in bot's `.env`):
   ```env
   API_PORT=3000
   API_ENABLED=true
   CORS_ORIGIN=https://your-dashboard-url.vercel.app
   ```

2. **Configure CORS**
   The bot's Express server should allow requests from your dashboard domain.

### Dashboard Configuration

1. **Set API URL** (in dashboard's `.env.local` or deployment platform):
   ```env
   NEXT_PUBLIC_API_URL=https://your-bot-api.com
   ```

2. **Verify Connection**
   - Dashboard should connect to bot's API
   - Test by opening dashboard in browser
   - Check browser console for connection errors

---

## 🧪 Testing Deployment

### Bot
```bash
# Check if bot is running
curl http://your-bot-api.com/health

# Check API endpoints
curl http://your-bot-api.com/api/stats
```

### Dashboard
```bash
# Visit dashboard URL
https://your-dashboard.vercel.app

# Check console for errors
# Verify API connection
```

---

## 🚀 Production Checklist

### Bot
- [ ] Environment variables configured
- [ ] MongoDB connected
- [ ] Discord bot token valid
- [ ] API server running
- [ ] CORS configured
- [ ] Logs configured
- [ ] Process manager (PM2/systemd)
- [ ] Firewall rules
- [ ] SSL certificate (if exposing API)

### Dashboard
- [ ] Deployed to hosting platform
- [ ] Environment variables set
- [ ] API URL configured
- [ ] Build successful
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] CDN enabled (if available)
- [ ] Performance optimized

---

### Automatic Deployments
- Connect GitHub repository to Vercel
- Enable automatic deployments
- Every push to main branch will deploy

## Database Setup (MongoDB Atlas)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account

2. **Create Cluster**
   - Choose free tier
   - Select region closest to your users
   - Create cluster

3. **Setup Access**
   - Create database user
   - Add IP whitelist (0.0.0.0/0 for allow all)
   - Get connection string

4. **Configure Connection**
   - Add connection string to `.env`
   - Replace `<password>` with actual password

## Discord Bot Permissions

Required permissions:
- Manage Channels
- Manage Roles
- Send Messages
- Embed Links
- Read Message History
- Use Slash Commands
- View Channels

Invite URL:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## API Keys Setup

### YouTube API
1. Go to Google Cloud Console
2. Create new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add to `.env`

### Twitch API
1. Go to https://dev.twitch.tv
2. Register application
3. Get Client ID and Secret
4. Add to `.env`

### OpenAI API
1. Go to https://platform.openai.com
2. Create account
3. Generate API key
4. Add to `.env`

## Monitoring & Maintenance

### Logs
- Bot logs are stored in `logs/` directory
- Use `pm2 logs` if using PM2
- Configure log rotation for production

### Health Checks
- API endpoint: `http://your-bot-url:3000/health`
- Dashboard endpoint: `https://your-dashboard.vercel.app`

### Backup
- Regular MongoDB backups
- Environment variables backup
- Configuration backup

## Troubleshooting

### Bot Not Starting
- Check `.env` configuration
- Verify MongoDB connection
- Check Discord token validity
- Review logs for errors

### Commands Not Appearing
- Verify bot has correct permissions
- Check GUILD_ID is correct
- Re-register commands
- Wait up to 1 hour for Discord cache

### Dashboard Not Loading
- Check API URL configuration
- Verify CORS settings
- Check Vercel deployment logs

## Security Best Practices

1. Never commit `.env` file
2. Use environment variables for secrets
3. Regularly rotate API keys
4. Keep dependencies updated
5. Use HTTPS for all connections
6. Implement rate limiting
7. Validate all user inputs
8. Use secure MongoDB connection

## Scaling

### Horizontal Scaling
- Deploy multiple bot instances
- Use Redis for shared state
- Load balance API requests

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching

### Database Scaling
- Use MongoDB sharding
- Implement read replicas
- Optimize indexes

## Support

For deployment issues:
1. Check documentation
2. Review logs
3. Check GitHub issues
4. Contact support
