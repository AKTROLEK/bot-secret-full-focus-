# API Integration Guide

## 🔌 Platform API Setup

### YouTube Data API v3

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)

**Usage in Bot:**
```javascript
import { YouTubeService } from './services/platform.service.js';

const youtube = new YouTubeService();

// Get channel stats
const stats = await youtube.getChannelStats('UC_channel_id');
console.log(stats.subscribers, stats.totalViews);

// Get recent videos
const videos = await youtube.getRecentVideos('UC_channel_id', 10);

// Get video stats
const videoStats = await youtube.getVideoStats('video_id');
```

**Rate Limits:**
- 10,000 units per day (free tier)
- 1 unit = simple read operation
- 50 units = video upload

---

### Twitch API

**Setup:**
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Register your application
3. Get Client ID and Client Secret

**Usage in Bot:**
```javascript
import { TwitchService } from './services/platform.service.js';

const twitch = new TwitchService();

// Get user info
const user = await twitch.getUserInfo('username');

// Check if streaming
const stream = await twitch.getStreamInfo(user.id);
if (stream) {
  console.log('User is live!', stream.viewer_count);
}

// Get follower count
const followers = await twitch.getFollowerCount(user.id);
```

**Rate Limits:**
- 800 requests per minute
- OAuth token expires every 60 days

---

### TikTok API

