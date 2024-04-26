import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSurgery1713506661604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'surgeries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'patientId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'doctorId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'surgeryTypeId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'practiceHomeId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'insuranceTypeId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'insuranceDetails',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'eye',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lensType',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: true,
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
            columnNames: ['surgeryTypeId'],
            referencedTableName: 'surgery_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['patientId'],
            referencedTableName: 'patients',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['practiceHomeId'],
            referencedTableName: 'practice_homes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['insuranceTypeId'],
            referencedTableName: 'insurance_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['doctorId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
