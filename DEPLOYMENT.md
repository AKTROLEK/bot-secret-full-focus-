# Full Streamer System - Deployment Guide

## 📦 Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Environment variables configured

### Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Configure Environment Variables in Vercel Dashboard**
- Go to your project settings in Vercel
- Add all environment variables from `.env.example`:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - Other Discord and API keys

4. **Deploy**
```bash
# From project root
vercel --prod

# Or push to GitHub and Vercel will auto-deploy
```

## 🗄️ Database Setup

### Using Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy the connection string
4. Add to environment variables as `DATABASE_URL`

### Using External PostgreSQL
1. Create a PostgreSQL database
2. Get the connection string
3. Update `DATABASE_URL` in `.env`

### Initialize Database
```bash
npm run db:push
npm run db:generate
```

## 🤖 Discord Bot Setup

### Create Discord Application
1. Go to https://discord.com/developers/applications
2. Create New Application
3. Go to Bot section
4. Click "Add Bot"
5. Copy the token → Add to `DISCORD_TOKEN` in `.env`
6. Enable all Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### Get Client ID and Guild ID
- Client ID: From General Information page
- Guild ID: Enable Developer Mode in Discord → Right-click your server → Copy ID

### Invite Bot to Server
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```
Replace `YOUR_CLIENT_ID` with your actual client ID.

## 🔑 API Keys Setup

### YouTube API
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add to `YOUTUBE_API_KEY`

For OAuth (optional):
- Create OAuth 2.0 Client ID
- Add credentials to `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET`

### Twitch API
1. Go to https://dev.twitch.tv/console
2. Register your application
3. Get Client ID and Client Secret
4. Add to `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`

### TikTok API
1. Go to https://developers.tiktok.com
2. Create an app
3. Get Client Key and Client Secret
4. Add to `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`

### Instagram/Facebook API
1. Go to https://developers.facebook.com
2. Create an app
3. Add Instagram Graph API
4. Get App ID and App Secret
5. Add to `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET`

### OpenAI API
1. Go to https://platform.openai.com
2. Create API key
3. Add to `OPENAI_API_KEY`

## 🎨 Dashboard Customization

### Branding
Edit `/dashboard/pages/index.js` to customize:
- Logo
- Colors
- Text
- Features

### Adding New Pages
Create new files in `/dashboard/pages/dashboard/`:
```javascript
// /dashboard/pages/dashboard/newpage.js
export default function NewPage() {
  return <div>New Page</div>
}
```

## 🔧 Bot Configuration

### Role IDs
1. In Discord, enable Developer Mode (Settings → Advanced → Developer Mode)
2. Right-click roles → Copy ID
3. Add to `.env`:
   - `ROLE_SOCIAL_MEDIA_MANAGER`
   - `ROLE_SOCIAL_TEAM`
   - `ROLE_STREAMER_MANAGEMENT`
   - `ROLE_STREAMER`

### Channel IDs
1. Right-click channels → Copy ID
2. Add to `.env`:
   - `CHANNEL_TICKETS`
   - `CHANNEL_ANNOUNCEMENTS`
   - `CHANNEL_ANALYTICS`

## 📊 Analytics & Monitoring

### Vercel Analytics
Enable in Vercel Dashboard → Analytics

### Error Tracking
Consider integrating Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

## 🔐 Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables for all secrets**
3. **Enable 2FA on all accounts**
4. **Regularly rotate API keys**
5. **Review Discord bot permissions regularly**
6. **Keep dependencies updated**

## 🚀 Performance Optimization

### Database
- Use connection pooling
- Add indexes for frequently queried fields
- Regular database maintenance

### Caching
- Use Vercel Edge Caching
- Implement Redis for session storage (optional)

### CDN
- Vercel automatically uses CDN
- Optimize images before upload

## 📈 Scaling

### Bot Scaling
For multiple servers:
1. Consider using a process manager (PM2)
2. Implement sharding for large servers
3. Use a message queue (Bull, RabbitMQ)

### Database Scaling
- Start with Vercel Postgres
- Migrate to dedicated PostgreSQL for >10k users
- Consider read replicas for heavy read operations

## 🐛 Troubleshooting

### Bot Not Responding
1. Check bot is online in Discord
2. Verify token is correct
3. Check console for errors
4. Ensure intents are enabled

### Dashboard Not Loading
1. Check Vercel deployment logs
2. Verify environment variables
3. Check database connection

### Database Errors
1. Verify `DATABASE_URL` is correct
2. Run `npm run db:push` again
3. Check database is accessible

## 📚 Additional Resources

- [Discord.js Documentation](https://discord.js.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🆘 Support

For issues and questions:
1. Check documentation
2. Review error messages
3. Check GitHub Issues
4. Contact support

---

**Good luck with your Full Streamer System! 🎉**
