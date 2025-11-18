import axios from 'axios';
import { google } from 'googleapis';
import { config } from '../config/config';
import logger from '../utils/logger';

export class YouTubeService {
  private youtube;

  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: config.api.youtubeApiKey,
    });
  }

  async getChannelStats(channelId: string): Promise<any> {
    try {
      const response = await this.youtube.channels.list({
        part: ['statistics', 'snippet'],
        id: [channelId],
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return response.data.items[0];
    } catch (error) {
      logger.error('YouTube API error:', error);
      throw error;
    }
  }

  async getRecentVideos(channelId: string, maxResults = 10): Promise<any[]> {
    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        channelId,
        maxResults,
        order: 'date',
        type: ['video'],
      });

      return response.data.items || [];
    } catch (error) {
      logger.error('YouTube API error:', error);
      throw error;
    }
  }

  async getVideoStatistics(videoId: string): Promise<any> {
    try {
      const response = await this.youtube.videos.list({
        part: ['statistics', 'snippet', 'contentDetails'],
        id: [videoId],
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      return response.data.items[0];
    } catch (error) {
      logger.error('YouTube API error:', error);
      throw error;
    }
  }
}

export class TwitchService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor() {
    this.clientId = config.api.twitchClientId;
    this.clientSecret = config.api.twitchClientSecret;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        },
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      logger.error('Twitch OAuth error:', error);
      throw error;
    }
  }

  async getUserInfo(username: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get('https://api.twitch.tv/helix/users', {
        params: { login: username },
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data[0];
    } catch (error) {
      logger.error('Twitch API error:', error);
      throw error;
    }
  }

  async getStreamInfo(userId: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get('https://api.twitch.tv/helix/streams', {
        params: { user_id: userId },
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data[0] || null;
    } catch (error) {
      logger.error('Twitch API error:', error);
      throw error;
    }
  }

  async getRecentVideos(userId: string, maxResults = 10): Promise<any[]> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get('https://api.twitch.tv/helix/videos', {
        params: { user_id: userId, first: maxResults },
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data || [];
    } catch (error) {
      logger.error('Twitch API error:', error);
      throw error;
    }
  }
}

// Placeholder services for other platforms
export class TikTokService {
  async getUserInfo(username: string): Promise<any> {
    // TikTok API integration would go here
    logger.warn('TikTok API not fully implemented');
    return { username };
  }
}

export class KickService {
  async getUserInfo(username: string): Promise<any> {
    // Kick API integration would go here
    logger.warn('Kick API not fully implemented');
    return { username };
  }
}

export class InstagramService {
  async getUserInfo(username: string): Promise<any> {
    // Instagram API integration would go here
    logger.warn('Instagram API not fully implemented');
    return { username };
  }
}

export class FacebookGamingService {
  async getUserInfo(username: string): Promise<any> {
    // Facebook Gaming API integration would go here
    logger.warn('Facebook Gaming API not fully implemented');
    return { username };
  }
}
