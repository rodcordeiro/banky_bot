import { UsersEntity } from '../database/entities';
import { CategoryRepository } from '../database/repositories';

export class CategoriesServices {
  static async findAll(owner: UsersEntity) {
    const qb = CategoryRepository.createQueryBuilder('category');
    return await qb
      .leftJoinAndSelect('category.subcategories', 'subcategory')
      .where('category.category IS NULL')
      .andWhere(`category.owner = :owner`, { owner: owner.id })
      .getMany();
  }
}
