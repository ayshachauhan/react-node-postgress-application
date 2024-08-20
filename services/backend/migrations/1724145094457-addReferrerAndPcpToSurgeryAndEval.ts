import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferrerAndPcpToSurgeryAndEval1724145094457
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.surgeries ADD COLUMN "referrerId" TYPE uuid USING NULLIF("referrerId", '')::uuid, 
            ALTER TABLE public.evals ADD COLUMN "referrerId" TYPE uuid USING NULLIF("referrerId", '')::uuid, 
            ALTER TABLE public.surgeries ADD COLUMN "pcp" TYPE uuid USING NULLIF("pcp", '')::uuid, 
            ALTER TABLE public.evals ADD COLUMN "pcp" TYPE uuid USING NULLIF("pcp", '')::uuid`,
    );
  }

  public async down(): Promise<void> {}
}
