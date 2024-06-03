import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSpecificPermissions1716016749250
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM permissions WHERE name IN (
          'view_calls',
          'edit_dates_rebuild'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Optional: If you want to add these permissions back in the down migration
    await queryRunner.query(`
      INSERT INTO permissions (name) VALUES
        ('view_calls'),
        ('edit_dates_rebuild');
    `);
  }
}
