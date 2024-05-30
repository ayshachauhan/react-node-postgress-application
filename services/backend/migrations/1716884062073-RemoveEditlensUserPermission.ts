import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEditlensUserPermission1716884062073
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM permissions
          WHERE name = 'edit_lens';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO permissions (name) VALUES ('edit_lens');
        `);
  }
}
