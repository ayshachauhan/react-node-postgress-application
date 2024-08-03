import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmailLogExpectedDateDataType1722714065845
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE email_logs ALTER COLUMN "expectedDate" TYPE timestamp',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE email_logs ALTER COLUMN "expectedDate" TYPE date',
    );
  }
}
