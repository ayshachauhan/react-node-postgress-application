import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameVideosSurgeryTypeType1712869803471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE videos RENAME COLUMN "surgeryType" TO "surgeryTypeOld"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE videos RENAME COLUMN "surgeryTypeOld" TO "surgeryType"',
    );
  }
}
