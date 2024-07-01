import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReferrerTypeKey1719838657240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "referrers" 
            ALTER COLUMN "referrerType" DROP NOT NULL;
          `);
  }

  public async down(): Promise<void> {}
}
