import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePriceTypeSurgery1717735305504 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "surgeries" 
        ALTER COLUMN "totalHospitalPricing" 
        TYPE VARCHAR USING "totalHospitalPricing"::VARCHAR
    `);

    await queryRunner.query(`
        ALTER TABLE "surgeries" 
        ALTER COLUMN "totalProfessionalPricing" 
        TYPE VARCHAR USING "totalHospitalPricing"::VARCHAR
    `);
  }

  public async down(): Promise<void> {
    //ignore
  }
}
