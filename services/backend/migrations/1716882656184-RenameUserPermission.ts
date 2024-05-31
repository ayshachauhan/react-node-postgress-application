import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserPermission1716882656184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE permissions
          SET name = 'edit_calendar'
          WHERE name = 'edit_dates';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE permissions
          SET name = 'edit_dates'
          WHERE name = 'edit_calendar';
        `);
  }
}
