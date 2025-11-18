import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setNameLocalizations({ ar: 'كريدت' })
    .setDescription('Credit system commands | أوامر نظام الكريدت')
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setNameLocalizations({ ar: 'الرصيد' })
        .setDescription('Check your credit balance | التحقق من رصيد الكريدت')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('transfer')
        .setNameLocalizations({ ar: 'تحويل' })
        .setDescription('Transfer credits to another user | تحويل كريدت لعضو آخر')
        .addUserOption(option =>
          option
            .setName('user')
            .setNameLocalizations({ ar: 'المستخدم' })
            .setDescription('User to transfer to | المستخدم المستلم')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setNameLocalizations({ ar: 'المبلغ' })
            .setDescription('Amount to transfer | المبلغ المراد تحويله')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('history')
        .setNameLocalizations({ ar: 'السجل' })
        .setDescription('View your transaction history | عرض سجل معاملاتك')
        .addIntegerOption(option =>
          option
            .setName('limit')
            .setNameLocalizations({ ar: 'العدد' })
            .setDescription('Number of transactions to show | عدد المعاملات للعرض')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
    ),

  async execute(interaction) {
    const lang = 'ar';
    const subcommand = interaction.options.getSubcommand();

    // Get or create streamer
    let streamer = await prisma.streamer.findUnique({
      where: { discordId: interaction.user.id },
      include: {
        credits: {
          orderBy: { createdAt: 'desc' },
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

    if (subcommand === 'balance') {
      const totalCredits = streamer.totalCredits;
      
      // Calculate earned and spent
      const earned = streamer.credits
        .filter(c => c.amount > 0)
        .reduce((sum, c) => sum + c.amount, 0);
      
      const spent = Math.abs(
        streamer.credits
          .filter(c => c.amount < 0)
          .reduce((sum, c) => sum + c.amount, 0)
      );

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('💰 ' + (lang === 'en' ? 'Credit Balance' : 'رصيد الكريدت'))
        .setDescription(`**${interaction.user.username}**`)
        .addFields(
          { 
            name: lang === 'en' ? '💵 Current Balance' : '💵 الرصيد الحالي', 
            value: `**${totalCredits.toLocaleString()}** ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: false 
          },
          { 
            name: lang === 'en' ? '📈 Total Earned' : '📈 إجمالي المكتسب', 
            value: `${earned.toLocaleString()} ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? '📉 Total Spent' : '📉 إجمالي المنفق', 
            value: `${spent.toLocaleString()} ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: true 
          }
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'Use /credits history to view transactions' 
            : 'استخدم /credits history لعرض المعاملات'
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'transfer') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (targetUser.id === interaction.user.id) {
        return interaction.reply({
          content: lang === 'en' 
            ? '❌ You cannot transfer credits to yourself.' 
            : '❌ لا يمكنك تحويل كريدت لنفسك.',
          ephemeral: true,
        });
      }

      if (targetUser.bot) {
        return interaction.reply({
          content: lang === 'en' 
            ? '❌ You cannot transfer credits to a bot.' 
            : '❌ لا يمكنك تحويل كريدت لبوت.',
          ephemeral: true,
        });
      }

      if (streamer.totalCredits < amount) {
        return interaction.reply({
          content: lang === 'en' 
            ? `❌ Insufficient credits. You have ${streamer.totalCredits} credits.` 
            : `❌ رصيد غير كافٍ. لديك ${streamer.totalCredits} كريدت.`,
          ephemeral: true,
        });
      }

      // Get or create target streamer
      let targetStreamer = await prisma.streamer.findUnique({
        where: { discordId: targetUser.id },
      });

      if (!targetStreamer) {
        targetStreamer = await prisma.streamer.create({
          data: {
            discordId: targetUser.id,
            username: targetUser.username,
          },
        });
      }

      // Perform transfer
      await prisma.$transaction([
        // Deduct from sender
        prisma.streamer.update({
          where: { id: streamer.id },
          data: { totalCredits: { decrement: amount } },
        }),
        // Add to receiver
        prisma.streamer.update({
          where: { id: targetStreamer.id },
          data: { totalCredits: { increment: amount } },
        }),
        // Create sender transaction
        prisma.creditTransaction.create({
          data: {
            streamerId: streamer.id,
            amount: -amount,
            type: 'transfer',
            description: `${lang === 'en' ? 'Transferred to' : 'تحويل إلى'} ${targetUser.username}`,
            toStreamerId: targetStreamer.id,
          },
        }),
        // Create receiver transaction
        prisma.creditTransaction.create({
          data: {
            streamerId: targetStreamer.id,
            amount: amount,
            type: 'transfer',
            description: `${lang === 'en' ? 'Received from' : 'استلام من'} ${interaction.user.username}`,
            fromStreamerId: streamer.id,
          },
        }),
      ]);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ ' + (lang === 'en' ? 'Transfer Successful' : 'تم التحويل بنجاح'))
        .setDescription(
          lang === 'en'
            ? `Successfully transferred **${amount}** credits to ${targetUser.tag}`
            : `تم تحويل **${amount}** كريدت إلى ${targetUser.tag} بنجاح`
        )
        .addFields(
          { 
            name: lang === 'en' ? 'Your New Balance' : 'رصيدك الجديد', 
            value: `${(streamer.totalCredits - amount).toLocaleString()} ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: false 
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      // Notify recipient
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('💰 ' + (lang === 'en' ? 'Credits Received' : 'استلام كريدت'))
          .setDescription(
            lang === 'en'
              ? `You received **${amount}** credits from ${interaction.user.tag}!`
              : `استلمت **${amount}** كريدت من ${interaction.user.tag}!`
          )
          .setTimestamp();

        await targetUser.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.log('Could not send DM to recipient');
      }

    } else if (subcommand === 'history') {
      const limit = interaction.options.getInteger('limit') || 10;
      
      const transactions = await prisma.creditTransaction.findMany({
        where: { streamerId: streamer.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      if (transactions.length === 0) {
        return interaction.reply({
          content: lang === 'en' 
            ? '📭 No transaction history found.' 
            : '📭 لا يوجد سجل معاملات.',
          ephemeral: true,
        });
      }

      const typeEmojis = {
        video_upload: '🎥',
        stream_start: '🔴',
        weekly_goal: '🎯',
        engagement: '❤️',
        purchase: '🛒',
        penalty: '⚠️',
        bonus: '🎁',
        transfer: '💸',
      };

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📜 ' + (lang === 'en' ? 'Transaction History' : 'سجل المعاملات'))
        .setDescription(
          transactions
            .map((t, i) => {
              const emoji = typeEmojis[t.type] || '📝';
              const sign = t.amount > 0 ? '+' : '';
              const color = t.amount > 0 ? '🟢' : '🔴';
              return `${color} ${emoji} **${sign}${t.amount}** - ${t.description}\n📅 ${new Date(t.createdAt).toLocaleDateString('ar-EG')}`;
            })
            .join('\n\n')
        )
        .setFooter({ 
          text: lang === 'en' 
            ? `Showing ${transactions.length} most recent transactions` 
            : `عرض آخر ${transactions.length} معاملة`
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
