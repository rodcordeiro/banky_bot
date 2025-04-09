import { AppDataSource } from '../index';
import { CategoriesEntity } from '../entities';

export const CategoryRepository = AppDataSource.getRepository(CategoriesEntity);
