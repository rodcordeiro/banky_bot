import {
  APIEmbedField,
  Colors,
  EmbedBuilder,
  EmbedFooterOptions,
} from 'discord.js';

type MetadataCommonProps = {
  title: string;
  description?: string;
  thumbnail?: string;
  customFooter?: EmbedFooterOptions;
};

type MetadataWithoutPagination = MetadataCommonProps & {
  page?: number;
  totalPages?: number;
  totalItems?: number;
};
type MetadataWithPagination = MetadataCommonProps & {
  page: number;
  totalPages: number;
  totalItems: number;
};

type Metadata<T = object> = T extends { page: number }
  ? MetadataWithPagination
  : MetadataWithoutPagination;

export function createEmbed<T = Record<string, Value>>(
  data: T[],
  cb: (item: T) => APIEmbedField | APIEmbedField[],
  options: Metadata,
) {
  const embed = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle(options.title)
    .setThumbnail(
      options.thumbnail ??
        'https://raw.githubusercontent.com/rodcordeiro/banky_bot/refs/heads/main/src/assets/logo.png',
    );
  if (options.description) embed.setDescription(options.description);
  if (options.page)
    embed.setFooter({
      text: `Page: ${options.page}/${options.totalPages}. Items: ${options.totalItems}`,
    });
  if (options.customFooter) {
    embed.setFooter(options.customFooter);
  }

  data
    .map(cb)
    .map((item) =>
      Array.isArray(item) ? embed.addFields(item) : embed.addFields([item]),
    );

  return embed;
}
