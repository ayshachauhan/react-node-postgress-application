import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReferrer1713856729807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE referrers ALTER COLUMN "firstName" DROP NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE referrers ALTER COLUMN "email" SET NOT NULL`,
    );
  }

  public async down(): Promise<void> {}
}
