import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { version } from '../../../package.json';

import { client } from '../../core/discord/client.discord';
import { createEmbed } from '../../common/helpers/embeds.helper';
import { StringUtils } from '../../common/helpers/string.helper';
import { createBatch } from '../../common/helpers/batch.helper';
import { Pagination } from 'pagination.djs';

export default class HelpCommand {
  data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows bot help!');

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const commandData = client.commands
      ?.map((c) => {
        const payload = [
          {
            name: c.data.name,
            value:
              (c.data as unknown as Record<string, string>).description ||
              '\u200B',
          },
        ];

        /* eslint-disable  @typescript-eslint/no-explicit-any */

        if ((c.data as any).options) {
          /* eslint-disable  @typescript-eslint/no-explicit-any */

          (c.data as any).options.map((option: any) => {
            if (option instanceof SlashCommandSubcommandBuilder) {
              payload.push({
                name: `${c.data.name} ${option.name}`,
                value: option.description || '\u200B',
              });
            }
          });
        }
        return payload;
      })
      .flat(2);

    const embeds = createBatch(commandData ?? [], 6).map((data) =>
      createEmbed(
        data,
        (item) => ({
          name: StringUtils.Capitalize(item.name),
          value: item.value.toString(),
          inline: false,
        }),
        {
          title: 'Command list:',
          description:
            '_Commands without description could be context commands. Tried my best to maintain self-describing. It dosent show subcommands helps yet._',
          customFooter: {
            text: `v${version}`,
          },
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
  }
}
