import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands for streamer management | أوامر الإدارة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup(group =>
      group
        .setName('credit')
        .setNameLocalizations({ ar: 'كريدت' })
        .setDescription('Credit management | إدارة الكريدت')
        .addSubcommand(subcommand =>
          subcommand
            .setName('add')
            .setNameLocalizations({ ar: 'إضافة' })
            .setDescription('Add credits to a user | إضافة كريدت لمستخدم')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
            .addIntegerOption(option =>
              option
                .setName('amount')
                .setNameLocalizations({ ar: 'المبلغ' })
                .setDescription('Amount | المبلغ')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option =>
              option
                .setName('reason')
                .setNameLocalizations({ ar: 'السبب' })
                .setDescription('Reason | السبب')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('remove')
            .setNameLocalizations({ ar: 'خصم' })
            .setDescription('Remove credits from a user | خصم كريدت من مستخدم')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
            .addIntegerOption(option =>
              option
                .setName('amount')
                .setNameLocalizations({ ar: 'المبلغ' })
                .setDescription('Amount | المبلغ')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option =>
              option
                .setName('reason')
                .setNameLocalizations({ ar: 'السبب' })
                .setDescription('Reason | السبب')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName('streamer')
        .setNameLocalizations({ ar: 'ستريمر' })
        .setDescription('Streamer management | إدارة الستريمرز')
        .addSubcommand(subcommand =>
          subcommand
            .setName('approve')
            .setNameLocalizations({ ar: 'قبول' })
            .setDescription('Approve a streamer application | قبول طلب ستريمر')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('reject')
            .setNameLocalizations({ ar: 'رفض' })
            .setDescription('Reject a streamer application | رفض طلب ستريمر')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
            .addStringOption(option =>
              option
                .setName('reason')
                .setNameLocalizations({ ar: 'السبب' })
                .setDescription('Reason | السبب')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('suspend')
            .setNameLocalizations({ ar: 'إيقاف' })
            .setDescription('Suspend a streamer | إيقاف ستريمر')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
            .addStringOption(option =>
              option
                .setName('reason')
                .setNameLocalizations({ ar: 'السبب' })
                .setDescription('Reason | السبب')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('unsuspend')
            .setNameLocalizations({ ar: 'إلغاء-الإيقاف' })
            .setDescription('Unsuspend a streamer | إلغاء إيقاف ستريمر')
            .addUserOption(option =>
              option
                .setName('user')
                .setNameLocalizations({ ar: 'المستخدم' })
                .setDescription('User | المستخدم')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName('reward')
        .setNameLocalizations({ ar: 'مكافأة' })
        .setDescription('Reward management | إدارة المكافآت')
        .addSubcommand(subcommand =>
          subcommand
            .setName('create')
            .setNameLocalizations({ ar: 'إنشاء' })
            .setDescription('Create a new reward | إنشاء مكافأة جديدة')
            .addStringOption(option =>
              option
                .setName('name-en')
                .setDescription('Name in English')
                .setRequired(true)
            )
            .addStringOption(option =>
              option
                .setName('name-ar')
                .setDescription('Name in Arabic | الاسم بالعربية')
                .setRequired(true)
            )
            .addIntegerOption(option =>
              option
                .setName('cost')
                .setDescription('Credit cost | التكلفة بالكريدت')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option =>
              option
                .setName('category')
                .setDescription('Category | الفئة')
                .setRequired(true)
                .addChoices(
                  { name: 'Rank Upgrade', value: 'rank_upgrade' },
                  { name: 'Promotion', value: 'promotion' },
                  { name: 'Editing', value: 'editing' },
                  { name: 'Gift Card', value: 'gift_card' },
                  { name: 'Tools', value: 'tools' },
                  { name: 'Coaching', value: 'coaching' }
                )
            )
        )
    ),

  async execute(interaction) {
    const lang = 'ar';
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (group === 'credit') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      const reason = interaction.options.getString('reason');

      let streamer = await prisma.streamer.findUnique({
        where: { discordId: targetUser.id },
      });

      if (!streamer) {
        streamer = await prisma.streamer.create({
          data: {
            discordId: targetUser.id,
            username: targetUser.username,
          },
        });
      }

      if (subcommand === 'add') {
        await prisma.$transaction([
          prisma.streamer.update({
            where: { id: streamer.id },
            data: { totalCredits: { increment: amount } },
          }),
          prisma.creditTransaction.create({
            data: {
              streamerId: streamer.id,
              amount: amount,
              type: 'bonus',
              description: reason,
              issuedBy: interaction.user.id,
            },
          }),
        ]);

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Added ${amount} credits to ${targetUser.tag}. Reason: ${reason}`
            : `✅ تم إضافة ${amount} كريدت إلى ${targetUser.tag}. السبب: ${reason}`,
          ephemeral: true,
        });

      } else if (subcommand === 'remove') {
        await prisma.$transaction([
          prisma.streamer.update({
            where: { id: streamer.id },
            data: { totalCredits: { decrement: amount } },
          }),
          prisma.creditTransaction.create({
            data: {
              streamerId: streamer.id,
              amount: -amount,
              type: 'penalty',
              description: reason,
              issuedBy: interaction.user.id,
            },
          }),
        ]);

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Removed ${amount} credits from ${targetUser.tag}. Reason: ${reason}`
            : `✅ تم خصم ${amount} كريدت من ${targetUser.tag}. السبب: ${reason}`,
          ephemeral: true,
        });
      }

    } else if (group === 'streamer') {
      const targetUser = interaction.options.getUser('user');

      let streamer = await prisma.streamer.findUnique({
        where: { discordId: targetUser.id },
        include: { applications: true },
      });

      if (!streamer) {
        return interaction.reply({
          content: lang === 'en'
            ? '❌ User has not applied as a streamer.'
            : '❌ المستخدم لم يتقدم كـ ستريمر.',
          ephemeral: true,
        });
      }

      if (subcommand === 'approve') {
        await prisma.streamer.update({
          where: { id: streamer.id },
          data: { status: 'approved', isActive: true },
        });

        // Update applications
        await prisma.application.updateMany({
          where: { streamerId: streamer.id, status: 'pending' },
          data: { 
            status: 'approved',
            reviewedBy: interaction.user.id,
          },
        });

        // Add streamer role if configured
        const streamerRoleId = process.env.ROLE_STREAMER;
        if (streamerRoleId) {
          const member = await interaction.guild.members.fetch(targetUser.id);
          await member.roles.add(streamerRoleId);
        }

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Approved ${targetUser.tag} as a streamer!`
            : `✅ تم قبول ${targetUser.tag} كـ ستريمر!`,
          ephemeral: true,
        });

      } else if (subcommand === 'reject') {
        const reason = interaction.options.getString('reason');

        await prisma.application.updateMany({
          where: { streamerId: streamer.id, status: 'pending' },
          data: { 
            status: 'rejected',
            reviewedBy: interaction.user.id,
            reviewNotes: reason,
          },
        });

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Rejected ${targetUser.tag}'s application.${reason ? ` Reason: ${reason}` : ''}`
            : `✅ تم رفض طلب ${targetUser.tag}.${reason ? ` السبب: ${reason}` : ''}`,
          ephemeral: true,
        });

      } else if (subcommand === 'suspend') {
        const reason = interaction.options.getString('reason');

        await prisma.streamer.update({
          where: { id: streamer.id },
          data: { status: 'suspended', isActive: false },
        });

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Suspended ${targetUser.tag}. Reason: ${reason}`
            : `✅ تم إيقاف ${targetUser.tag}. السبب: ${reason}`,
          ephemeral: true,
        });

      } else if (subcommand === 'unsuspend') {
        await prisma.streamer.update({
          where: { id: streamer.id },
          data: { status: 'approved', isActive: true },
        });

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Unsuspended ${targetUser.tag}.`
            : `✅ تم إلغاء إيقاف ${targetUser.tag}.`,
          ephemeral: true,
        });
      }

    } else if (group === 'reward') {
      if (subcommand === 'create') {
        const nameEn = interaction.options.getString('name-en');
        const nameAr = interaction.options.getString('name-ar');
        const cost = interaction.options.getInteger('cost');
        const category = interaction.options.getString('category');

        const reward = await prisma.reward.create({
          data: {
            nameEn,
            nameAr,
            descriptionEn: 'No description provided',
            descriptionAr: 'لا يوجد وصف',
            cost,
            category,
          },
        });

        await interaction.reply({
          content: lang === 'en'
            ? `✅ Created reward: ${nameEn} (${cost} credits)`
            : `✅ تم إنشاء مكافأة: ${nameAr} (${cost} كريدت)`,
          ephemeral: true,
        });
      }
    }
  },
};
