import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { UsersEntity } from '../../../database/entities';
import { AccountsService } from '../../../services/accounts.service';
import { createEmbed } from '../../../common/helpers/embeds.helper';
import { Transformers } from '@rodcordeiro/lib';

export class CreateAccountsCommand {
  data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a new account')
    .addStringOption((option) =>
      option.setName('name').setDescription('Account name').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('payment')
        .setDescription('Payment type for this account')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addNumberOption((option) =>
      option
        .setName('ammount')
        .setDescription('Current account ammount')
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option
        .setName('threshold')
        .setDescription('Account threshold')
        .setRequired(false),
    );

  async execute(interaction: ChatInputCommandInteraction, user: UsersEntity) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const options =
        interaction.options.data[0].options
          ?.map((option) => [option.name, option.value])
          .filter(Boolean) || [];
      const fields = Object.fromEntries(options);

      const data = await AccountsService.create(
        { ...fields, paymentType: fields.payment },
        user,
      );
      const embed = createEmbed(
        [data],
        (item) => [
          {
            name: 'Name',
            value: item.name.toString(),
            inline: false,
          },
          {
            name: 'Value',
            value: Transformers.formatToCurrency(item.ammount as number),
            inline: true,
          },
          {
            name: 'Threshold',
            value: Transformers.formatToCurrency(item.threshold as number),
            inline: true,
          },
        ],
        {
          title: 'Nova conta!',
        },
      );
      return await interaction.editReply({
        embeds: [embed],
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
