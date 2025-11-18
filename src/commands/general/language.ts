import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { setLanguage, t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change language preference')
    .addStringOption(option =>
      option
        .setName('lang')
        .setDescription('Language to switch to')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'العربية', value: 'ar' }
        )
    ),

  async execute(interaction: CommandInteraction) {
    const lang = interaction.options.get('lang')?.value as string;
    setLanguage(lang);

    await interaction.reply({
      content: t('commands.language.changed'),
      ephemeral: true,
    });
  },
};
