import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('analytics')
    .setNameLocalizations({ ar: 'تحليلات' })
    .setDescription('View performance analytics | عرض تحليلات الأداء')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setNameLocalizations({ ar: 'عرض' })
        .setDescription('View your overall analytics | عرض تحليلاتك الشاملة')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('weekly')
        .setNameLocalizations({ ar: 'أسبوعي' })
        .setDescription('View weekly report | عرض التقرير الأسبوعي')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('monthly')
        .setNameLocalizations({ ar: 'شهري' })
        .setDescription('View monthly report | عرض التقرير الشهري')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setNameLocalizations({ ar: 'المتصدرين' })
        .setDescription('View top streamers | عرض أفضل الستريمرز')
    ),

  async execute(interaction) {
    const lang = 'ar';
    const subcommand = interaction.options.getSubcommand();

    let streamer = await prisma.streamer.findUnique({
      where: { discordId: interaction.user.id },
      include: {
        platforms: true,
        analytics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!streamer && subcommand !== 'leaderboard') {
      return interaction.reply({
        content: lang === 'en' 
          ? '❌ You are not registered as a streamer yet. Use /apply to apply.' 
          : '❌ لست مسجلاً كـ ستريمر بعد. استخدم /apply للتقديم.',
        ephemeral: true,
      });
    }

    if (subcommand === 'view') {
      const embed = new EmbedBuilder()
        .setColor('#4a90e2')
        .setTitle('📊 ' + (lang === 'en' ? 'Performance Analytics' : 'تحليلات الأداء'))
        .setDescription(`**${interaction.user.username}**`)
        .addFields(
          { 
            name: lang === 'en' ? '🎥 Total Videos' : '🎥 إجمالي المقاطع', 
            value: `${streamer.totalVideos}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '⏱️ Total Stream Hours' : '⏱️ إجمالي ساعات البث', 
            value: `${streamer.totalStreamHours.toFixed(1)}h`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '💰 Total Credits' : '💰 إجمالي الكريدت', 
            value: `${streamer.totalCredits.toLocaleString()}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '📹 This Week Videos' : '📹 مقاطع هذا الأسبوع', 
            value: `${streamer.weeklyVideos}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '🔴 This Week Stream Hours' : '🔴 ساعات البث هذا الأسبوع', 
            value: `${streamer.weeklyStreamHours.toFixed(1)}h`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '📱 Connected Platforms' : '📱 المنصات المتصلة', 
            value: streamer.platforms.length > 0 
              ? streamer.platforms.map(p => p.platform).join(', ') 
              : (lang === 'en' ? 'None' : 'لا يوجد'), 
            inline: true 
          }
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'Use /analytics weekly or /analytics monthly for detailed reports' 
            : 'استخدم /analytics weekly أو /analytics monthly للتقارير التفصيلية'
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyAnalytics = await prisma.analytics.findMany({
        where: {
          streamerId: streamer.id,
          date: { gte: oneWeekAgo },
        },
        orderBy: { date: 'desc' },
      });

      const totalVideos = weeklyAnalytics.reduce((sum, a) => sum + a.videos, 0);
      const totalHours = weeklyAnalytics.reduce((sum, a) => sum + a.streamHours, 0);
      const totalViews = weeklyAnalytics.reduce((sum, a) => sum + a.views, 0);
      const avgEngagement = weeklyAnalytics.length > 0 
        ? (weeklyAnalytics.reduce((sum, a) => sum + a.engagement, 0) / weeklyAnalytics.length).toFixed(2)
        : 0;

      const embed = new EmbedBuilder()
        .setColor('#4caf50')
        .setTitle('📅 ' + (lang === 'en' ? 'Weekly Report' : 'التقرير الأسبوعي'))
        .setDescription(`**${interaction.user.username}**\n${lang === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}`)
        .addFields(
          { 
            name: lang === 'en' ? '🎥 Videos Published' : '🎥 المقاطع المنشورة', 
            value: `${totalVideos}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '⏱️ Stream Hours' : '⏱️ ساعات البث', 
            value: `${totalHours.toFixed(1)}h`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '👁️ Total Views' : '👁️ إجمالي المشاهدات', 
            value: `${totalViews.toLocaleString()}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '❤️ Avg Engagement' : '❤️ متوسط التفاعل', 
            value: `${avgEngagement}%`, 
            inline: true 
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const monthlyAnalytics = await prisma.analytics.findMany({
        where: {
          streamerId: streamer.id,
          date: { gte: oneMonthAgo },
        },
        orderBy: { date: 'desc' },
      });

      const totalVideos = monthlyAnalytics.reduce((sum, a) => sum + a.videos, 0);
      const totalHours = monthlyAnalytics.reduce((sum, a) => sum + a.streamHours, 0);
      const totalViews = monthlyAnalytics.reduce((sum, a) => sum + a.views, 0);
      const avgEngagement = monthlyAnalytics.length > 0 
        ? (monthlyAnalytics.reduce((sum, a) => sum + a.engagement, 0) / monthlyAnalytics.length).toFixed(2)
        : 0;

      const embed = new EmbedBuilder()
        .setColor('#2196f3')
        .setTitle('📆 ' + (lang === 'en' ? 'Monthly Report' : 'التقرير الشهري'))
        .setDescription(`**${interaction.user.username}**\n${lang === 'en' ? 'Last 30 Days' : 'آخر 30 يوم'}`)
        .addFields(
          { 
            name: lang === 'en' ? '🎥 Videos Published' : '🎥 المقاطع المنشورة', 
            value: `${totalVideos}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '⏱️ Stream Hours' : '⏱️ ساعات البث', 
            value: `${totalHours.toFixed(1)}h`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '👁️ Total Views' : '👁️ إجمالي المشاهدات', 
            value: `${totalViews.toLocaleString()}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '❤️ Avg Engagement' : '❤️ متوسط التفاعل', 
            value: `${avgEngagement}%`, 
            inline: true 
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'leaderboard') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get top streamers by weekly performance
      const topStreamers = await prisma.streamer.findMany({
        where: {
          isActive: true,
          status: 'approved',
        },
        orderBy: [
          { weeklyVideos: 'desc' },
          { weeklyStreamHours: 'desc' },
        ],
        take: 10,
      });

      if (topStreamers.length === 0) {
        return interaction.reply({
          content: lang === 'en' 
            ? '📭 No active streamers found.' 
            : '📭 لا يوجد ستريمرز نشطين.',
          ephemeral: true,
        });
      }

      const medals = ['🥇', '🥈', '🥉'];
      
      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🏆 ' + (lang === 'en' ? 'Top Streamers This Week' : 'أفضل الستريمرز هذا الأسبوع'))
        .setDescription(
          topStreamers
            .slice(0, 10)
            .map((s, i) => {
              const medal = i < 3 ? medals[i] : `${i + 1}.`;
              return `${medal} **${s.username}**\n📹 ${s.weeklyVideos} ${lang === 'en' ? 'videos' : 'مقطع'} | ⏱️ ${s.weeklyStreamHours.toFixed(1)}h`;
            })
            .join('\n\n')
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'Rankings reset weekly' 
            : 'يتم إعادة تعيين التصنيفات أسبوعياً'
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
