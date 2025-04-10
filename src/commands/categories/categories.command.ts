import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UserServices } from '../../services/user.service';
import { actionsMapper } from '../../common/helpers/messages.helper';
import ListCategoriesCommand from './subcommands/list';
import { UsersEntity } from '../../database/entities';
import { iBaseCommand } from '../../common/commands/base.command';

export default class CategoriesCommand {
  data = new SlashCommandBuilder()
    .setName('categories')
    .setDescription('Manage user categories')
    .addSubcommand(new ListCategoriesCommand().data);

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      return await actionsMapper(
        [ListCategoriesCommand] as unknown as iBaseCommand[],
        interaction,
        user.owner as unknown as UsersEntity,
      );
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
