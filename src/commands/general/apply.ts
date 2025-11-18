import { SlashCommandBuilder, CommandInteraction, GuildMember } from 'discord.js';
import { TicketService } from '../../services/TicketService';
import { t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setNameLocalizations({
      ar: 'تقديم',
    })
    .setDescription('Submit application to become a streamer')
    .setDescriptionLocalizations({
      ar: 'تقديم طلب للانضمام كستريمر',
    })
    .addStringOption(option =>
      option
        .setName('platform')
        .setNameLocalizations({ ar: 'المنصة' })
        .setDescription('Your primary streaming platform')
        .setDescriptionLocalizations({ ar: 'منصة البث الأساسية الخاصة بك' })
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
        .setNameLocalizations({ ar: 'القناة' })
        .setDescription('Your channel/username on the platform')
        .setDescriptionLocalizations({ ar: 'اسم قناتك/حسابك على المنصة' })
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('experience')
        .setNameLocalizations({ ar: 'الخبرة' })
        .setDescription('Brief description of your streaming experience')
        .setDescriptionLocalizations({ ar: 'وصف مختصر لخبرتك في البث' })
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
