const { Table } = require('typeorm');

module.exports = class CreatePracticeHome1622933799215 {
  async up(queryRunner) {
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
          {
            name: 'dateDeleted',
            type: 'timestamp',
            isNullable: true,
            select: false,
          },
          {
            name: 'name',
            type: 'varchar',
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

  async down(queryRunner) {
    await queryRunner.dropTable('practice_homes');
  }
};
