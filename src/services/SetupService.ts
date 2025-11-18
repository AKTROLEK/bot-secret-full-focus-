import { PlatformRule } from '../models/PlatformRule';
import { Reward } from '../models/Reward';
import logger from '../utils/logger';

export async function initializeDefaultData() {
  try {
    // Initialize default platform rules
    const platformRules = [
      {
        platform: 'youtube',
        minVideosPerWeek: 3,
        minStreamHoursPerWeek: 10,
        contentType: 'Gaming/Entertainment',
        requirements: [
          'Content must be family-friendly',
          'No copyright violations',
          'Minimum 720p resolution',
          'Regular upload schedule',
        ],
      },
      {
        platform: 'twitch',
        minVideosPerWeek: 0,
        minStreamHoursPerWeek: 15,
        contentType: 'Live Gaming',
        requirements: [
          'Follow Twitch TOS',
          'Consistent streaming schedule',
          'Minimum 720p quality',
          'Active chat engagement',
        ],
      },
      {
        platform: 'tiktok',
        minVideosPerWeek: 5,
        minStreamHoursPerWeek: 0,
        contentType: 'Short-form Content',
        requirements: [
          'Vertical video format',
          'Trending content participation',
          'High engagement rate',
          'Original content',
        ],
      },
      {
        platform: 'kick',
        minVideosPerWeek: 0,
        minStreamHoursPerWeek: 12,
        contentType: 'Live Streaming',
        requirements: [
          'Follow platform guidelines',
          'Regular streaming schedule',
          'Good quality stream',
          'Community engagement',
        ],
      },
      {
        platform: 'instagram',
        minVideosPerWeek: 4,
        minStreamHoursPerWeek: 5,
        contentType: 'Reels/Stories/Live',
        requirements: [
          'High-quality content',
          'Regular posting schedule',
          'Use of trending hashtags',
          'Story engagement',
        ],
      },
      {
        platform: 'facebook',
        minVideosPerWeek: 2,
        minStreamHoursPerWeek: 8,
        contentType: 'Gaming/Live Streams',
        requirements: [
          'Follow Facebook Gaming policies',
          'Consistent schedule',
          'Good video quality',
          'Community building',
        ],
      },
    ];

    for (const rule of platformRules) {
      await PlatformRule.findOneAndUpdate({ platform: rule.platform }, rule, {
        upsert: true,
      });
    }

    logger.info('Platform rules initialized');

    // Initialize default rewards
    const rewards = [
      {
        id: 'rank_upgrade_1',
        name: 'VIP Streamer Rank',
        nameAr: 'رتبة ستريمر VIP',
        description: 'Upgrade to VIP Streamer rank with special perks',
        descriptionAr: 'ترقية إلى رتبة ستريمر VIP مع امتيازات خاصة',
        cost: 1000,
        category: 'rank',
        available: true,
      },
      {
        id: 'rank_upgrade_2',
        name: 'Elite Streamer Rank',
        nameAr: 'رتبة ستريمر نخبة',
        description: 'Upgrade to Elite Streamer rank with exclusive benefits',
        descriptionAr: 'ترقية إلى رتبة ستريمر النخبة مع مزايا حصرية',
        cost: 2500,
        category: 'rank',
        available: true,
      },
      {
        id: 'promotion_1',
        name: 'Video Promotion (1 week)',
        nameAr: 'ترويج فيديو (أسبوع واحد)',
        description: 'Promote your video in featured channels for 1 week',
        descriptionAr: 'ترويج الفيديو الخاص بك في القنوات المميزة لمدة أسبوع واحد',
        cost: 500,
        category: 'promotion',
        available: true,
      },
      {
        id: 'promotion_2',
        name: 'Stream Announcement',
        nameAr: 'إعلان البث',
        description: 'Get your stream announced to all members',
        descriptionAr: 'الإعلان عن البث الخاص بك لجميع الأعضاء',
        cost: 300,
        category: 'promotion',
        available: true,
      },
      {
        id: 'service_1',
        name: 'Professional Thumbnail Design',
        nameAr: 'تصميم صورة مصغرة احترافية',
        description: 'Get a custom thumbnail designed by professional designer',
        descriptionAr: 'احصل على صورة مصغرة مخصصة من مصمم محترف',
        cost: 400,
        category: 'service',
        available: true,
      },
      {
        id: 'service_2',
        name: 'Video Editing Service',
        nameAr: 'خدمة تحرير الفيديو',
        description: 'Professional video editing for one video',
        descriptionAr: 'تحرير فيديو احترافي لفيديو واحد',
        cost: 800,
        category: 'service',
        available: true,
      },
      {
        id: 'gift_1',
        name: 'Steam Gift Card $10',
        nameAr: 'بطاقة هدايا Steam بقيمة 10 دولار',
        description: '$10 Steam Gift Card',
        descriptionAr: 'بطاقة هدايا Steam بقيمة 10 دولار',
        cost: 1500,
        category: 'gift',
        available: true,
      },
      {
        id: 'gift_2',
        name: 'Amazon Gift Card $25',
        nameAr: 'بطاقة هدايا Amazon بقيمة 25 دولار',
        description: '$25 Amazon Gift Card',
        descriptionAr: 'بطاقة هدايا Amazon بقيمة 25 دولار',
        cost: 3500,
        category: 'gift',
        available: true,
      },
      {
        id: 'tools_1',
        name: 'OBS Studio Setup Guide',
        nameAr: 'دليل إعداد OBS Studio',
        description: 'Complete OBS setup and optimization guide',
        descriptionAr: 'دليل كامل لإعداد وتحسين OBS',
        cost: 200,
        category: 'tools',
        available: true,
      },
      {
        id: 'coaching_1',
        name: 'Streaming Coaching Session (1 hour)',
        nameAr: 'جلسة تدريب على البث (ساعة واحدة)',
        description: 'One-on-one coaching session with experienced streamer',
        descriptionAr: 'جلسة تدريب فردية مع ستريمر محترف',
        cost: 1200,
        category: 'coaching',
        available: true,
      },
    ];

    for (const reward of rewards) {
      await Reward.findOneAndUpdate({ id: reward.id }, reward, { upsert: true });
    }

    logger.info('Rewards initialized');
  } catch (error) {
    logger.error('Error initializing default data:', error);
    throw error;
  }
}
