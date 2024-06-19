import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSurgeryStatus1718780172292 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE public.surgeries_surgerystatus_enum ADD VALUE 'CONFIRMED'`,
    );
  }

  public async down(): Promise<void> {}
}