**Setup:**
1. Go to [TikTok Developers](https://developers.tiktok.com)
2. Create an app
3. Request access to required scopes
4. Get Client Key and Client Secret

**Authentication:**
```javascript
// Users need to authorize via OAuth
const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${CLIENT_KEY}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${REDIRECT_URI}`;
```

**Usage in Bot:**
```javascript
import { TikTokService } from './services/platform.service.js';

const tiktok = new TikTokService();

// Get user info (requires access token)
const user = await tiktok.getUserInfo(accessToken);
console.log(user.follower_count, user.video_count);
```

**Rate Limits:**
- Varies by endpoint
- Generally 100 requests per minute

---

### Instagram Graph API

**Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app
3. Add Instagram Graph API
4. Get App ID and App Secret

**Requirements:**
- Instagram Business or Creator account
- Connected to Facebook Page

**Usage in Bot:**
```javascript
import { InstagramService } from './services/platform.service.js';

const instagram = new InstagramService();

// Get user media (requires access token)
const media = await instagram.getUserMedia(accessToken, userId);

// Get insights
const insights = await instagram.getUserInsights(accessToken, userId);
```

**Rate Limits:**
- 200 calls per hour per user
- Access tokens expire every 60 days

---

### Kick API

**Setup:**
- Kick API is not fully public yet
- Limited documentation available

**Usage:**
```javascript
import { KickService } from './services/platform.service.js';

const kick = new KickService();

// Get channel info
const channel = await kick.getChannelInfo('username');
```

**Note:** Kick API may change as platform develops.

---

## 🤖 OpenAI API Integration

**Setup:**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create API key
3. Set billing (pay-as-you-go)

**Usage in Bot:**
```javascript
import AIService from './services/ai.service.js';

// Generate smart response
const response = await AIService.generateResponse(
  'How can I improve my streaming?',
  'ar' // language
);

// Analyze content
const analysis = await AIService.analyzeContent({
  title: 'My Gaming Video',
  description: '...',
  platform: 'youtube',
  views: 1000,
  engagement: 5.2
}, 'ar');

// Suggest streaming time
const suggestion = await AIService.suggestStreamingTime({
  followers: 5000,
  primaryLocation: 'Saudi Arabia',
  platform: 'twitch',
  peakTimes: ['20:00', '21:00', '22:00']
}, 'ar');

// Generate video metadata
const metadata = await AIService.generateVideoMetadata(
  'Fortnite Battle Royale Gameplay',
  'youtube',
  'ar'
);

// Detect violations
const violations = await AIService.detectViolations(
  'Video description here...',
  ['No profanity', 'Family-friendly content'],
  'ar'
);

// Generate script
const script = await AIService.generateScript(
  'How to Win in Fortnite',
  10, // minutes
  'ar'
);

// Get personalized tips
const tips = await AIService.getPersonalizedTips({
  weeklyVideos: 3,
  weeklyStreamHours: 12,
  avgViews: 5000,
  engagement: 4.5,
  platforms: ['youtube', 'twitch']
}, 'ar');
```

**Pricing (GPT-4):**
- ~$0.03 per 1K tokens (input)
- ~$0.06 per 1K tokens (output)
- Average response: ~500 tokens = $0.03

**Best Practices:**
- Cache common responses
- Implement rate limiting
- Use GPT-3.5 for simple tasks (cheaper)
- Set max_tokens to control costs

---

## 🔄 Webhooks (Future Enhancement)

### Discord Webhooks
Send formatted messages to Discord channels:

```javascript
import axios from 'axios';

async function sendWebhook(webhookUrl, data) {
  await axios.post(webhookUrl, {
    content: data.message,
    embeds: [{
      title: data.title,
      description: data.description,
      color: 0x00ff00,
      timestamp: new Date(),
    }],
  });
}
```

### Platform Webhooks
Set up webhooks for real-time updates:

**YouTube:**
- PubSubHubbub for new videos
- Requires verified domain

**Twitch:**
- EventSub for stream online/offline
- Requires webhook endpoint

**TikTok:**
- Webhook events for new videos
- Requires verified callback URL

---

## 📊 Data Collection & Cron Jobs

### Automated Analytics Collection

Create a cron job to fetch platform data:

```javascript
import cron from 'node-cron';
import { PlatformService } from './services/platform.service.js';
import { prisma } from './index.js';

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running analytics collection...');
  
  const streamers = await prisma.streamer.findMany({
    include: { platforms: true },
  });

  for (const streamer of streamers) {
    for (const platform of streamer.platforms) {
      try {
        // Fetch latest stats based on platform
        const stats = await fetchPlatformStats(platform);
        
        // Save to analytics
        await prisma.analytics.create({
          data: {
            streamerId: streamer.id,
            platform: platform.platform,
            videos: stats.videos,
            streamHours: stats.hours,
            views: stats.views,
            engagement: stats.engagement,
            followers: stats.followers,
            period: 'daily',
          },
        });
      } catch (error) {
        console.error(`Error fetching stats for ${streamer.username}:`, error);
      }
    }
  }
});
```

### Weekly Reports

```javascript
// Run every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Generating weekly reports...');
  
  const streamers = await prisma.streamer.findMany({
    where: { isActive: true },
  });

  for (const streamer of streamers) {
    // Generate and send weekly report
    await generateWeeklyReport(streamer);
  }
});
```

---

## 🔐 Security Best Practices

### API Key Management
- Store all keys in environment variables
- Never commit `.env` to git
- Rotate keys regularly
- Use different keys for dev/production

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation
```javascript
function validateInput(input, type) {
  switch (type) {
    case 'youtube_id':
      return /^UC[\w-]{21}[AQgw]$/.test(input);
    case 'twitch_username':
      return /^[a-zA-Z0-9_]{4,25}$/.test(input);
    default:
      return false;
  }
}
```

---

## 📈 Monitoring & Logging

### Error Tracking
```javascript
try {
  // API call
} catch (error) {
  console.error('API Error:', {
    service: 'youtube',
    error: error.message,
    timestamp: new Date(),
  });
  
  // Send to monitoring service (e.g., Sentry)
}
```

### Performance Monitoring
```javascript
const start = Date.now();
const result = await apiCall();
const duration = Date.now() - start;

console.log(`API call took ${duration}ms`);

if (duration > 5000) {
  console.warn('Slow API response detected');
}
```

---

## 🚀 Future Enhancements

### Planned Integrations
- [ ] Facebook Gaming API
- [ ] Discord Presence for live status
- [ ] Custom analytics dashboard API
- [ ] Mobile app API endpoints
- [ ] Third-party integrations (StreamElements, Streamlabs)

### Advanced Features
- [ ] ML-based content recommendations
- [ ] Automated highlight generation
- [ ] Multi-language content translation
- [ ] Sentiment analysis on comments
- [ ] Predictive analytics for growth

---

## 📚 Resources

- [YouTube API Docs](https://developers.google.com/youtube/v3)
- [Twitch API Docs](https://dev.twitch.tv/docs/api/)
- [TikTok API Docs](https://developers.tiktok.com/doc)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Prisma Docs](https://www.prisma.io/docs)

---

**For questions or issues, check the main README or create an issue on GitHub.**
