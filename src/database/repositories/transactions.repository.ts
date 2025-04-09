import { AppDataSource } from '../index';
import { TransactionsEntity } from '../entities';

export const TransactionsRepository =
  AppDataSource.getRepository(TransactionsEntity);
