import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

export const config: Config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
  },
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/streamer-bot',
  },
  api: {
    youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
    twitchClientId: process.env.TWITCH_CLIENT_ID || '',
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-this',
  },
  dashboard: {
    url: process.env.DASHBOARD_URL || 'http://localhost:3001',
  },
  roles: {
    socialMediaManager: process.env.SOCIAL_MEDIA_MANAGER_ROLE_ID || '',
    socialTeam: process.env.SOCIAL_TEAM_ROLE_ID || '',
    streamerManagement: process.env.STREAMER_MANAGEMENT_ROLE_ID || '',
    streamer: process.env.STREAMER_ROLE_ID || '',
  },
  channels: {
    ticketCategory: process.env.TICKET_CATEGORY_ID || '',
    logChannel: process.env.LOG_CHANNEL_ID || '',
    announcementChannel: process.env.ANNOUNCEMENT_CHANNEL_ID || '',
  },
};
