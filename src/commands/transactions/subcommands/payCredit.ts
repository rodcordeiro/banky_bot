import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UsersEntity } from '../../../database/entities';
import { TransactionsService } from '../../../services/transactions.service';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { Transformers } from '@rodcordeiro/lib';

export class PayCreditSubcommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('credit')
    .setDescription("Pay a credit card account's balance")
    .addStringOption((option) =>
      option
        .setName('origin')
        .setDescription('Account to debit the ammount')
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('credit_account')
        .setDescription('Credit account to pay')
        .setAutocomplete(true)
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
        .setName('description')
        .setDescription(
          'Transaction description. You can use this as label for the transaction',
        )
        .setRequired(false),
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
      const data = await TransactionsService.payCredit({
        ...fields,
        owner: user,
      });
      console.log({ data });
      const embed = createEmbed(
        [data],
        (item) => [
          {
            name: 'Date',
            value: new Date(item.date!).toLocaleString('pt-br'),
            inline: true,
          },
          {
            name: 'Value',
            value: Transformers.formatToCurrency(item.value as number),
            inline: true,
          },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Origem', value: item.account.toString(), inline: true },
          {
            name: 'Destino',
            value: item.credit_account.toString(),
            inline: true,
          },
          {
            name: 'Description',
            value: item.description.toString(),
            inline: false,
          },
        ],
        {
          title: 'Nova transação',
          thumbnail:
            'https://raw.githubusercontent.com/rodcordeiro/banky_bot/refs/heads/main/src/assets/pay_it.jpg',
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
