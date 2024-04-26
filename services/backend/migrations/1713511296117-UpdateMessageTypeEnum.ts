import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateeMessageTypeEnum1713511296117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE templates_messagetype_enum RENAME TO old_templates_messagetype_enum
        `);

    await queryRunner.query(`
            CREATE TYPE templates_messagetype_enum AS ENUM ('booking', 'pcp', 'referrer', 'preop', 'postop')
        `);

    await queryRunner.query(`
            ALTER TABLE templates
            ALTER COLUMN "messageType" TYPE templates_messagetype_enum
            USING "messageType"::text::templates_messagetype_enum
        `);

    await queryRunner.query(`
            DROP TYPE old_templates_messagetype_enum
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE templates_messagetype_enum RENAME TO old_templates_messagetype_enum
        `);

    await queryRunner.query(`
            CREATE TYPE templates_messagetype_enum AS ENUM ('booking', 'pcp', 'referrer', 'preop', 'postop')
        `);

    await queryRunner.query(`
            ALTER TABLE templates
            ALTER COLUMN "messageType" TYPE templates_messagetype_enum
            USING "messageType"::text::templates_messagetype_enum
        `);

    await queryRunner.query(`
            DROP TYPE old_templates_messagetype_enum
        `);
  }
}
