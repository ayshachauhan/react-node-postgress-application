import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserType1711037360967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "users_type_enum" ADD VALUE 'physician'`,
    );
  }

  public async down(): Promise<void> {}
}
