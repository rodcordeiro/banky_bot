import { ChatInputCommandInteraction } from 'discord.js';
import { UsersEntity } from '../../database/entities';
import { iBaseCommand, BaseCommandType } from '../commands/base.command';

export function replyMessage(interaction: ChatInputCommandInteraction) {
  if (interaction.replied)
    return interaction.editReply(
      'Whops... Lost myself. Do you mind trying again?',
    );
  return interaction.reply('Whops... Lost myself. Do you mind trying again?');
}

export const actionsMapper = async (
  interactions: iBaseCommand[],
  interaction: ChatInputCommandInteraction,
  user: UsersEntity,
) =>
  interactions
    .map((Command: iBaseCommand) => new Command() as unknown as BaseCommandType)
    .map((i) => ({ name: i.data.name, command: i }))
    ?.find((i) => i.name === interaction.options.getSubcommand())
    ?.command?.execute(interaction, user) ?? replyMessage(interaction);
