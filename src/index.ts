import 'reflect-metadata';
import { ActivityType } from 'discord.js';

import { config } from './common/config';
import { client } from './core/discord/client.discord';
import './commands';
import './core/events';
import { AppDataSource } from './database';

AppDataSource.initialize().then(() =>
  client.login(config.app.TOKEN).then(() => {
    // client.user?.setActivity('Listenint to /help for some help...');
    client.user?.setPresence({
      status: 'online',
      activities: [
        {
          name: "There's /help for some help...",
          type: ActivityType.Custom,
        },
        // {
        //   name: 'some financial managements',
        //   type: ActivityType.Playing,
        // },
      ],
    });
  }),
);
