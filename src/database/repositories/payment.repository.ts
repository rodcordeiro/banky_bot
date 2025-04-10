import { AppDataSource } from '..';
import { PaymentsEntity } from '../entities';

export const PaymentTypeRepository =
  AppDataSource.getRepository(PaymentsEntity);
