import { ReviewStatus } from '@packages/entities/review';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReview1716555970803 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'review',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'reviewRequestDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'reviewPostDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'reviewComment',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userRating',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'source',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reviewStatus',
            type: 'enum',
            enum: Object.values(ReviewStatus),
          },
          {
            name: 'emailOpened',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'practiceResponseDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'practiceResponse',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'practiceId',
            type: 'uuid',
          },
          {
            name: 'patientId',
            type: 'uuid',
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
      'review',
      new TableForeignKey({
        columnNames: ['practiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'practices',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //  IGNORE
  }
}
