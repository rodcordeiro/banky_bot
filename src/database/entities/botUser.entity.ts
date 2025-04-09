import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'bk_tb_bot_users' })
export class BotUserEntity extends BaseEntity {
  /** COLUMNS */
  @Column({ type: 'varchar' })
  discord_id!: string;
  /** JOINS */
  @OneToOne(() => UsersEntity, {
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'owner', referencedColumnName: 'id' })
  owner?: number;
}
