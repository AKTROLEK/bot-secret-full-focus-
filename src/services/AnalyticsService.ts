import { Streamer } from '../models/Streamer';
import logger from '../utils/logger';

export class AnalyticsService {
  static async getWeeklyStats(userId: string): Promise<any> {
    const streamer = await Streamer.findOne({ userId });
    if (!streamer) {
      throw new Error('Streamer not found');
    }

    return {
      weeklyVideos: streamer.statistics.weeklyVideos,
      weeklyStreamHours: streamer.statistics.weeklyStreamHours,
      weeklyViews: 0, // Would be calculated from platform APIs
    };
  }

  static async getMonthlyStats(userId: string): Promise<any> {
    const streamer = await Streamer.findOne({ userId });
    if (!streamer) {
      throw new Error('Streamer not found');
    }

    return {
      monthlyVideos: streamer.statistics.monthlyVideos,
      monthlyStreamHours: streamer.statistics.monthlyStreamHours,
      monthlyViews: 0, // Would be calculated from platform APIs
    };
  }

  static async getTotalStats(userId: string): Promise<any> {
    const streamer = await Streamer.findOne({ userId });
    if (!streamer) {
      throw new Error('Streamer not found');
    }

    return {
      totalVideos: streamer.statistics.totalVideos,
      totalStreamHours: streamer.statistics.totalStreamHours,
      totalViews: streamer.statistics.totalViews,
      credits: streamer.credits,
    };
  }

  static async getTopStreamers(limit = 3, period: 'week' | 'month' = 'week'): Promise<any[]> {
    const sortField = period === 'week' ? 'statistics.weeklyVideos' : 'statistics.monthlyVideos';

    const streamers = await Streamer.find()
      .sort({ [sortField]: -1 })
      .limit(limit)
      .lean();

    return streamers.map((s, index) => ({
      rank: index + 1,
      username: s.username,
      videos: period === 'week' ? s.statistics.weeklyVideos : s.statistics.monthlyVideos,
      streamHours:
        period === 'week' ? s.statistics.weeklyStreamHours : s.statistics.monthlyStreamHours,
      credits: s.credits,
    }));
  }

  static async updateVideoCount(userId: string, count: number): Promise<void> {
    await Streamer.findOneAndUpdate(
      { userId },
      {
        $inc: {
          'statistics.totalVideos': count,
          'statistics.weeklyVideos': count,
          'statistics.monthlyVideos': count,
        },
        'statistics.lastActivity': new Date(),
      }
    );

    logger.info(`Updated video count for user ${userId}: +${count}`);
  }

  static async updateStreamHours(userId: string, hours: number): Promise<void> {
    await Streamer.findOneAndUpdate(
      { userId },
      {
        $inc: {
          'statistics.totalStreamHours': hours,
          'statistics.weeklyStreamHours': hours,
          'statistics.monthlyStreamHours': hours,
        },
        'statistics.lastActivity': new Date(),
      }
    );

    logger.info(`Updated stream hours for user ${userId}: +${hours}`);
  }

  static async resetWeeklyStats(): Promise<void> {
    await Streamer.updateMany({}, { 'statistics.weeklyVideos': 0, 'statistics.weeklyStreamHours': 0 });
    logger.info('Weekly statistics reset for all streamers');
  }

  static async resetMonthlyStats(): Promise<void> {
    await Streamer.updateMany({}, { 'statistics.monthlyVideos': 0, 'statistics.monthlyStreamHours': 0 });
    logger.info('Monthly statistics reset for all streamers');
  }

  static async getPlatformComparison(userId: string): Promise<any> {
    const streamer = await Streamer.findOne({ userId });
    if (!streamer) {
      throw new Error('Streamer not found');
    }

    // This would integrate with platform APIs to get real comparison data
    const platforms = Object.keys(streamer.platforms);
    const comparison: any = {};

    platforms.forEach(platform => {
      comparison[platform] = {
        videos: 0,
        views: 0,
        followers: 0,
        engagement: 0,
      };
    });

    return comparison;
  }
}
