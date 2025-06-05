import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { UserServices } from '../../services/user.service';
import { AccountsService } from '../../services/accounts.service';
import { CategoriesEntity, UsersEntity } from '../../database/entities';
import { CategoriesServices } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';
import { actionsMapper } from '../../common/helpers/messages.helper';
import { iBaseCommand } from '../../common/commands/base.command';
import { CreateTransactionCommand } from './subcommands/create';
import { ListTransactionsCommand } from './subcommands/list';
import { TransferSubcommand } from './subcommands/transfer';
import { PayCreditSubcommand } from './subcommands/payCredit';
import { PaymentTypesEnum } from '../../database/entities/payments.entity';

export default class TransactionsCommand {
  data = new SlashCommandBuilder()
    .setName('transactions')
    .setDescription('List users last transactions')
    .addSubcommand(new TransferSubcommand().data)
    .addSubcommand(new CreateTransactionCommand().data)
    .addSubcommand(new PayCreditSubcommand().data)
    .addSubcommand(new ListTransactionsCommand().data);
  // .addSubcommand(new UpdateTransactionCommand().data);
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused(true);
    let filtered: Array<AutocompleteOption> = [];

    const user = await UserServices.isRegistered(interaction.user.id);
    if (!user) return await interaction.respond([]);

    if (['account', 'origin', 'destiny'].includes(focusedValue.name)) {
      const accounts = await AccountsService.findAll(
        user.owner as unknown as UsersEntity,
      );
      filtered = accounts
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, id }) => ({ name, value: id }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .slice(0, 10);
      return await interaction.respond(filtered);
    }
    if (['credit_account'].includes(focusedValue.name)) {
      const accounts = await AccountsService.findBy(
        user.owner as unknown as UsersEntity,
        (qb) =>
          qb.andWhere('b.name = :paymentType', {
            paymentType: PaymentTypesEnum.CREDIT,
          }),
      );

      filtered = accounts
        .filter((account) =>
          account.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, id }) => ({ name, value: id }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .slice(0, 10);

      return await interaction.respond(filtered);
    }

    if (focusedValue.name === 'category') {
      const categories = await CategoriesServices.findAll(
        user.owner as unknown as UsersEntity,
      ).then(
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

      filtered = categories
        .filter((category) =>
          category.name?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ name, id }) => ({ name, value: id }))
        .slice(0, 10)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      return await interaction.respond(filtered);
    }
    if (focusedValue.name === 'transaction') {
      const transactions = await TransactionsService.findAll(
        user.owner as unknown as UsersEntity,
        (qb) => {
          if (focusedValue.value) {
            qb.andWhere('a.description like :description', {
              description: `%${focusedValue.value}%`,
            });
          }
          qb.orderBy('a.date', 'DESC').skip(0).take(10);
        },
      );
      filtered = transactions
        .filter((transaction) =>
          transaction.description?.toLowerCase().includes(focusedValue.value),
        )
        .flatMap(({ description, id }) => ({
          name: description,
          value: id.toString(),
        }));
      return await interaction.respond(filtered);
    }
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
          CreateTransactionCommand,
          ListTransactionsCommand,
          TransferSubcommand,
          PayCreditSubcommand,
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
