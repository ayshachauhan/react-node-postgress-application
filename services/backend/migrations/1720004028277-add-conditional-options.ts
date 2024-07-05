import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddConditionalOptions1720004028277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgery_configurations',
      new TableColumn({
        name: 'conditionalOptions',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
