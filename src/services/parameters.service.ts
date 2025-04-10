import { ParameterValueRepository } from '../database/repositories';

export class ParametersService {
  static async getByKey(key: string) {
    const qb = ParameterValueRepository.createQueryBuilder('a');
    qb.innerJoin('bk_tb_parameters', 'b', 'a.parameter=b.id');
    qb.where('b.key =:key', { key });
    return (await qb.getOneOrFail()).value;
  }
}
