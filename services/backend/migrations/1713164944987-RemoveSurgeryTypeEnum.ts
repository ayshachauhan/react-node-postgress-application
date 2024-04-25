import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSurgeryTypeEnum1713164944987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'templates_surgerytype_enum') THEN
                DROP TYPE templates_surgerytype_enum;
            END IF;
        END
        $$;
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'videos_surgerytype_enum') THEN
                DROP TYPE videos_surgerytype_enum;
            END IF;
        END
        $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE templates_surgerytype_enum AS ENUM('YAG', 'LASIK', 'CATARACT');
        CREATE TYPE videos_surgerytype_enum AS ENUM('CATARACT', 'YAG', 'LASIK');
    `);
  }
}
