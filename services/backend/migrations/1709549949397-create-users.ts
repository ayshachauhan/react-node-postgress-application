import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1709549949397 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'userName',
            type: 'varchar',
          },
          {
            name: 'fullName',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'userUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userType',
            type: 'enum',
            enum: ['super admin', 'admin', 'user', 'guest'],
            default: "'user'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactice', 'pending'],
            default: "'active'",
          },
          {
            name: 'dateCreated',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'dateUpdated',
            type: 'timestamp',
            default: 'now()',
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
