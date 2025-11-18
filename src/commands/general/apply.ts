import { SlashCommandBuilder, CommandInteraction, GuildMember } from 'discord.js';
import { TicketService } from '../../services/TicketService';
import { t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Submit application to become a streamer')
    .addStringOption(option =>
      option
        .setName('platform')
        .setDescription('Your primary streaming platform')
        .setRequired(true)
        .addChoices(
          { name: 'YouTube', value: 'youtube' },
          { name: 'Twitch', value: 'twitch' },
          { name: 'TikTok', value: 'tiktok' },
          { name: 'Kick', value: 'kick' },
          { name: 'Instagram', value: 'instagram' },
          { name: 'Facebook Gaming', value: 'facebook' }
        )
    )
    .addStringOption(option =>
      option
        .setName('channel')
        .setDescription('Your channel/username on the platform')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('experience')
        .setDescription('Brief description of your streaming experience')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction, ticketService: TicketService) {
    const platform = interaction.options.get('platform')?.value as string;
    const channel = interaction.options.get('channel')?.value as string;
    const experience = interaction.options.get('experience')?.value as string;

    const content = `
**Platform:** ${platform}
**Channel/Username:** ${channel}
**Experience:** ${experience}
    `.trim();

    try {
      const member = interaction.member as GuildMember;
      const channelId = await ticketService.createTicket(
        interaction.user.id,
        member.displayName,
        'application',
        content
      );

      await interaction.reply({
        content: t('commands.apply.success'),
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error creating application:', error);
      await interaction.reply({
        content: t('commands.apply.error'),
        ephemeral: true,
      });
    }
  },
};
