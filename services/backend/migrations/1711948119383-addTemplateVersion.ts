import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateVersion1711948119383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" ADD COLUMN "version" varchar(10) DEFAULT 'V0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "version"`);
  }
}
