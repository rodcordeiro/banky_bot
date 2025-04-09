import { AppDataSource } from '..';
import { PaymentEntity } from '../entities';

export const PaymentTypeRepository = AppDataSource.getRepository(PaymentEntity);
