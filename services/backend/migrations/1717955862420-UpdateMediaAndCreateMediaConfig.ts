import { MediaConfigType } from '@packages/entities/mediaConfig';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateMediaAndCreateMediaConfig1717955862420
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mediaconfig',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'mediaId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'configType',
            type: 'enum',
            enum: Object.values(MediaConfigType),
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'mediaconfig',
      new TableForeignKey({
        columnNames: ['mediaId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'media',
        onDelete: 'CASCADE',
      }),
    );

    // Remove the old mediaConfig column from media table
    await queryRunner.dropColumn('media', 'mediaConfig');

    // Add the new entityId column to media table
    await queryRunner.addColumn(
      'media',
      new TableColumn({
        name: 'entityId',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('media', 'entityId');
    await queryRunner.dropColumn('media', 'entityId');

    // Add the old mediaConfig column back to media table
    await queryRunner.addColumn(
      'media',
      new TableColumn({
        name: 'mediaConfig',
        type: 'jsonb',
      }),
    );

    // Drop the mediaconfig table
    await queryRunner.dropTable('mediaconfig');
  }
}
