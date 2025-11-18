import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setNameLocalizations({ ar: 'جدول' })
    .setDescription('Manage your streaming schedule | إدارة جدول البث')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setNameLocalizations({ ar: 'إضافة' })
        .setDescription('Add a streaming schedule | إضافة جدول بث')
        .addIntegerOption(option =>
          option
            .setName('day')
            .setNameLocalizations({ ar: 'اليوم' })
            .setDescription('Day of week | يوم الأسبوع')
            .setRequired(true)
            .addChoices(
              { name: 'Sunday | الأحد', value: 0 },
              { name: 'Monday | الإثنين', value: 1 },
              { name: 'Tuesday | الثلاثاء', value: 2 },
              { name: 'Wednesday | الأربعاء', value: 3 },
              { name: 'Thursday | الخميس', value: 4 },
              { name: 'Friday | الجمعة', value: 5 },
              { name: 'Saturday | السبت', value: 6 }
            )
        )
        .addStringOption(option =>
          option
            .setName('start-time')
            .setNameLocalizations({ ar: 'وقت-البدء' })
            .setDescription('Start time (HH:MM 24h format) | وقت البدء (HH:MM صيغة 24 ساعة)')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('end-time')
            .setNameLocalizations({ ar: 'وقت-الانتهاء' })
            .setDescription('End time (HH:MM 24h format) | وقت الانتهاء (HH:MM صيغة 24 ساعة)')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('platform')
            .setNameLocalizations({ ar: 'المنصة' })
            .setDescription('Platform | المنصة')
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
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setNameLocalizations({ ar: 'عرض' })
        .setDescription('View your schedule | عرض جدولك')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setNameLocalizations({ ar: 'إزالة' })
        .setDescription('Remove a schedule | إزالة جدول')
        .addStringOption(option =>
          option
            .setName('schedule-id')
            .setNameLocalizations({ ar: 'رقم-الجدول' })
            .setDescription('Schedule ID | رقم الجدول')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const lang = 'ar';
    const subcommand = interaction.options.getSubcommand();

    let streamer = await prisma.streamer.findUnique({
      where: { discordId: interaction.user.id },
      include: {
        schedule: {
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!streamer) {
      streamer = await prisma.streamer.create({
        data: {
          discordId: interaction.user.id,
          username: interaction.user.username,
        },
      });
    }

    if (subcommand === 'add') {
      const day = interaction.options.getInteger('day');
      const startTime = interaction.options.getString('start-time');
      const endTime = interaction.options.getString('end-time');
      const platform = interaction.options.getString('platform');

      // Validate time format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return interaction.reply({
          content: lang === 'en' 
            ? '❌ Invalid time format. Use HH:MM (24-hour format).' 
            : '❌ صيغة الوقت غير صحيحة. استخدم HH:MM (صيغة 24 ساعة).',
          ephemeral: true,
        });
      }

      const schedule = await prisma.streamSchedule.create({
        data: {
          streamerId: streamer.id,
          dayOfWeek: day,
          startTime,
          endTime,
          platform,
        },
      });

      const dayNames = {
        0: { en: 'Sunday', ar: 'الأحد' },
        1: { en: 'Monday', ar: 'الإثنين' },
        2: { en: 'Tuesday', ar: 'الثلاثاء' },
        3: { en: 'Wednesday', ar: 'الأربعاء' },
        4: { en: 'Thursday', ar: 'الخميس' },
        5: { en: 'Friday', ar: 'الجمعة' },
        6: { en: 'Saturday', ar: 'السبت' },
      };

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ ' + (lang === 'en' ? 'Schedule Added' : 'تم إضافة الجدول'))
        .addFields(
          { 
            name: lang === 'en' ? 'Day' : 'اليوم', 
            value: dayNames[day][lang], 
            inline: true 
          },
          { 
            name: lang === 'en' ? 'Time' : 'الوقت', 
            value: `${startTime} - ${endTime}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? 'Platform' : 'المنصة', 
            value: platform, 
            inline: true 
          }
        )
        .setFooter({ text: `Schedule ID: ${schedule.id}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'view') {
      if (streamer.schedule.length === 0) {
        return interaction.reply({
          content: lang === 'en' 
            ? '📭 You have no scheduled streams.' 
            : '📭 ليس لديك جدول بث.',
          ephemeral: true,
        });
      }

      const dayNames = {
        0: { en: 'Sunday', ar: 'الأحد' },
        1: { en: 'Monday', ar: 'الإثنين' },
        2: { en: 'Tuesday', ar: 'الثلاثاء' },
        3: { en: 'Wednesday', ar: 'الأربعاء' },
        4: { en: 'Thursday', ar: 'الخميس' },
        5: { en: 'Friday', ar: 'الجمعة' },
        6: { en: 'Saturday', ar: 'السبت' },
      };

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📅 ' + (lang === 'en' ? 'Your Streaming Schedule' : 'جدول البث الخاص بك'))
        .setDescription(
          streamer.schedule
            .map(s => {
              const status = s.isActive ? '✅' : '❌';
              return `${status} **${dayNames[s.dayOfWeek][lang]}**\n⏰ ${s.startTime} - ${s.endTime}\n📱 ${s.platform}\nID: \`${s.id}\``;
            })
            .join('\n\n')
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'You will receive reminders 1 hour before your streams' 
            : 'ستتلقى تذكيرات قبل ساعة من بثوثك'
        });

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'remove') {
      const scheduleId = interaction.options.getString('schedule-id');

      const schedule = await prisma.streamSchedule.findUnique({
        where: { id: scheduleId },
        include: { streamer: true },
      });

      if (!schedule) {
        return interaction.reply({
          content: lang === 'en' ? '❌ Schedule not found.' : '❌ الجدول غير موجود.',
          ephemeral: true,
        });
      }

      if (schedule.streamer.discordId !== interaction.user.id) {
        return interaction.reply({
          content: lang === 'en' 
            ? '⛔ You can only remove your own schedules.' 
            : '⛔ يمكنك فقط إزالة جداولك الخاصة.',
          ephemeral: true,
        });
      }

      await prisma.streamSchedule.delete({
        where: { id: scheduleId },
      });

      await interaction.reply({
        content: lang === 'en' 
          ? `✅ Schedule ${scheduleId} has been removed.` 
          : `✅ تم إزالة الجدول ${scheduleId}.`,
        ephemeral: true,
      });
    }
  },
};
