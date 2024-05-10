import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDefaultEnums1713788453640 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN status SET DEFAULT 'pending'
    `);
    await queryRunner.query(`
    ALTER TABLE practices
    ALTER COLUMN status SET DEFAULT 'pending'
  `);
  }

  public async down(): Promise<void> {}
}
