import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePatientPCPDataType1723925230238
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE patients ALTER COLUMN "pcp" DROP NOT NULL, ALTER COLUMN "pcp" TYPE uuid USING NULLIF("pcp", '')::uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE patients ALTER COLUMN "pcp" SET NOT NULL, ALTER COLUMN "pcp" TYPE varchar`,
    );
  }
}
