import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminPemrission1719740699272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO permissions (name) VALUES ('admin_permission');
          `);
  }

  public async down(): Promise<void> {
    //ignore
  }
}
