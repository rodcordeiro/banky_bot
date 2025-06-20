import { randomUUID } from 'crypto';
import { SelectQueryBuilder } from 'typeorm';
import { TransactionsEntity, UsersEntity } from '../database/entities';
import {
  AccountRepository,
  CategoryRepository,
  TransactionsRepository,
} from '../database/repositories';
import { ParametersService } from './parameters.service';
import { AccountsService } from './accounts.service';

export class TransactionsService {
  static async findAll(
    owner: UsersEntity,
    filters?: (qb: SelectQueryBuilder<TransactionsEntity>) => void,
  ) {
    const qb = TransactionsRepository.createQueryBuilder('a');
    qb.leftJoinAndSelect('a.category', 'b', 'a.category = b.id');
    qb.leftJoinAndSelect('a.account', 'c', 'a.account = c.id');
    if (filters) {
      filters(qb);
    }
    return await qb.where(`a.owner = :owner`, { owner: owner.id }).getMany();
  }

  static async create(data: TransactionsEntity, user: UsersEntity) {
    const details = TransactionsRepository.create(data);
    const account = await AccountRepository.findOneByOrFail({
      id: data.account.toString(),
    });
    const category = await CategoryRepository.findOneByOrFail({
      id: data.category.toString(),
    });
    const transaction = await TransactionsRepository.save({
      ...details,
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      account: account.id,
      category: category.id,
      owner: user.id,
    });
    await AccountRepository.update(account.id, {
      ammount: account.ammount + data.value * (category.positive ? 1 : -1),
    });
    return {
      ...transaction,
      category: category.name,
      account: account.name,
      owner: user.name,
    };
  }

  static async createTransfer(
    origin: string,
    destiny: string,
    description: string,
    value: number,
    owner: UsersEntity,
    date?: Date,
  ) {
    const originAccount = await AccountsService.findOneBy(owner, (qb) => {
      qb.andWhere('a.id = :id', { id: origin });
    });

    const destinyAccount = await AccountsService.findOneBy(owner, (qb) => {
      qb.andWhere('a.id= :id', { id: destiny });
    });

    if (!originAccount || !destinyAccount) throw new Error('Account not found');

    const originCategoryParam = await ParametersService.getByKey(
      'transference_origin_category',
      owner.id,
    );
    const destinyCategoryParam = await ParametersService.getByKey(
      'transference_destiny_category',
      owner.id,
    );
    const originCategory = await CategoryRepository.findOneByOrFail({
      id: originCategoryParam,
    });
    const destinyCategory = await CategoryRepository.findOneByOrFail({
      id: destinyCategoryParam,
    });

    const batchId = randomUUID();

    const originTransaction = TransactionsRepository.create({
      description: description,
      value: value,
      batchId,
      owner: owner,
      category: originCategory.id,
      account: originAccount.id,
      date: date || new Date().toISOString(),
    } as unknown as TransactionsEntity);

    const destinyTransaction = TransactionsRepository.create({
      description: description,
      value: value,
      batchId,
      owner: owner,
      category: destinyCategory.id,
      account: destinyAccount.id,
      date: date || new Date().toISOString(),
    } as unknown as TransactionsEntity);

    originAccount.ammount = originAccount.ammount - value;
    destinyAccount.ammount = destinyAccount.ammount + value;

    await TransactionsRepository.save([originTransaction, destinyTransaction]);
    await AccountRepository.save([originAccount, destinyAccount]);
  }
  static async payCredit(data: {
    origin: string;
    credit_account: string;
    value: number;
    owner: UsersEntity;
    description?: string;
    date?: Date;
  }) {
    const originAccount = await AccountsService.findOneBy(data.owner, (qb) => {
      qb.andWhere('a.id = :id', { id: data.origin });
    });

    const destinyAccount = await AccountsService.findOneBy(data.owner, (qb) => {
      qb.andWhere('a.id= :id', { id: data.credit_account });
    });

    const originCategoryParam = await ParametersService.getByKey(
      'credit_payment_category',
      data.owner.id,
    );

    const originTransaction = TransactionsRepository.create({
      description: data.description ?? 'Pagamento cartão de crédito',
      value: data.value,
      owner: data.owner,
      category: originCategoryParam,
      account: originAccount.id,
      date: data.date || new Date().toISOString(),
    } as unknown as TransactionsEntity);

    originAccount.ammount = originAccount.ammount - data.value;
    destinyAccount.ammount = destinyAccount.ammount + data.value;

    await TransactionsRepository.save([originTransaction]);
    await AccountRepository.save([originAccount, destinyAccount]);
    return {
      ...originTransaction,
      account: originAccount.name,
      credit_account: destinyAccount.name,
    };
  }
}
