import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rewards')
    .setNameLocalizations({ ar: 'مكافآت' })
    .setDescription('Rewards store commands | أوامر متجر المكافآت')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setNameLocalizations({ ar: 'قائمة' })
        .setDescription('View available rewards | عرض المكافآت المتاحة')
        .addStringOption(option =>
          option
            .setName('category')
            .setNameLocalizations({ ar: 'الفئة' })
            .setDescription('Filter by category | التصفية حسب الفئة')
            .setRequired(false)
            .addChoices(
              { name: 'Rank Upgrade | ترقية رتبة', value: 'rank_upgrade' },
              { name: 'Promotion | ترويج', value: 'promotion' },
              { name: 'Editing Services | خدمات مونتاج', value: 'editing' },
              { name: 'Gift Cards | قيفت كاردات', value: 'gift_card' },
              { name: 'Tools | أدوات', value: 'tools' },
              { name: 'Coaching | تدريب', value: 'coaching' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setNameLocalizations({ ar: 'شراء' })
        .setDescription('Purchase a reward | شراء مكافأة')
        .addStringOption(option =>
          option
            .setName('reward-id')
            .setNameLocalizations({ ar: 'رقم-المكافأة' })
            .setDescription('Reward ID | رقم المكافأة')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const lang = 'ar';
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'list') {
      const category = interaction.options.getString('category');
      
      const where = { isAvailable: true };
      if (category) where.category = category;

      const rewards = await prisma.reward.findMany({ where });

      if (rewards.length === 0) {
        return interaction.reply({
          content: lang === 'en' 
            ? '📭 No rewards available in this category.' 
            : '📭 لا توجد مكافآت متاحة في هذه الفئة.',
          ephemeral: true,
        });
      }

      const categoryEmojis = {
        rank_upgrade: '⬆️',
        promotion: '📢',
        editing: '✂️',
        gift_card: '🎁',
        tools: '🛠️',
        coaching: '🎓',
      };

      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('🏪 ' + (lang === 'en' ? 'Rewards Store' : 'متجر المكافآت'))
        .setDescription(
          rewards
            .slice(0, 10)
            .map(r => {
              const emoji = categoryEmojis[r.category] || '🎁';
              const stock = r.stock ? ` (${r.stock} ${lang === 'en' ? 'left' : 'متبقي'})` : '';
              return `${emoji} **${lang === 'ar' ? r.nameAr : r.nameEn}**\n${lang === 'ar' ? r.descriptionAr : r.descriptionEn}\n💰 **${r.cost}** ${lang === 'en' ? 'Credits' : 'كريدت'}${stock}\nID: \`${r.id}\``;
            })
            .join('\n\n')
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'Use /rewards buy [reward-id] to purchase' 
            : 'استخدم /rewards buy [رقم-المكافأة] للشراء'
        });

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'buy') {
      const rewardId = interaction.options.getString('reward-id');

      const reward = await prisma.reward.findUnique({
        where: { id: rewardId },
      });

      if (!reward) {
        return interaction.reply({
          content: lang === 'en' ? '❌ Reward not found.' : '❌ المكافأة غير موجودة.',
          ephemeral: true,
        });
      }

      if (!reward.isAvailable) {
        return interaction.reply({
          content: lang === 'en' ? '❌ This reward is not available.' : '❌ هذه المكافأة غير متاحة.',
          ephemeral: true,
        });
      }

      if (reward.stock !== null && reward.stock <= 0) {
        return interaction.reply({
          content: lang === 'en' ? '❌ This reward is out of stock.' : '❌ هذه المكافأة غير متوفرة.',
          ephemeral: true,
        });
      }

      let streamer = await prisma.streamer.findUnique({
        where: { discordId: interaction.user.id },
      });

      if (!streamer) {
        streamer = await prisma.streamer.create({
          data: {
            discordId: interaction.user.id,
            username: interaction.user.username,
          },
        });
      }

      if (streamer.totalCredits < reward.cost) {
        return interaction.reply({
          content: lang === 'en' 
            ? `❌ Insufficient credits. You need ${reward.cost} credits but have ${streamer.totalCredits}.` 
            : `❌ رصيد غير كافٍ. تحتاج ${reward.cost} كريدت ولديك ${streamer.totalCredits}.`,
          ephemeral: true,
        });
      }

      // Process purchase
      await prisma.$transaction([
        // Deduct credits
        prisma.streamer.update({
          where: { id: streamer.id },
          data: { totalCredits: { decrement: reward.cost } },
        }),
        // Create transaction
        prisma.creditTransaction.create({
          data: {
            streamerId: streamer.id,
            amount: -reward.cost,
            type: 'purchase',
            description: `${lang === 'en' ? 'Purchased' : 'شراء'}: ${lang === 'ar' ? reward.nameAr : reward.nameEn}`,
            rewardId: reward.id,
          },
        }),
        // Create purchase record
        prisma.rewardPurchase.create({
          data: {
            streamerId: streamer.id,
            rewardId: reward.id,
            status: 'pending',
          },
        }),
        // Update stock if applicable
        ...(reward.stock !== null ? [
          prisma.reward.update({
            where: { id: reward.id },
            data: { stock: { decrement: 1 } },
          })
        ] : []),
      ]);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ ' + (lang === 'en' ? 'Purchase Successful' : 'تم الشراء بنجاح'))
        .setDescription(
          `**${lang === 'ar' ? reward.nameAr : reward.nameEn}**\n\n${lang === 'ar' ? reward.descriptionAr : reward.descriptionEn}`
        )
        .addFields(
          { 
            name: lang === 'en' ? 'Cost' : 'التكلفة', 
            value: `${reward.cost} ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: true 
          },
          { 
            name: lang === 'en' ? 'New Balance' : 'الرصيد الجديد', 
            value: `${(streamer.totalCredits - reward.cost).toLocaleString()} ${lang === 'en' ? 'Credits' : 'كريدت'}`, 
            inline: true 
          }
        )
        .setFooter({ 
          text: lang === 'en' 
            ? 'Your purchase is being processed. Staff will contact you soon.' 
            : 'جاري معالجة طلبك. سيتواصل معك الإدارة قريباً.'
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
