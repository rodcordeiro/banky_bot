import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity('bk_tb_user')
export class UsersEntity extends BaseEntity {
  /** Columns */

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  username!: string;

  /** Joins */

  /** Methods */
}
