import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEmailJunction1716973601142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'surgery_emails',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'surgeryId',
            type: 'uuid',
          },
          {
            name: 'emailLogId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'eval_emails',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'evalId',
            type: 'uuid',
          },
          {
            name: 'emailLogId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'surgery_emails',
      new TableForeignKey({
        columnNames: ['surgeryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surgeries',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'surgery_emails',
      new TableForeignKey({
        columnNames: ['emailLogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'email_logs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'eval_emails',
      new TableForeignKey({
        columnNames: ['evalId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'evals',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'eval_emails',
      new TableForeignKey({
        columnNames: ['emailLogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'email_logs',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
