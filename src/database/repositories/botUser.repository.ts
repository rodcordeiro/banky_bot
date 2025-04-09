import { BotUserEntity } from '../entities';
import { AppDataSource } from '../index';

export const BotUserRepository = AppDataSource.getRepository(BotUserEntity);
