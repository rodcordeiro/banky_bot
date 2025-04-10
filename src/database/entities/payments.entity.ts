import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity('bk_tb_payments')
export class PaymentsEntity extends BaseEntity {
  /** Columns */

  @Column({ type: 'varchar' })
  name!: string;

  /** Joins */

  /** Methods */
}
