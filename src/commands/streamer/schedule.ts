import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { Streamer } from '../../models/Streamer';
import { t } from '../../utils/i18n';
import { isStreamer } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setNameLocalizations({ ar: 'الجدول' })
    .setDescription('Manage your streaming schedule')
    .setDescriptionLocalizations({ ar: 'إدارة جدول البث الخاص بك' })
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setNameLocalizations({ ar: 'إضافة' })
        .setDescription('Add a scheduled stream')
        .setDescriptionLocalizations({ ar: 'إضافة بث مجدول' })
        .addStringOption(option =>
          option
            .setName('day')
            .setNameLocalizations({ ar: 'اليوم' })
            .setDescription('Day of the week')
            .setDescriptionLocalizations({ ar: 'يوم من الأسبوع' })
            .setRequired(true)
            .addChoices(
              { name: 'Monday', value: 'monday' },
              { name: 'Tuesday', value: 'tuesday' },
              { name: 'Wednesday', value: 'wednesday' },
              { name: 'Thursday', value: 'thursday' },
              { name: 'Friday', value: 'friday' },
              { name: 'Saturday', value: 'saturday' },
              { name: 'Sunday', value: 'sunday' }
            )
        )
        .addStringOption(option =>
          option
            .setName('start_time')
            .setNameLocalizations({ ar: 'وقت_البدء' })
            .setDescription('Start time (HH:MM format)')
            .setDescriptionLocalizations({ ar: 'وقت البدء (صيغة HH:MM)' })
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('end_time')
            .setNameLocalizations({ ar: 'وقت_الانتهاء' })
            .setDescription('End time (HH:MM format)')
            .setDescriptionLocalizations({ ar: 'وقت الانتهاء (صيغة HH:MM)' })
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('platform')
            .setNameLocalizations({ ar: 'المنصة' })
            .setDescription('Streaming platform')
            .setDescriptionLocalizations({ ar: 'منصة البث' })
            .setRequired(true)
            .addChoices(
              { name: 'YouTube', value: 'youtube' },
              { name: 'Twitch', value: 'twitch' },
              { name: 'TikTok', value: 'tiktok' },
              { name: 'Kick', value: 'kick' },
              { name: 'Instagram', value: 'instagram' },
              { name: 'Facebook', value: 'facebook' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setNameLocalizations({ ar: 'عرض' })
        .setDescription('View your schedule')
        .setDescriptionLocalizations({ ar: 'عرض جدولك' })
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setNameLocalizations({ ar: 'حذف' })
        .setDescription('Clear your schedule')
        .setDescriptionLocalizations({ ar: 'حذف جدولك' })
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
      if (subcommand === 'add') {
        const day = interaction.options.get('day')?.value as string;
        const startTime = interaction.options.get('start_time')?.value as string;
        const endTime = interaction.options.get('end_time')?.value as string;
        const platform = interaction.options.get('platform')?.value as string;

        const streamer = await Streamer.findOneAndUpdate(
          { userId: interaction.user.id },
          {
            $push: {
              schedule: {
                day,
                startTime,
                endTime,
                platform,
              },
            },
          },
          { upsert: true, new: true }
        );

        await interaction.reply({
          content: t('commands.schedule.set'),
          ephemeral: true,
        });
      } else if (subcommand === 'view') {
        const streamer = await Streamer.findOne({ userId: interaction.user.id });

        if (!streamer || streamer.schedule.length === 0) {
          return interaction.reply({
            content: 'No schedule set yet.',
            ephemeral: true,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle(t('commands.schedule.view'))
          .setColor(0x0099ff)
          .setDescription(
            streamer.schedule
              .map(
                (s, i) =>
                  `**${i + 1}.** ${s.day} - ${s.startTime} to ${s.endTime} on ${s.platform}`
              )
              .join('\n')
          );

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else if (subcommand === 'clear') {
        await Streamer.findOneAndUpdate(
          { userId: interaction.user.id },
          { schedule: [] }
        );

        await interaction.reply({
          content: 'Schedule cleared successfully!',
          ephemeral: true,
        });
      }
    } catch (error) {
      await interaction.reply({
        content: t('errors.database_error'),
        ephemeral: true,
      });
    }
  },
};
