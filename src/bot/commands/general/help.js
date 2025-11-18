import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { t } from '../../utils/language.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setNameLocalizations({
      ar: 'مساعدة',
    })
    .setDescription('Get help with bot commands | احصل على مساعدة بأوامر البوت')
    .addStringOption(option =>
      option
        .setName('language')
        .setNameLocalizations({ ar: 'اللغة' })
        .setDescription('Choose language | اختر اللغة')
        .setRequired(false)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'العربية', value: 'ar' }
        )
    ),

  async execute(interaction) {
    const lang = interaction.options.getString('language') || 'ar';
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(lang === 'en' ? '❓ Full Streamer System - Help' : '❓ نظام الستريمر الشامل - المساعدة')
      .setDescription(
        lang === 'en' 
          ? 'Here are all available commands:' 
          : 'هنا جميع الأوامر المتاحة:'
      )
      .addFields(
        {
          name: lang === 'en' ? '📝 Application System' : '📝 نظام التقديم',
          value: lang === 'en'
            ? '`/apply` - Apply to join as a streamer'
            : '`/apply` - تقديم طلب للانضمام كـ ستريمر',
          inline: false,
        },
        {
          name: lang === 'en' ? '🎫 Ticket System' : '🎫 نظام التذاكر',
          value: lang === 'en'
            ? '`/ticket create` - Create a new ticket\n`/ticket close` - Close a ticket\n`/ticket list` - List your tickets'
            : '`/ticket create` - إنشاء تذكرة جديدة\n`/ticket close` - إغلاق تذكرة\n`/ticket list` - عرض تذاكرك',
          inline: false,
        },
        {
          name: lang === 'en' ? '💰 Credit System' : '💰 نظام الكريدت',
          value: lang === 'en'
            ? '`/credits balance` - Check your credit balance\n`/credits transfer` - Transfer credits to another user\n`/credits history` - View transaction history'
            : '`/credits balance` - التحقق من رصيد الكريدت\n`/credits transfer` - تحويل كريدت لعضو آخر\n`/credits history` - عرض سجل المعاملات',
          inline: false,
        },
        {
          name: lang === 'en' ? '🏪 Rewards Store' : '🏪 متجر المكافآت',
          value: lang === 'en'
            ? '`/rewards list` - View available rewards\n`/rewards buy` - Purchase a reward'
            : '`/rewards list` - عرض المكافآت المتاحة\n`/rewards buy` - شراء مكافأة',
          inline: false,
        },
        {
          name: lang === 'en' ? '📊 Analytics' : '📊 التحليلات',
          value: lang === 'en'
            ? '`/analytics view` - View your performance analytics\n`/analytics weekly` - Weekly report\n`/analytics monthly` - Monthly report'
            : '`/analytics view` - عرض تحليلات أدائك\n`/analytics weekly` - التقرير الأسبوعي\n`/analytics monthly` - التقرير الشهري',
          inline: false,
        },
        {
          name: lang === 'en' ? '📅 Schedule' : '📅 الجدول',
          value: lang === 'en'
            ? '`/schedule add` - Add a streaming schedule\n`/schedule remove` - Remove a schedule\n`/schedule view` - View your schedule'
            : '`/schedule add` - إضافة جدول بث\n`/schedule remove` - إزالة جدول\n`/schedule view` - عرض جدولك',
          inline: false,
        },
        {
          name: lang === 'en' ? '🔗 Platform Connection' : '🔗 ربط المنصات',
          value: lang === 'en'
            ? '`/connect` - Connect your streaming platforms'
            : '`/connect` - ربط منصات البث الخاصة بك',
          inline: false,
        },
        {
          name: lang === 'en' ? '⚙️ Settings' : '⚙️ الإعدادات',
          value: lang === 'en'
            ? '`/settings language` - Change bot language\n`/settings profile` - Update your profile'
            : '`/settings language` - تغيير لغة البوت\n`/settings profile` - تحديث ملفك الشخصي',
          inline: false,
        }
      )
      .setFooter({ 
        text: lang === 'en' 
          ? 'Full Streamer System | Use /help [language] to switch language' 
          : 'نظام الستريمر الشامل | استخدم /help [language] لتبديل اللغة'
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
