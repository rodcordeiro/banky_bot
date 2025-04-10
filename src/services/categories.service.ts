import { SelectQueryBuilder } from 'typeorm';
import { CategoriesEntity, UsersEntity } from '../database/entities';
import { CategoryRepository } from '../database/repositories';

export class CategoriesServices {
  static async findAll(
    owner: UsersEntity,
    filters?: (qb: SelectQueryBuilder<CategoriesEntity>) => void,
  ) {
    const qb = CategoryRepository.createQueryBuilder(
      'category',
    ).leftJoinAndSelect('category.subcategories', 'subcategory');

    if (filters) filters(qb);

    return qb
      .where('category.category IS NULL')
      .andWhere(`category.owner = :owner`, { owner: owner.id })
      .getMany();
  }
}
