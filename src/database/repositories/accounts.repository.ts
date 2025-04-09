import { AppDataSource } from '../index';
import { AccountsEntity } from '../entities';

export const AccountRepository = AppDataSource.getRepository(AccountsEntity);
