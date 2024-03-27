import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTemplate1710834617870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'templates',
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
            isNullable: false,
          },
          {
            name: 'surgeonId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'messageType',
            type: 'enum',
            enum: ['timed', 'evaluation', 'booking', 'referrer', 'pcp'],
          },
          {
            name: 'dateOffset',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'meridiem',
            type: 'enum',
            enum: ['AM', 'PM'],
            isNullable: true,
          },
          {
            name: 'surgeryType',
            type: 'enum',
            enum: ['YAG', 'LASIK', 'CATARACT'],
            isNullable: false,
          },
          {
            name: 'surgeryNumber',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'emailSubject',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'emailBody',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailAttachment',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email1stCataract',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email2ndCataract',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'messageText',
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
        foreignKeys: [
          {
            columnNames: ['practiceId'],
            referencedTableName: 'practices',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['surgeonId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('templates', 'FK_templates_practiceId');

    await queryRunner.dropForeignKey('templates', 'FK_templates_surgeonId');
    await queryRunner.dropTable('templates');
  }
}
