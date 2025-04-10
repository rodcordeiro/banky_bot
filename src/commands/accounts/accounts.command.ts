import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { ListAccountsCommand } from './subcommands/list';
import { UserServices } from '../../services/user.service';
import { actionsMapper } from '../../common/helpers/messages.helper';
import { UsersEntity } from '../../database/entities';
import { AccountsService } from '../../services/accounts.service';
import { iBaseCommand } from '../../common/commands/base.command';
import { CreateAccountsCommand } from './subcommands/create';

export default class AccountsCommand {
  data = new SlashCommandBuilder()
    .setName('accounts')
    .setDescription('Manage user accounts')
    .addSubcommand(new ListAccountsCommand().data)
    .addSubcommand(new CreateAccountsCommand().data);

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let filtered: Array<AutocompleteOption> = [];

    const user = await UserServices.isRegistered(interaction.user.id);
    if (!user) return await interaction.respond([]);

    if (focusedValue.name === 'payment') {
      const types = await AccountsService.listPaymentTypes();
      filtered = types
        .filter((type) => type.name?.toLowerCase().includes(focusedValue.value))
        .slice(0, 10);
    }
    await interaction.respond(filtered);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await UserServices.isRegistered(interaction.user.id);
      if (!user)
        return await interaction.reply({
          content: 'Você precisa se registrar primeiro!',
          ephemeral: true,
        });
      return await actionsMapper(
        [
          ListAccountsCommand,
          CreateAccountsCommand,
        ] as unknown as iBaseCommand[],
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
