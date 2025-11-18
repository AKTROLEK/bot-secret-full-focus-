import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { Reward } from '../../models/Reward';
import { CreditService } from '../../services/CreditService';
import { t } from '../../utils/i18n';
import { isStreamer } from '../../utils/permissions';

export default {
  data: new SlashCommandBuilder()
    .setName('rewards')
    .setDescription('Browse and redeem rewards')
    .addSubcommand(subcommand =>
      subcommand
        .setName('catalog')
        .setDescription('View available rewards')
        .addStringOption(option =>
          option
            .setName('category')
            .setDescription('Filter by category')
            .addChoices(
              { name: 'Rank Upgrades', value: 'rank' },
              { name: 'Promotion', value: 'promotion' },
              { name: 'Services', value: 'service' },
              { name: 'Gift Cards', value: 'gift' },
              { name: 'Tools', value: 'tools' },
              { name: 'Coaching', value: 'coaching' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('redeem')
        .setDescription('Redeem a reward')
        .addStringOption(option =>
          option
            .setName('reward_id')
            .setDescription('Reward ID to redeem')
            .setRequired(true)
        )
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
      if (subcommand === 'catalog') {
        const category = interaction.options.get('category')?.value as string | undefined;

        const query: any = { available: true };
        if (category) {
          query.category = category;
        }

        const rewards = await Reward.find(query);

        if (rewards.length === 0) {
          return interaction.reply({
            content: 'No rewards available at the moment.',
            ephemeral: true,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle(t('commands.rewards.catalog'))
          .setColor(0xffd700)
          .setDescription(
            rewards
              .map(
                r =>
                  `**ID: ${r.id}** - ${r.name}\n` +
                  `${r.description}\n` +
                  `💰 Cost: ${r.cost} credits | Category: ${r.category}`
              )
              .join('\n\n')
          )
          .setFooter({ text: 'Use /rewards redeem <id> to redeem a reward' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else if (subcommand === 'redeem') {
        const rewardId = interaction.options.get('reward_id')?.value as string;
        const reward = await Reward.findOne({ id: rewardId, available: true });

        if (!reward) {
          return interaction.reply({
            content: 'Reward not found or not available.',
            ephemeral: true,
          });
        }

        const balance = await CreditService.getBalance(interaction.user.id);

        if (balance < reward.cost) {
          return interaction.reply({
            content: t('commands.credits.insufficient'),
            ephemeral: true,
          });
        }

        await CreditService.removeCredits(
          interaction.user.id,
          reward.cost,
          `Redeemed reward: ${reward.name}`,
          'spend'
        );

        const embed = new EmbedBuilder()
          .setTitle('Reward Redeemed! 🎁')
          .setDescription(
            `You have successfully redeemed **${reward.name}**!\n\n` +
              `${reward.description}\n\n` +
              `Credits spent: ${reward.cost}\n` +
              `Remaining balance: ${balance - reward.cost}`
          )
          .setColor(0x00ff00)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error: any) {
      await interaction.reply({
        content: error.message || t('errors.database_error'),
        ephemeral: true,
      });
    }
  },
};
