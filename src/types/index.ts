export interface Config {
  discord: {
    token: string;
    clientId: string;
    guildId: string;
  };
  database: {
    mongoUri: string;
  };
  api: {
    youtubeApiKey: string;
    twitchClientId: string;
    twitchClientSecret: string;
    openaiApiKey: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  jwt: {
    secret: string;
  };
  dashboard: {
    url: string;
  };
  roles: {
    socialMediaManager: string;
    socialTeam: string;
    streamerManagement: string;
    streamer: string;
  };
  channels: {
    ticketCategory: string;
    logChannel: string;
    announcementChannel: string;
  };
}

export interface StreamerProfile {
  userId: string;
  username: string;
  platforms: {
    youtube?: string;
    twitch?: string;
    tiktok?: string;
    kick?: string;
    instagram?: string;
    facebook?: string;
  };
  credits: number;
  schedule: ScheduleEntry[];
  statistics: StreamerStatistics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  platform: string;
}

export interface StreamerStatistics {
  totalVideos: number;
  totalStreamHours: number;
  totalViews: number;
  weeklyVideos: number;
  weeklyStreamHours: number;
  monthlyVideos: number;
  monthlyStreamHours: number;
  lastActivity: Date;
}

export interface CreditTransaction {
  userId: string;
  amount: number;
  type: 'earn' | 'spend' | 'admin_add' | 'admin_remove' | 'transfer';
  reason: string;
  fromUser?: string;
  toUser?: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  type: 'application' | 'issue' | 'credit_request' | 'promotion' | 'support';
  status: 'open' | 'closed' | 'in_progress';
  channelId: string;
  content: string;
  createdAt: Date;
  closedAt?: Date;
}

export interface PlatformRule {
  platform: string;
  minVideosPerWeek: number;
  minStreamHoursPerWeek: number;
  contentType: string;
  requirements: string[];
}

export interface Reward {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  cost: number;
  category: 'rank' | 'promotion' | 'service' | 'gift' | 'tools' | 'coaching';
  available: boolean;
}

export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

export interface Challenge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  reward: number;
  startDate: Date;
  endDate: Date;
  type: 'weekly' | 'seasonal';
  requirements: ChallengeRequirement[];
}

export interface ChallengeRequirement {
  type: 'videos' | 'stream_hours' | 'views' | 'engagement';
  target: number;
}
