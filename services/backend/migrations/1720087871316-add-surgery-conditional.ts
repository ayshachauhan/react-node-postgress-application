import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSurgeryConditional1720087871316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'selectedConditionalOptions',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
