import axios from 'axios';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * YouTube API Integration Service
 */
export class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
  }

  /**
   * Get channel statistics
   */
  async getChannelStats(channelId) {
    try {
      const response = await this.youtube.channels.list({
        part: ['statistics', 'snippet'],
        id: [channelId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          subscribers: parseInt(channel.statistics.subscriberCount),
          totalViews: parseInt(channel.statistics.viewCount),
          totalVideos: parseInt(channel.statistics.videoCount),
          title: channel.snippet.title,
        };
      }
      return null;
    } catch (error) {
      console.error('YouTube API Error:', error);
      return null;
    }
  }

  /**
   * Get recent videos
   */
  async getRecentVideos(channelId, maxResults = 10) {
    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        channelId: channelId,
        order: 'date',
        type: ['video'],
        maxResults: maxResults,
      });

      return response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high.url,
      }));
    } catch (error) {
      console.error('YouTube API Error:', error);
      return [];
    }
  }

  /**
   * Get video statistics
   */
  async getVideoStats(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: ['statistics', 'contentDetails'],
        id: [videoId],
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          views: parseInt(video.statistics.viewCount),
          likes: parseInt(video.statistics.likeCount || 0),
          comments: parseInt(video.statistics.commentCount || 0),
          duration: video.contentDetails.duration,
        };
      }
      return null;
    } catch (error) {
      console.error('YouTube API Error:', error);
      return null;
    }
  }
}

/**
 * Twitch API Integration Service
 */
export class TwitchService {
  constructor() {
    this.clientId = process.env.TWITCH_CLIENT_ID;
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
    this.accessToken = null;
  }

  /**
   * Get OAuth token
   */
  async getAccessToken() {
    try {
      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`
      );
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Twitch Auth Error:', error);
      return null;
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(username) {
    if (!this.accessToken) await this.getAccessToken();

    try {
      const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Twitch API Error:', error);
      return null;
    }
  }

  /**
   * Get stream info (if live)
   */
  async getStreamInfo(userId) {
    if (!this.accessToken) await this.getAccessToken();

    try {
      const response = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null; // Not live
    } catch (error) {
      console.error('Twitch API Error:', error);
      return null;
    }
  }

  /**
   * Get follower count
   */
  async getFollowerCount(userId) {
    if (!this.accessToken) await this.getAccessToken();

    try {
      const response = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      return response.data.total || 0;
    } catch (error) {
      console.error('Twitch API Error:', error);
      return 0;
    }
  }
}

/**
 * TikTok API Integration Service (Basic)
 */
export class TikTokService {
  constructor() {
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  }

  /**
   * Get user info (requires OAuth)
   */
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get('https://open-api.tiktok.com/user/info/', {
        params: {
          access_token: accessToken,
          fields: 'open_id,union_id,avatar_url,display_name,follower_count,video_count',
        },
      });

      return response.data.data.user;
    } catch (error) {
      console.error('TikTok API Error:', error);
      return null;
    }
  }
}

/**
 * Instagram API Integration Service (via Facebook Graph API)
 */
export class InstagramService {
  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID;
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  }

  /**
   * Get user media
   */
  async getUserMedia(accessToken, userId) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Instagram API Error:', error);
      return [];
    }
  }

  /**
   * Get user insights
   */
  async getUserInsights(accessToken, userId) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/${userId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Instagram API Error:', error);
      return [];
    }
  }
}

/**
 * Kick API Integration Service (Note: Kick has limited public API)
 */
export class KickService {
  constructor() {
    this.apiKey = process.env.KICK_API_KEY;
  }

  /**
   * Get channel info
   */
  async getChannelInfo(username) {
    try {
      // Note: Kick's API is not fully public, this is a placeholder
      const response = await axios.get(`https://kick.com/api/v1/channels/${username}`);
      return response.data;
    } catch (error) {
      console.error('Kick API Error:', error);
      return null;
    }
  }
}

/**
 * Platform Service Manager
 */
export class PlatformService {
  constructor() {
    this.youtube = new YouTubeService();
    this.twitch = new TwitchService();
    this.tiktok = new TikTokService();
    this.instagram = new InstagramService();
    this.kick = new KickService();
  }

  /**
   * Get service for platform
   */
  getService(platform) {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return this.youtube;
      case 'twitch':
        return this.twitch;
      case 'tiktok':
        return this.tiktok;
      case 'instagram':
        return this.instagram;
      case 'kick':
        return this.kick;
      default:
        return null;
    }
  }
}

export default PlatformService;
