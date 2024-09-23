import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAssistantIdToPractice1727083992102
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'practices',
      new TableColumn({
        name: 'assistantId',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
