import { SelectQueryBuilder } from 'typeorm';
import { AccountsEntity, UsersEntity } from '../database/entities';
import {
  AccountRepository,
  PaymentTypeRepository,
} from '../database/repositories';

export class AccountsService {
  static async findAll(
    owner: UsersEntity,
    filters?: (qb: SelectQueryBuilder<AccountsEntity>) => void,
  ) {
    const qb = AccountRepository.createQueryBuilder('a');
    if (filters) filters(qb);
    return await qb.where(`a.owner = :owner`, { owner: owner.id }).getMany();
  }
  static async findBy(
    owner: UsersEntity,
    filters: (qb: SelectQueryBuilder<AccountsEntity>) => void,
  ) {
    const qb = AccountRepository.createQueryBuilder('a');
    qb.where(`a.owner = :owner`, { owner: owner.id });
    filters(qb);
    return await qb.getOneOrFail();
  }

  static async listPaymentTypes() {
    return (await PaymentTypeRepository.find()).map((i) => ({
      name: i.name,
      value: i.id,
    }));
  }

  static async create(data: AccountsEntity, user: UsersEntity) {
    const details = AccountRepository.create(data);
    const paymentType = await PaymentTypeRepository.findOneByOrFail({
      id: data.paymentType?.toString(),
    });

    const transaction = await AccountRepository.save({
      ...details,
      paymentType: paymentType.id,
      owner: user.id,
    });

    return transaction;
  }
}
