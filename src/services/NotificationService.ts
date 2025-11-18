import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { Streamer } from '../models/Streamer';
import { PlatformRule } from '../models/PlatformRule';
import { config } from '../config/config';
import logger from '../utils/logger';

export class NotificationService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async sendStreamStartNotification(
    userId: string,
    username: string,
    platform: string,
    title?: string
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(config.discord.guildId);
      if (!guild) return;

      const channel = guild.channels.cache.get(config.channels.announcementChannel) as TextChannel;
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle(`🔴 ${username} is now LIVE!`)
        .setDescription(`Streaming on **${platform.toUpperCase()}**`)
        .setColor(0xff0000)
        .setTimestamp();

      if (title) {
        embed.addFields({ name: 'Stream Title', value: title });
      }

      await channel.send({ content: `<@${userId}>`, embeds: [embed] });
      logger.info(`Stream start notification sent for ${username}`);
    } catch (error) {
      logger.error('Error sending stream start notification:', error);
    }
  }

  async sendVideoPublishedNotification(
    userId: string,
    username: string,
    platform: string,
    title: string,
    url: string
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(config.discord.guildId);
      if (!guild) return;

      const channel = guild.channels.cache.get(config.channels.announcementChannel) as TextChannel;
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle(`📹 New Video Published!`)
        .setDescription(`**${username}** just uploaded a new video on **${platform.toUpperCase()}**`)
        .addFields({ name: 'Title', value: title }, { name: 'Link', value: url })
        .setColor(0x00ff00)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      logger.info(`Video published notification sent for ${username}`);
    } catch (error) {
      logger.error('Error sending video published notification:', error);
    }
  }

  async sendMilestoneNotification(
    userId: string,
    username: string,
    milestone: string
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(config.discord.guildId);
      if (!guild) return;

      const channel = guild.channels.cache.get(config.channels.announcementChannel) as TextChannel;
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle(`🎉 Milestone Achieved!`)
        .setDescription(`Congratulations to **${username}** for reaching **${milestone}**!`)
        .setColor(0xffd700)
        .setTimestamp();

      await channel.send({ content: `<@${userId}>`, embeds: [embed] });
      logger.info(`Milestone notification sent for ${username}: ${milestone}`);
    } catch (error) {
      logger.error('Error sending milestone notification:', error);
    }
  }

  async sendViolationWarning(
    userId: string,
    username: string,
    platform: string,
    reason: string
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(config.discord.guildId);
      if (!guild) return;

      const member = guild.members.cache.get(userId);
      if (!member) return;

      const embed = new EmbedBuilder()
        .setTitle(`⚠️ Platform Requirements Warning`)
        .setDescription(
          `You have not met the streaming requirements for **${platform.toUpperCase()}**`
        )
        .addFields({ name: 'Reason', value: reason })
        .setColor(0xff0000)
        .setFooter({ text: 'Please check /rules for platform requirements' })
        .setTimestamp();

      await member.send({ embeds: [embed] }).catch(() => {
        logger.warn(`Could not send DM to ${username}`);
      });

      logger.info(`Violation warning sent to ${username} for ${platform}`);
    } catch (error) {
      logger.error('Error sending violation warning:', error);
    }
  }

  async sendScheduleReminder(
    userId: string,
    username: string,
    platform: string,
    startTime: string
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(config.discord.guildId);
      if (!guild) return;

      const member = guild.members.cache.get(userId);
      if (!member) return;

      const embed = new EmbedBuilder()
        .setTitle(`⏰ Stream Reminder`)
        .setDescription(
          `Your scheduled stream on **${platform.toUpperCase()}** starts in 1 hour!`
        )
        .addFields({ name: 'Scheduled Time', value: startTime })
        .setColor(0x0099ff)
        .setTimestamp();

      await member.send({ embeds: [embed] }).catch(() => {
        logger.warn(`Could not send DM to ${username}`);
      });

      logger.info(`Schedule reminder sent to ${username} for ${platform}`);
    } catch (error) {
      logger.error('Error sending schedule reminder:', error);
    }
  }

  async checkStreamingRequirements(): Promise<void> {
    try {
      const streamers = await Streamer.find();
      const rules = await PlatformRule.find();

      for (const streamer of streamers) {
        for (const [platform, channelId] of Object.entries(streamer.platforms)) {
          if (!channelId) continue;

          const rule = rules.find(r => r.platform === platform);
          if (!rule) continue;

          const weeklyVideos = streamer.statistics.weeklyVideos || 0;
          const weeklyHours = streamer.statistics.weeklyStreamHours || 0;

          let violations: string[] = [];

          if (weeklyVideos < rule.minVideosPerWeek && rule.minVideosPerWeek > 0) {
            violations.push(
              `Insufficient videos: ${weeklyVideos}/${rule.minVideosPerWeek} required`
            );
          }

          if (weeklyHours < rule.minStreamHoursPerWeek && rule.minStreamHoursPerWeek > 0) {
            violations.push(
              `Insufficient stream hours: ${weeklyHours}/${rule.minStreamHoursPerWeek} required`
            );
          }

          if (violations.length > 0) {
            await this.sendViolationWarning(
              streamer.userId,
              streamer.username,
              platform,
              violations.join('\n')
            );
          }
        }
      }

      logger.info('Completed streaming requirements check');
    } catch (error) {
      logger.error('Error checking streaming requirements:', error);
    }
  }
}
