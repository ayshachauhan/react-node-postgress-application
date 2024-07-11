import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EmailReadFlag1720667360686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'isRead',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(): Promise<void> {
    // ignore
  }
}
