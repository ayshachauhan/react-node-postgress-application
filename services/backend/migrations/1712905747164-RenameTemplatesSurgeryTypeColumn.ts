import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTemplatesSurgeryTypeColumn1712905747164
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates RENAME COLUMN "surgeryType" TO "surgeryTypeId"',
    );

    await queryRunner.query(
      `ALTER TABLE templates 
             ADD CONSTRAINT "FK_surgeryTypeId" 
             FOREIGN KEY ("surgeryTypeId") REFERENCES surgery_types("id") 
             ON DELETE RESTRICT ON UPDATE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE templates DROP CONSTRAINT "FK_surgeryTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE templates RENAME COLUMN "surgeryTypeId" TO "surgeryType"`,
    );
  }
}
