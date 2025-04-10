import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { UsersEntity } from './users.entity';

@Entity('bk_tb_parameters')
export class ParameterEntity extends BaseEntity {
  /** Columns */
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  key!: string;

  /** Joins */

  /** Methods */
}

@Entity('bk_tb_parameter_values')
export class ParameterValueEntity extends BaseEntity {
  /** Columns */
  @Column({ type: 'varchar' })
  value!: string;

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

  @ManyToOne(() => ParameterEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'parameter',
    referencedColumnName: 'id',
  })
  parameter!: string;

  /** Methods */
}
