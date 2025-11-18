import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { AnalyticsService } from '../../services/AnalyticsService';
import { t } from '../../utils/i18n';
import { isStreamer } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your streaming statistics')
    .addSubcommand(subcommand =>
      subcommand
        .setName('weekly')
        .setDescription('View weekly statistics')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('monthly')
        .setDescription('View monthly statistics')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('total')
        .setDescription('View total statistics')
    ),

  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const subcommand = interaction.options.data[0].name;

    if (!isStreamer(member)) {
      return interaction.reply({
        content: t('errors.not_streamer'),
        ephemeral: true,
      });
    }

    try {
      let stats;
      let title;

      if (subcommand === 'weekly') {
        stats = await AnalyticsService.getWeeklyStats(interaction.user.id);
        title = t('commands.stats.weekly');
      } else if (subcommand === 'monthly') {
        stats = await AnalyticsService.getMonthlyStats(interaction.user.id);
        title = t('commands.stats.monthly');
      } else {
        stats = await AnalyticsService.getTotalStats(interaction.user.id);
        title = t('commands.stats.total');
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(0x0099ff)
        .addFields(
          { name: 'Videos', value: stats.weeklyVideos?.toString() || stats.monthlyVideos?.toString() || stats.totalVideos?.toString() || '0', inline: true },
          { name: 'Stream Hours', value: stats.weeklyStreamHours?.toString() || stats.monthlyStreamHours?.toString() || stats.totalStreamHours?.toString() || '0', inline: true },
          { name: 'Views', value: stats.weeklyViews?.toString() || stats.monthlyViews?.toString() || stats.totalViews?.toString() || '0', inline: true }
        )
        .setTimestamp();

      if (stats.credits !== undefined) {
        embed.addFields({ name: 'Credits', value: stats.credits.toString(), inline: true });
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      await interaction.reply({
        content: t('errors.database_error'),
        ephemeral: true,
      });
    }
  },
};
