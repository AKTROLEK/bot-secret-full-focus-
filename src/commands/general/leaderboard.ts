import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { AnalyticsService } from '../../services/AnalyticsService';
import { t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View top streamers')
    .addStringOption(option =>
      option
        .setName('period')
        .setDescription('Time period')
        .addChoices(
          { name: 'Weekly', value: 'week' },
          { name: 'Monthly', value: 'month' }
        )
    ),

  async execute(interaction: CommandInteraction) {
    const period = (interaction.options.get('period')?.value as 'week' | 'month') || 'week';

    try {
      const topStreamers = await AnalyticsService.getTopStreamers(3, period);

      const embed = new EmbedBuilder()
        .setTitle(t('commands.leaderboard.title'))
        .setColor(0xffd700)
        .setDescription(
          topStreamers.length > 0
            ? topStreamers
                .map(
                  s =>
                    `**${s.rank}. ${s.username}**\n📹 Videos: ${s.videos} | ⏱️ Hours: ${s.streamHours} | 💰 Credits: ${s.credits}`
                )
                .join('\n\n')
            : 'No data available yet'
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({
        content: t('errors.database_error'),
        ephemeral: true,
      });
    }
  },
};
