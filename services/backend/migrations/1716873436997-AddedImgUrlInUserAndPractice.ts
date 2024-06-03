import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedImgUrlInUserAndPractice1716873436997
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "imgUrl" VARCHAR NULL`);

    await queryRunner.query(
      `ALTER TABLE "practices" RENAME COLUMN "photoUrl" TO "imgUrl"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "imgUrl"`);

    await queryRunner.query(
      `ALTER TABLE "practices" RENAME COLUMN "photoUrl" TO "imgUrl"`,
    );
  }
}
