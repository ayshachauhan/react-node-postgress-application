import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAttachmentToTemplate1717870613098
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'attachment',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
