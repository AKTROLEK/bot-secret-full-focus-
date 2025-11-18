import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { CreditService } from '../../services/CreditService';
import { t } from '../../utils/i18n';
import { isStreamer } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setNameLocalizations({ ar: 'الكريدت' })
    .setDescription('Manage your credits')
    .setDescriptionLocalizations({ ar: 'إدارة الكريدت الخاص بك' })
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setNameLocalizations({ ar: 'الرصيد' })
        .setDescription('Check your credit balance')
        .setDescriptionLocalizations({ ar: 'التحقق من رصيد الكريدت' })
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('transfer')
        .setNameLocalizations({ ar: 'تحويل' })
        .setDescription('Transfer credits to another user')
        .setDescriptionLocalizations({ ar: 'تحويل الكريدت إلى مستخدم آخر' })
        .addUserOption(option =>
          option
            .setName('user')
            .setNameLocalizations({ ar: 'المستخدم' })
            .setDescription('User to transfer credits to')
            .setDescriptionLocalizations({ ar: 'المستخدم المراد التحويل إليه' })
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setNameLocalizations({ ar: 'الكمية' })
            .setDescription('Amount of credits to transfer')
            .setDescriptionLocalizations({ ar: 'كمية الكريدت المراد تحويلها' })
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('history')
        .setNameLocalizations({ ar: 'السجل' })
        .setDescription('View your transaction history')
        .setDescriptionLocalizations({ ar: 'عرض سجل المعاملات' })
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
      if (subcommand === 'balance') {
        const balance = await CreditService.getBalance(interaction.user.id);
        await interaction.reply({
          content: t('commands.credits.balance', { amount: balance.toString() }),
          ephemeral: true,
        });
      } else if (subcommand === 'transfer') {
        const targetUser = interaction.options.get('user')?.user;
        const amount = interaction.options.get('amount')?.value as number;

        if (!targetUser) {
          return interaction.reply({ content: 'User not found', ephemeral: true });
        }

        await CreditService.transferCredits(interaction.user.id, targetUser.id, amount);

        await interaction.reply({
          content: t('commands.credits.transfer', { amount: amount.toString(), user: targetUser.username }),
          ephemeral: true,
        });
      } else if (subcommand === 'history') {
        const history = await CreditService.getTransactionHistory(interaction.user.id, 10);

        const embed = new EmbedBuilder()
          .setTitle('Credit Transaction History')
          .setColor(0x00ff00)
          .setDescription(
            history.length > 0
              ? history
                  .map(
                    (tx, i) =>
                      `${i + 1}. **${tx.type}** - ${tx.amount > 0 ? '+' : ''}${tx.amount} credits - ${tx.reason}`
                  )
                  .join('\n')
              : 'No transactions yet'
          );

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error: any) {
      await interaction.reply({
        content: error.message || 'An error occurred',
        ephemeral: true,
      });
    }
  },
};
