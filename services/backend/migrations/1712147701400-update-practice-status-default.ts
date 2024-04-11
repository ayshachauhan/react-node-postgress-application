import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePracticeStatusDefault1712147701400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "practices" ALTER COLUMN status SET DEFAULT 'pending'`,
    );
  }

  public async down(): Promise<void> {}
}
