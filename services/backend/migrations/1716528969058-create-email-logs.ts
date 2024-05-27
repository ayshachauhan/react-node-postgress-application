import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEmailLogs1716528969058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_logs',
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
            name: 'templateId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'response',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'expectedDate',
            type: 'date',
          },
          {
            name: 'isEval',
            type: 'boolean',
          },
          {
            name: 'systemTemplateName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dateCreated',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dateUpdated',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dateDeleted',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // await queryRunner.createForeignKey("email_logs", new TableForeignKey({
    //   columnNames: ["surgeryId"],
    //   referencedColumnNames: ["id"],
    //   referencedTableName: "surgeries",
    //   onDelete: "CASCADE"
    // }));

    await queryRunner.createForeignKey(
      'email_logs',
      new TableForeignKey({
        columnNames: ['templateId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'templates',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
