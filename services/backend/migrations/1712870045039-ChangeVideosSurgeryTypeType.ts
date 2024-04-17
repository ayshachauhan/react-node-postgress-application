import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeVideosSurgeryTypeType1712870045039
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE videos ADD COLUMN "surgeryType" UUID DEFAULT uuid_generate_v4() NOT NULL',
    );

    await queryRunner.query('ALTER TABLE videos DROP COLUMN "surgeryTypeOld"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE videos ADD COLUMN "surgeryTypeOld" ENUM(YAG, LASIK, CATARACT)',
    );

    await queryRunner.query('ALTER TABLE videos DROP COLUMN "surgeryType"');
  }
}
