import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnType1625608156512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates RENAME COLUMN "surgeryType" TO "surgeryTypeOld"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates RENAME COLUMN "surgeryTypeOld" TO "surgeryType"',
    );
  }
}
