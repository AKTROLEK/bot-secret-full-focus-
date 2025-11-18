import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setNameLocalizations({ ar: 'تذكرة' })
    .setDescription('Ticket system commands | أوامر نظام التذاكر')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setNameLocalizations({ ar: 'إنشاء' })
        .setDescription('Create a new ticket | إنشاء تذكرة جديدة')
        .addStringOption(option =>
          option
            .setName('type')
            .setNameLocalizations({ ar: 'النوع' })
            .setDescription('Ticket type | نوع التذكرة')
            .setRequired(true)
            .addChoices(
              { name: '🐛 Issue | مشكلة', value: 'issue' },
              { name: '💰 Credit Request | طلب كريدت', value: 'credit_request' },
              { name: '📢 Promotion Request | طلب ترويج', value: 'promotion_request' },
              { name: '🆘 Support | دعم فني', value: 'support' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setNameLocalizations({ ar: 'إغلاق' })
        .setDescription('Close a ticket | إغلاق تذكرة')
        .addStringOption(option =>
          option
            .setName('ticket-id')
            .setNameLocalizations({ ar: 'رقم-التذكرة' })
            .setDescription('Ticket ID | رقم التذكرة')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setNameLocalizations({ ar: 'قائمة' })
        .setDescription('List your tickets | عرض تذاكرك')
    ),

  async execute(interaction) {
    const lang = 'ar';
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const ticketType = interaction.options.getString('type');
      
      // Get or create streamer
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

      // Create modal for ticket details
      const modal = new ModalBuilder()
        .setCustomId(`ticket-modal-${ticketType}`)
        .setTitle(lang === 'en' ? 'Create Ticket' : 'إنشاء تذكرة');

      const titleInput = new TextInputBuilder()
        .setCustomId('ticket-title')
        .setLabel(lang === 'en' ? 'Title' : 'العنوان')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('ticket-description')
        .setLabel(lang === 'en' ? 'Description' : 'الوصف')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const firstRow = new ActionRowBuilder().addComponents(titleInput);
      const secondRow = new ActionRowBuilder().addComponents(descriptionInput);

      modal.addComponents(firstRow, secondRow);

      await interaction.showModal(modal);

      // Handle modal submission
      const filter = (i) => i.customId === `ticket-modal-${ticketType}` && i.user.id === interaction.user.id;
      
      try {
        const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 300000 });

        const title = modalInteraction.fields.getTextInputValue('ticket-title');
        const description = modalInteraction.fields.getTextInputValue('ticket-description');

        // Create ticket
        const ticket = await prisma.ticket.create({
          data: {
            streamerId: streamer.id,
            type: ticketType,
            title,
            description,
            status: 'open',
          },
        });

        // Create embed
        const typeNames = {
          issue: lang === 'en' ? '🐛 Issue' : '🐛 مشكلة',
          credit_request: lang === 'en' ? '💰 Credit Request' : '💰 طلب كريدت',
          promotion_request: lang === 'en' ? '📢 Promotion Request' : '📢 طلب ترويج',
          support: lang === 'en' ? '🆘 Support' : '🆘 دعم فني',
        };

        const embed = new EmbedBuilder()
          .setColor('#ffaa00')
          .setTitle('🎫 ' + (lang === 'en' ? 'New Ticket Created' : 'تذكرة جديدة'))
          .addFields(
            { name: lang === 'en' ? 'Type' : 'النوع', value: typeNames[ticketType], inline: true },
            { name: lang === 'en' ? 'Status' : 'الحالة', value: '🟢 ' + (lang === 'en' ? 'Open' : 'مفتوحة'), inline: true },
            { name: lang === 'en' ? 'User' : 'المستخدم', value: `${interaction.user.tag}`, inline: false },
            { name: lang === 'en' ? 'Title' : 'العنوان', value: title, inline: false },
            { name: lang === 'en' ? 'Description' : 'الوصف', value: description, inline: false }
          )
          .setFooter({ text: `Ticket ID: ${ticket.id}` })
          .setTimestamp();

        // Send to tickets channel
        const ticketsChannelId = process.env.CHANNEL_TICKETS;
        if (ticketsChannelId) {
          const ticketsChannel = await interaction.client.channels.fetch(ticketsChannelId);
          if (ticketsChannel) {
            const ticketMessage = await ticketsChannel.send({ embeds: [embed] });
            
            await prisma.ticket.update({
              where: { id: ticket.id },
              data: {
                channelId: ticketsChannel.id,
                messageId: ticketMessage.id,
              },
            });
          }
        }

        await modalInteraction.reply({
          content: lang === 'en' 
            ? `✅ Ticket created successfully! ID: ${ticket.id}` 
            : `✅ تم إنشاء التذكرة بنجاح! الرقم: ${ticket.id}`,
          ephemeral: true,
        });

      } catch (error) {
        console.error('Error creating ticket:', error);
      }

    } else if (subcommand === 'close') {
      const ticketId = interaction.options.getString('ticket-id');

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { streamer: true },
      });

      if (!ticket) {
        return interaction.reply({
          content: lang === 'en' ? '❌ Ticket not found.' : '❌ التذكرة غير موجودة.',
          ephemeral: true,
        });
      }

      // Check permissions
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const canClose = 
        ticket.streamer.discordId === interaction.user.id ||
        member.permissions.has('Administrator') ||
        member.roles.cache.has(process.env.ROLE_SOCIAL_MEDIA_MANAGER) ||
        member.roles.cache.has(process.env.ROLE_STREAMER_MANAGEMENT);

      if (!canClose) {
        return interaction.reply({
          content: lang === 'en' 
            ? '⛔ You do not have permission to close this ticket.' 
            : '⛔ ليس لديك صلاحية لإغلاق هذه التذكرة.',
          ephemeral: true,
        });
      }

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: 'closed',
          closedAt: new Date(),
        },
      });

      await interaction.reply({
        content: lang === 'en' 
          ? `✅ Ticket ${ticketId} has been closed.` 
          : `✅ تم إغلاق التذكرة ${ticketId}.`,
        ephemeral: true,
      });

    } else if (subcommand === 'list') {
      const streamer = await prisma.streamer.findUnique({
        where: { discordId: interaction.user.id },
        include: { tickets: true },
      });

      if (!streamer || streamer.tickets.length === 0) {
        return interaction.reply({
          content: lang === 'en' ? '📭 You have no tickets.' : '📭 ليس لديك تذاكر.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 ' + (lang === 'en' ? 'Your Tickets' : 'تذاكرك'))
        .setDescription(
          streamer.tickets
            .slice(0, 10)
            .map(t => {
              const statusEmoji = t.status === 'open' ? '🟢' : t.status === 'in_progress' ? '🟡' : '🔴';
              return `${statusEmoji} **${t.title}**\nID: \`${t.id}\` | ${t.type} | ${new Date(t.createdAt).toLocaleDateString('ar-EG')}`;
            })
            .join('\n\n')
        )
        .setFooter({ text: lang === 'en' ? `Showing ${Math.min(10, streamer.tickets.length)} of ${streamer.tickets.length} tickets` : `عرض ${Math.min(10, streamer.tickets.length)} من ${streamer.tickets.length} تذكرة` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
