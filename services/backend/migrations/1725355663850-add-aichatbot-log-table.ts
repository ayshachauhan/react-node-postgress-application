import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddAichatbotLogTable1725355663850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chatbotlogs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'practiceId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assistantId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userIdentifier',
            type: 'varchar',
          },
          {
            name: 'assistantChatThreadId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'botQuestionAnswers',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'patientId',
            type: 'uuid',
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
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
          {
            name: 'dateDeleted',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['patientId'],
            referencedTableName: 'patients',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(): Promise<void> {}
}
