import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { PlatformRule } from '../../models/PlatformRule';
import { t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('View platform streaming requirements')
    .addStringOption(option =>
      option
        .setName('platform')
        .setDescription('Platform to view rules for')
        .addChoices(
          { name: 'YouTube', value: 'youtube' },
          { name: 'Twitch', value: 'twitch' },
          { name: 'TikTok', value: 'tiktok' },
          { name: 'Kick', value: 'kick' },
          { name: 'Instagram', value: 'instagram' },
          { name: 'Facebook Gaming', value: 'facebook' }
        )
    ),

  async execute(interaction: CommandInteraction) {
    const platform = interaction.options.get('platform')?.value as string | undefined;

    try {
      if (platform) {
        const rule = await PlatformRule.findOne({ platform });

        if (!rule) {
          return interaction.reply({
            content: `No rules found for ${platform}`,
            ephemeral: true,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle(`${platform.toUpperCase()} Streaming Requirements`)
          .setColor(0x00ff00)
          .addFields(
            { name: 'Min Videos Per Week', value: rule.minVideosPerWeek.toString(), inline: true },
            { name: 'Min Stream Hours Per Week', value: rule.minStreamHoursPerWeek.toString(), inline: true },
            { name: 'Content Type', value: rule.contentType, inline: false }
          )
          .setTimestamp();

        if (rule.requirements && rule.requirements.length > 0) {
          embed.addFields({
            name: 'Additional Requirements',
            value: rule.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n'),
          });
        }

        await interaction.reply({ embeds: [embed] });
      } else {
        const rules = await PlatformRule.find();

        if (rules.length === 0) {
          return interaction.reply({
            content: 'No platform rules configured yet.',
            ephemeral: true,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle('Platform Streaming Requirements')
          .setColor(0x0099ff)
          .setDescription(
            rules
              .map(
                r =>
                  `**${r.platform.toUpperCase()}**\n` +
                  `📹 Videos: ${r.minVideosPerWeek}/week | ⏱️ Hours: ${r.minStreamHoursPerWeek}/week\n` +
                  `Type: ${r.contentType}`
              )
              .join('\n\n')
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({
        content: t('errors.database_error'),
        ephemeral: true,
      });
    }
  },
};
