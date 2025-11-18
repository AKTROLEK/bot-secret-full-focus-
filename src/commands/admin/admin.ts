import { SlashCommandBuilder, CommandInteraction, GuildMember } from 'discord.js';
import { CreditService } from '../../services/CreditService';
import { t } from '../../utils/i18n';
import { isStaff } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands for managing streamers')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add-credits')
        .setDescription('Add credits to a user')
        .addUserOption(option =>
          option.setName('user').setDescription('User to add credits to').setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Amount of credits to add')
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption(option =>
          option.setName('reason').setDescription('Reason for adding credits').setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove-credits')
        .setDescription('Remove credits from a user')
        .addUserOption(option =>
          option.setName('user').setDescription('User to remove credits from').setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Amount of credits to remove')
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption(option =>
          option.setName('reason').setDescription('Reason for removing credits').setRequired(true)
        )
    ),

  async execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;

    if (!isStaff(member)) {
      return interaction.reply({
        content: t('errors.no_permission'),
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.data[0].name;
    const user = interaction.options.get('user')?.user;
    const amount = interaction.options.get('amount')?.value as number;
    const reason = interaction.options.get('reason')?.value as string;

    if (!user) {
      return interaction.reply({ content: 'User not found', ephemeral: true });
    }

    try {
      if (subcommand === 'add-credits') {
        await CreditService.addCredits(user.id, amount, reason, 'admin_add');
        await interaction.reply({
          content: t('commands.credits.add', { amount: amount.toString(), user: user.username }),
          ephemeral: true,
        });
      } else if (subcommand === 'remove-credits') {
        await CreditService.removeCredits(user.id, amount, reason, 'admin_remove');
        await interaction.reply({
          content: t('commands.credits.remove', { amount: amount.toString(), user: user.username }),
          ephemeral: true,
        });
      }
    } catch (error: any) {
      await interaction.reply({
        content: error.message || 'An error occurred',
        ephemeral: true,
      });
    }
  },
};
