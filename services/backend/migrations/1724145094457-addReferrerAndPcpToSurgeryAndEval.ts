import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferrerAndPcpToSurgeryAndEval1724145094457
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.surgeries ADD COLUMN "referrerId" uuid, ADD COLUMN "pcp" uuid;
      ALTER TABLE public.evals ADD COLUMN "referrerId" uuid, ADD COLUMN "pcp" uuid;`,
    );
  }

  public async down(): Promise<void> {}
}
