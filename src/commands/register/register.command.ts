import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';

export default class RegisterCommand {
  data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register user to interact with bot')
    .addStringOption((option) =>
      option.setName('id').setDescription('Moneto user uuid').setRequired(true),
    );
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const id = interaction.options.getString('id');
      if (!id) {
        return await interaction.reply({
          content: 'Bastard! U must pass an id!',
          ephemeral: true,
        });
      }
      await UserServices.CreateOrUpdate({
        discord_id: interaction.user.id,
        id,
      });
      return await interaction.reply({
        content: 'Malfeito feito! O registro está feito!',
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
      return await interaction.reply({
        content:
          'Woho! Algo de errado não está certo. Os anciões irão verificar meus registros!',
        ephemeral: true,
      });
    }
  }
}
