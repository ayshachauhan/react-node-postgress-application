import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeleteTemplatePermission1719740699272
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO permissions (name) VALUES ('delete_template');
          `);
  }

  public async down(): Promise<void> {
    //ignore
  }
}
