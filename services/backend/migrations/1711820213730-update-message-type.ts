import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMessageTypeEnum1711820213730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."templates_messagetype_enum" RENAME TO "templates_messagetype_enum_old"`,
    );

    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "messageType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."templates_messagetype_enum" AS ENUM('booking', 'evaluation', 'pcp', 'referrer', 'preop','postop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "messageType" TYPE "public"."templates_messagetype_enum" USING "messageType"::"text"::"public"."templates_messagetype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."templates_messagetype_enum_old"`,
    );
  }

  public async down(): Promise<void> {}
}
