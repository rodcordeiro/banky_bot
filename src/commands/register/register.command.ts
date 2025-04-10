import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
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
      interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const id = interaction.options.getString('id');
      if (!id) {
        return await interaction.editReply({
          content: 'Bastard! U must pass an id!',
        });
      }

      await UserServices.CreateOrUpdate({
        discord_id: interaction.user.id,
        id,
      });

      return interaction.editReply({
        content: 'Malfeito feito! O registro está feito!',
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content:
          'Woho! Algo de errado não está certo. Os anciões irão verificar meus registros!',
      });
    }
  }
}
