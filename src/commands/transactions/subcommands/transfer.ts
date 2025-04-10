import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UsersEntity } from '../../../database/entities';
import { TransactionsService } from '../../../services/transactions.service';

export class TransferSubcommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('transfer')
    .setDescription('Create a transfer between accounts')
    .addStringOption((option) =>
      option
        .setName('origin')
        .setDescription('Account to register the transaction')
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('destiny')
        .setDescription('Account to register the transaction')
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

      await TransactionsService.createTransfer(
        fields.origin,
        fields.destiny,
        fields.description,
        fields.value,
        user,
        fields.date,
      );

      return await interaction.editReply({
        content: 'Transferência realizada com sucesso!',
      });
    } catch (e) {
      console.error(e);
      return await interaction.editReply({
        content: 'Whopa guenta la que eu morri',
      });
    }
  }
}
