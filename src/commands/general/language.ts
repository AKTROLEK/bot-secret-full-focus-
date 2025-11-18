import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { setLanguage, t } from '../../utils/i18n';

export default {
  data: new SlashCommandBuilder()
    .setName('language')
    .setNameLocalizations({ ar: 'اللغة' })
    .setDescription('Change language preference')
    .setDescriptionLocalizations({ ar: 'تغيير تفضيل اللغة' })
    .addStringOption(option =>
      option
        .setName('lang')
        .setNameLocalizations({ ar: 'اللغة' })
        .setDescription('Language to switch to')
        .setDescriptionLocalizations({ ar: 'اللغة المراد التبديل إليها' })
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
