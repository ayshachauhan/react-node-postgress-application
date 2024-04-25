import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameVideosSurgeryTypeColumn1712903853640
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE videos RENAME COLUMN "surgeryType" TO "surgeryTypeId"',
    );

    await queryRunner.query(
      `ALTER TABLE videos 
             ADD CONSTRAINT "FK_surgeryTypeId" 
             FOREIGN KEY ("surgeryTypeId") REFERENCES surgery_types("id") 
             ON DELETE RESTRICT ON UPDATE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE videos DROP CONSTRAINT "FK_surgeryTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE videos RENAME COLUMN "surgeryTypeId" TO "surgeryType"`,
    );
  }
}
