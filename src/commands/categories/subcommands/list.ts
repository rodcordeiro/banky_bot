import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { splitArray } from '@rodcordeiro/lib/lib/functions/array';
import { Pagination } from 'pagination.djs';

import { CategoriesEntity, UsersEntity } from '../../../database/entities';
import { CategoriesServices } from '../../../services/categories.service';
import { createEmbed } from '../../../common/helpers/embeds.helper';

export default class ListCategoriesCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List users categories');

  async execute(interaction: ChatInputCommandInteraction, user: UsersEntity) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const categories = await CategoriesServices.findAll(user).then(
        (data) =>
          data.flatMap(
            (item) =>
              item.subcategories
                ? [
                    item,
                    item.subcategories.map((i) => ({
                      ...i,
                      name: `[${item.name}] ${i.name}`,
                    })),
                  ].flat()
                : item,
            2,
          ) as CategoriesEntity[],
      );

      const embeds = splitArray(categories, 10).map((data, index, arr) =>
        createEmbed(
          data,
          (item) => ({
            name: 'Name: ',
            value: `[${item.positive ? '+' : '-'}] ${item.name}`,
            inline: false,
          }),
          {
            title: 'Aqui estão suas categorias',
            page: index + 1,
            totalPages: arr.length,
            totalItems: categories.length,
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
