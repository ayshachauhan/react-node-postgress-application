/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { Logger, QueryRunner } from 'typeorm';
import logger from './logger';

export class TypeOrmLogger implements Logger {
  logQuery(
    query: string,
    parameters?: any[] | undefined,
    _queryRunner?: QueryRunner | undefined,
  ) {
    logger.info(query, parameters);
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[] | undefined,
    _queryRunner?: QueryRunner | undefined,
  ) {
    logger.error(error, query, parameters);
  }
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[] | undefined,
    _queryRunner?: QueryRunner | undefined,
  ) {
    logger.warn(time, query, parameters);
  }
  logSchemaBuild(message: string, _queryRunner?: QueryRunner | undefined) {
    logger.info(message);
  }
  logMigration(message: string, _queryRunner?: QueryRunner | undefined) {
    logger.info(message);
  }
  log(
    _level: 'warn' | 'info' | 'log',
    message: any,
    _queryRunner?: QueryRunner | undefined,
  ) {
    logger.info(message);
  }
}
