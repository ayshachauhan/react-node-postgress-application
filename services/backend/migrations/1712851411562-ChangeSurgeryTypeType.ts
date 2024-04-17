import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSurgeryTypeType1712851411562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ADD COLUMN "surgeryType" UUID DEFAULT uuid_generate_v4() NOT NULL',
    );

    await queryRunner.query(
      'ALTER TABLE templates DROP COLUMN "surgeryTypeOld"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ADD COLUMN "surgeryTypeOld" ENUM(YAG, LASIK, CATARACT)',
    );

    await queryRunner.query('ALTER TABLE templates DROP COLUMN "surgeryType"');
  }
}
