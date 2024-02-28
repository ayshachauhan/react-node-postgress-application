const { Table } = require('typeorm');

module.exports = class CreatePractice1709103999895 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'practices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
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
          { name: 'name', type: 'varchar', length: '255' },
        ],
      }),
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('practices');
  }
};
