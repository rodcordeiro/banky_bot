import { AppDataSource } from '..';
import { ParameterEntity, ParameterValueEntity } from '../entities';

export const ParameterRepository = AppDataSource.getRepository(ParameterEntity);
export const ParameterValueRepository =
  AppDataSource.getRepository(ParameterValueEntity);
