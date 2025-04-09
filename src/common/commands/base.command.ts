import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  ContextMenuCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { UserEntity } from '../../database/entities';

export type BaseCommandType = {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | ContextMenuCommandBuilder;
  maintenance?: boolean;
  execute: (
    interaction: ChatInputCommandInteraction,
    user?: UserEntity,
  ) => Promise<void>;
  maintenanceActions: (
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  modalHandler?: (interaction: ModalSubmitInteraction) => Promise<void>;
};

// MessageContextMenuCommandInteraction
export abstract class BaseCommand {
  data: BaseCommandType['data'];
  subcommands?: BaseCommand[];
  maintenance: boolean;

  constructor(data: BaseCommandType['data'], maintenance = false) {
    this.data = data;
    this.maintenance = maintenance;
  }
  async maintenanceActions(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: 'Whops. Command under maintenance, try it later',
      ephemeral: true,
    });
  }
}
