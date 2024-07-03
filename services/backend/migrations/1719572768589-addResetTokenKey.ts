import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReasetPasswordDoneKey1719572768589
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'token',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
