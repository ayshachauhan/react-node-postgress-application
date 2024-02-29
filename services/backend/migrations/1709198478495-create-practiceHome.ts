import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreatePracticeHome1622933799215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'practice_homes',
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
          new TableColumn({
            name: 'dateDeleted',
            type: 'timestamp',
            isNullable: true,
          }),
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'practice_homes',
      new TableForeignKey({
        columnNames: ['practiceId'],
        referencedTableName: 'practices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'practice_homes',
      'FK_practice_homes_practiceId',
    );
    await queryRunner.dropTable('practice_homes');
  }
}
