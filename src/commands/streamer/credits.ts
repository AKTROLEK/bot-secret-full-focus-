import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { CreditService } from '../../services/CreditService';
import { t } from '../../utils/i18n';
import { isStreamer } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Manage your credits')
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setDescription('Check your credit balance')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('transfer')
        .setDescription('Transfer credits to another user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to transfer credits to')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Amount of credits to transfer')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('history')
        .setDescription('View your transaction history')
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
