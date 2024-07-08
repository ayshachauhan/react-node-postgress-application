import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSurgeryidentifierAndCount1720157870957
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'identifier',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'count',
        type: 'integer',
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(): Promise<void> {}
}
