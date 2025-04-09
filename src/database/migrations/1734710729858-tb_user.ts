import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TbUser1734710729858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bk_tb_bot_users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'discord_id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'owner',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'tb_bot_user',
      new TableForeignKey({
        columnNames: ['owner'],
        referencedColumnNames: ['id'],
        referencedTableName: 'TB_USERS',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_user_owner',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tb_bot_user', 'FK_user_owner');
    await queryRunner.dropTable('tb_bot_user');
  }
}
