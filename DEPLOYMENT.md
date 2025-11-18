# Deployment Guide

## Bot Deployment

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

## Dashboard Deployment on Vercel

### Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository

### Steps

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

### Environment Variables on Vercel
Add these in Vercel dashboard settings:
- `NEXT_PUBLIC_API_URL` - Your bot API URL
- Any other public environment variables

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
