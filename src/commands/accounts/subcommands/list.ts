import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UsersEntity } from '../../../database/entities';
import { AccountsService } from '../../../services/accounts.service';
import { ArrayUtils, Transformers } from '@rodcordeiro/lib';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { Pagination } from 'pagination.djs';
export class ListAccountsCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List user accounts');

  async execute(interaction: ChatInputCommandInteraction, user: UsersEntity) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const accounts = await AccountsService.findAll(user);
      const embeds = ArrayUtils.splitArray(
        accounts.sort((a, b) => (a.name > b.name ? 1 : -1)),
        6,
      ).map((data, index, arr) =>
        createEmbed(
          data,
          (item) => [
            {
              name: 'Name: ',
              value: item.name,
              inline: true,
            },
            {
              name: 'Ammount: ',
              value: Transformers.formatToCurrency(item.ammount),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
          ],
          {
            title: 'Aqui estão suas contas',
            page: index + 1,
            totalPages: arr.length,
            totalItems: accounts.length,
          },
        ),
      );

      if (embeds.length === 1) {
        return await interaction.editReply({
          embeds,
        });
      }

      const pagination = new Pagination(interaction, {
        idle: 30000,
        loop: true,
        ephemeral: true,
      });

      pagination.setEmbeds(embeds);

      const payload = pagination.ready();
      const message = await interaction.editReply(payload);
      pagination.paginate(message);
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
