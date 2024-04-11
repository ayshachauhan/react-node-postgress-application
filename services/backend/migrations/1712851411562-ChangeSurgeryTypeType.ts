import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSurgeryTypeType1712851411562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ADD COLUMN "surgeryType" UUID DEFAULT uuid_generate_v4()',
    );

    await queryRunner.query(`
        UPDATE templates 
        SET "surgeryType" = 
          CASE "surgeryTypeOld" 
            WHEN 'YAG' THEN '4ab7cf1a-1f9b-4d98-8779-f3150b732afa' 
            WHEN 'LASIK' THEN 'd7e533ac-6249-43ea-87f7-47adacc50be8' 
            WHEN 'CATARACT' THEN '971b0793-a06e-40f4-ac85-f5375bc83aa5' 
            ELSE '971b0793-a06e-40f4-ac85-f5375bc83aa5'::uuid
          END
        `);

    await queryRunner.query(
      'ALTER TABLE templates DROP COLUMN "surgeryTypeOld"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE templates ADD COLUMN "surgeryTypeOld" ENUM(YAG, LASIK, CATARACT)',
    );
    await queryRunner.query(`
        UPDATE templates 
        SET "surgeryTypeOld" = 
          CASE "surgeryType" 
            WHEN '4ab7cf1a-1f9b-4d98-8779-f3150b732afa' THEN 'YAG'
            WHEN 'd7e533ac-6249-43ea-87f7-47adacc50be8' THEN 'LASIK'
            WHEN '971b0793-a06e-40f4-ac85-f5375bc83aa5' THEN 'CATARACT'
            ELSE 'CATARACT'
          END
        `);

    await queryRunner.query('ALTER TABLE templates DROP COLUMN "surgeryType"');
  }
}
