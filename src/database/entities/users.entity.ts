import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity('bk_tb_user')
export class UsersEntity extends BaseEntity {
  /** Columns */

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ select: false })
  refreshToken!: string;

  /** Joins */

  /** Methods */
  
}
