import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMessageTypeEnum1721131698142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE public.templates_messagetype_enum ADD VALUE 'evaluation'`,
    );
  }

  public async down(): Promise<void> {}
}
