import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UsersEntity } from '../../../database/entities';
import { TransactionsService } from '../../../services/transactions.service';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { Transformers } from '@rodcordeiro/lib';

export class CreateTransactionCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a new transaction')
    .addStringOption((option) =>
      option
        .setName('account')
        .setDescription('Account to register the transaction')
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Transaction category')
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription(
          'Transaction description. Use this as label for the transaction',
        )
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName('value')
        .setDescription('Transaction value. Use _"."_ to inform decimal values')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription(
          'Enter the date and time in YYYY-MM-DDT HH:mm format or only YYYY-MM-DD',
        )
        .setRequired(false),
    );

  async execute(interaction: ChatInputCommandInteraction, user: UsersEntity) {
    // Regex para validar os dois formatos
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Apenas data
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}[T|t]\d{2}:\d{2}$/; // Data com hora

    await interaction.deferReply({ ephemeral: true });
    try {
      const options =
        interaction.options.data[0].options
          ?.map((option) => [option.name, option.value])
          .filter(Boolean) || [];
      const fields = Object.fromEntries(options);
      if (fields.date) {
        if (!dateRegex.test(fields.date))
          if (!datetimeRegex.test(fields.date))
            return await interaction.editReply({
              content: 'Formato de data inválida!',
            });
      }
      const data = await TransactionsService.create(fields, user);
      console.log({ data });
      const embed = createEmbed(
        [data],
        (item) => [
          {
            name: 'Date',
            value: new Date(item.date).toLocaleString('pt-br'),
            inline: true,
          },
          {
            name: 'Value',
            value: Transformers.formatToCurrency(item.value as number),
            inline: true,
          },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Category', value: item.category.toString(), inline: true },
          { name: 'Account', value: item.account.toString(), inline: true },
          {
            name: 'Description',
            value: item.description.toString(),
            inline: false,
          },
        ],
        {
          title: 'Nova transação',
          thumbnail:
            'https://raw.githubusercontent.com/rodcordeiro/monetojs/refs/heads/main/src/assets/pay_it.jpg',
        },
      );
      return await interaction.editReply({
        embeds: [embed],
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content: 'Whopa guenta la que eu morri',
      });
    }
  }
}
