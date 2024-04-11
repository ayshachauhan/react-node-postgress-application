import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnType1625608156512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ALTER COLUMN surgeryType TYPE uuid USING surgeryType::uuid',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ALTER COLUMN surgeryType TYPE enum USING surgeryType::enum',
    );
  }
}
