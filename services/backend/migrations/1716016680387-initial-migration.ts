import { readFileSync } from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1716016680387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = readFileSync(`${__dirname}/scripts/initial-migration.sql`, {
      encoding: 'utf-8',
    });

    await queryRunner.query(query);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    //ignore
  }
}
