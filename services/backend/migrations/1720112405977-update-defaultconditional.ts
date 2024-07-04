import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDefaultconditional1720112405977
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE surgeries
        ALTER COLUMN "selectedConditionalOptions" SET DEFAULT '{}';
    `);

    await queryRunner.query(`
        UPDATE surgeries
        SET "selectedConditionalOptions" = '{}'
        WHERE "selectedConditionalOptions" IS NULL;
    `);

    await queryRunner.query(`
    ALTER TABLE surgery_configurations
    ALTER COLUMN "conditionalOptions" SET DEFAULT '{}';
`);

    await queryRunner.query(`
    UPDATE surgery_configurations
    SET "conditionalOptions" = '{}'
    WHERE "conditionalOptions" IS NULL;
`);
  }

  public async down(): Promise<void> {}
}
