import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as Entities from './entities';
import * as path from 'path';

const migrationsPath = path.resolve(
  __dirname,
  '../database/migrations/{*.ts,*.js}',
);
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  entities: Entities,
  migrations: [migrationsPath],
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'bkb_tb_migrations',
  logging: process.env.NODE_ENV === 'development',
  name: 'database',
  // debug: true,
});
