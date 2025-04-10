import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { AccountsEntity, UsersEntity } from '../../../database/entities';
import { TransactionsService } from '../../../services/transactions.service';
import {
  ArrayUtils,
  DateUtils,
  StringUtils,
  Transformers,
} from '@rodcordeiro/lib';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { Pagination } from 'pagination.djs';

export class ListTransactionsCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List last trsnsactions')
    .addStringOption((option) =>
      option
        .setName('account')
        .setDescription('Account to register the transaction')
        .setAutocomplete(true)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Transaction category')
        .setRequired(false)
        .setAutocomplete(true),
    );
  async execute(interaction: ChatInputCommandInteraction, user: UsersEntity) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const options =
        interaction.options.data[0].options
          ?.map((option: CommandInteractionOption<CacheType>) => [
            option.name,
            option.value,
          ])
          .filter(Boolean) || [];
      const fields = Object.fromEntries(options);

      const transactions = await TransactionsService.findAll(user, (qb) => {
        if (fields.category) {
          qb.andWhere('b.uuid = :category', {
            category: fields.category,
          });
        }
        if (fields.account) {
          qb.andWhere('c.uuid = :account', {
            account: fields.account,
          });
        }
        qb.orderBy('a.date', 'DESC').skip(0).take(15);
      });
      const embeds = ArrayUtils.splitArray(transactions, 5).map(
        (data, index, arr) =>
          createEmbed(
            data,
            (item) => [
              {
                name: 'Data',
                value: `${DateUtils.convertDate(item.date).toLocaleDateString('pt-BR')}`,
                inline: true,
              },
              {
                name: 'Valor',
                value: `${Transformers.formatToCurrency(item.value)}`,
                inline: true,
              },
              {
                name: 'Conta',
                value: StringUtils.Capitalize(
                  (item.account as unknown as AccountsEntity).name,
                ),
                inline: true,
              },
              {
                name: 'Descrição',
                value: StringUtils.Capitalize(item.description.toString()),
                inline: false,
              },
            ],
            {
              title: `Aqui estão suas últimas ${transactions.length} transações:`,
              page: index + 1,
              totalPages: arr.length,
              totalItems: transactions.length,
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
      return await interaction.editReply({
        content: 'Whopa guenta la que eu morri',
      });
    }
  }
}
