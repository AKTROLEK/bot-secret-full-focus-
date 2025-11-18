import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setNameLocalizations({ ar: 'تقديم' })
    .setDescription('Apply to join as a streamer | تقديم طلب للانضمام كـ ستريمر'),

  async execute(interaction) {
    const lang = 'ar'; // Default language
    
    // Check if user already has an application
    const existingApplication = await prisma.application.findFirst({
      where: {
        streamer: {
          discordId: interaction.user.id,
        },
        status: 'pending',
      },
    });

    if (existingApplication) {
      return interaction.reply({
        content: lang === 'en' 
          ? '⚠️ You already have a pending application.' 
          : '⚠️ لديك بالفعل طلب قيد الانتظار.',
        ephemeral: true,
      });
    }

    // Create a modal for application
    const modal = new ModalBuilder()
      .setCustomId('streamer-application-modal')
      .setTitle(lang === 'en' ? 'Streamer Application' : 'طلب الانضمام كـ ستريمر');

    // Platform selection (will be asked after modal)
    const platformInput = new TextInputBuilder()
      .setCustomId('platforms-input')
      .setLabel(lang === 'en' ? 'Platforms (comma separated)' : 'المنصات (مفصولة بفواصل)')
      .setPlaceholder('YouTube, Twitch, TikTok...')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const experienceInput = new TextInputBuilder()
      .setCustomId('experience-input')
      .setLabel(lang === 'en' ? 'Your streaming experience' : 'خبرتك في البث')
      .setPlaceholder(lang === 'en' ? 'Tell us about your experience...' : 'أخبرنا عن خبرتك...')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const sampleLinksInput = new TextInputBuilder()
      .setCustomId('sample-links-input')
      .setLabel(lang === 'en' ? 'Sample content links' : 'روابط أمثلة من محتواك')
      .setPlaceholder(lang === 'en' ? 'Paste links to your videos/streams' : 'ضع روابط لمقاطعك/بثوثك')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const whyJoinInput = new TextInputBuilder()
      .setCustomId('why-join-input')
      .setLabel(lang === 'en' ? 'Why do you want to join?' : 'لماذا تريد الانضمام؟')
      .setPlaceholder(lang === 'en' ? 'Tell us why...' : 'أخبرنا لماذا...')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(platformInput);
    const secondRow = new ActionRowBuilder().addComponents(experienceInput);
    const thirdRow = new ActionRowBuilder().addComponents(sampleLinksInput);
    const fourthRow = new ActionRowBuilder().addComponents(whyJoinInput);

    modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);

    await interaction.showModal(modal);

    // Handle modal submission
    const filter = (i) => i.customId === 'streamer-application-modal' && i.user.id === interaction.user.id;
    
    try {
      const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 600000 }); // 10 minutes

      const platforms = modalInteraction.fields.getTextInputValue('platforms-input').split(',').map(p => p.trim());
      const experience = modalInteraction.fields.getTextInputValue('experience-input');
      const sampleLinks = modalInteraction.fields.getTextInputValue('sample-links-input').split('\n').map(l => l.trim()).filter(l => l);
      const whyJoin = modalInteraction.fields.getTextInputValue('why-join-input');

      // Create or get streamer
      let streamer = await prisma.streamer.findUnique({
        where: { discordId: interaction.user.id },
      });

      if (!streamer) {
        streamer = await prisma.streamer.create({
          data: {
            discordId: interaction.user.id,
            username: interaction.user.username,
            status: 'pending',
          },
        });
      }

      // Create application
      const application = await prisma.application.create({
        data: {
          streamerId: streamer.id,
          platforms,
          experience,
          sampleLinks,
          whyJoin,
          status: 'pending',
        },
      });

      // Create ticket for the application
      const ticket = await prisma.ticket.create({
        data: {
          streamerId: streamer.id,
          type: 'application',
          title: lang === 'en' ? 'New Streamer Application' : 'طلب انضمام جديد كـ ستريمر',
          description: `**${lang === 'en' ? 'Platforms' : 'المنصات'}:** ${platforms.join(', ')}\n\n**${lang === 'en' ? 'Experience' : 'الخبرة'}:**\n${experience}\n\n**${lang === 'en' ? 'Sample Links' : 'روابط الأمثلة'}:**\n${sampleLinks.join('\n')}\n\n**${lang === 'en' ? 'Why Join' : 'لماذا تريد الانضمام'}:**\n${whyJoin}`,
          status: 'open',
          priority: 'normal',
        },
      });

      // Create embed for ticket channel
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('📝 ' + (lang === 'en' ? 'New Streamer Application' : 'طلب انضمام جديد'))
        .setDescription(`**${lang === 'en' ? 'Applicant' : 'المتقدم'}:** ${interaction.user.tag}`)
        .addFields(
          { name: lang === 'en' ? 'Platforms' : 'المنصات', value: platforms.join(', '), inline: false },
          { name: lang === 'en' ? 'Experience' : 'الخبرة', value: experience.substring(0, 1024), inline: false },
          { name: lang === 'en' ? 'Sample Links' : 'روابط الأمثلة', value: sampleLinks.join('\n').substring(0, 1024), inline: false },
          { name: lang === 'en' ? 'Why Join' : 'لماذا', value: whyJoin.substring(0, 1024), inline: false }
        )
        .setFooter({ text: `Ticket ID: ${ticket.id}` })
        .setTimestamp();

      // Send to tickets channel (if configured)
      const ticketsChannelId = process.env.CHANNEL_TICKETS;
      if (ticketsChannelId) {
        const ticketsChannel = await interaction.client.channels.fetch(ticketsChannelId);
        if (ticketsChannel) {
          const ticketMessage = await ticketsChannel.send({ embeds: [embed] });
          
          // Update ticket with channel and message IDs
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
          ? '✅ Application submitted successfully! A ticket has been created for review.' 
          : '✅ تم تقديم الطلب بنجاح! تم إنشاء تذكرة للمراجعة.',
        ephemeral: true,
      });

    } catch (error) {
      console.error('Error in application submission:', error);
    }
  },
};
