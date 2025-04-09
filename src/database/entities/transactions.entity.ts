import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { UsersEntity } from './users.entity';
import { CategoriesEntity } from './categories.entity';
import { AccountsEntity } from './accounts.entity';

@Entity('bk_tb_transactions')
export class TransactionsEntity extends BaseEntity {
  /** Columns */

  @Column()
  description!: string;

  @Column()
  date?: string;

  @Column({
    type: 'double',
  })
  value!: number;

  @Column({
    name: 'batch_id',
    nullable: true,
  })
  batchId?: string;

  /** Joins */
  @ManyToOne(() => UsersEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'owner',
    referencedColumnName: 'id',
  })
  owner!: string;

  @ManyToOne(() => CategoriesEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'category',
    referencedColumnName: 'id',
  })
  category!: string;

  @ManyToOne(() => AccountsEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'account',
    referencedColumnName: 'id',
  })
  account!: string;

  /** Methods */
}
