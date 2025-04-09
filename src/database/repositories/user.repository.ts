import { AppDataSource } from '../index';
import { UsersEntity } from '../entities';

export const UserRepository = AppDataSource.getRepository(UsersEntity);
