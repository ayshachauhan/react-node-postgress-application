import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSsmsStatusEmailLogs1728021129921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'smsStatus',
        type: 'varchar',
        isNullable: false,
        default: "'queued'",
      }),
    );

    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'smsAttempts',
        isNullable: false,
        type: 'integer',
        default: 0,
      }),
    );

    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'emailAttempts',
        isNullable: false,
        type: 'integer',
        default: 0,
      }),
    );
  }

  public async down(): Promise<void> {}
}
