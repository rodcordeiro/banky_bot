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
        name: 'bkb_tb_users',
        columns: [
          {
            name: 'id',
            isPrimary: true,
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
            type: 'varchar',
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
      'bkb_tb_users',
      new TableForeignKey({
        columnNames: ['owner'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bk_tb_user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_user_owner',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('bkb_tb_users', 'FK_user_owner');
    await queryRunner.dropTable('bkb_tb_users');
  }
}
