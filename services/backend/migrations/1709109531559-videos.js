const { MigrationInterface, QueryRunner, Table } = require("typeorm");

module.exports = class Videos1709109531559 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'videos',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'practiceId',
                    type: 'uuid'
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'urlEmbed',
                    type: 'varchar'
                },
                {
                    name: 'url',
                    type: 'varchar'
                },
                {
                    name: 'dateCreated',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'dateUpdated',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'dateDeleted',
                    type: 'timestamp',
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['practiceId'],
                    referencedTableName: 'practices',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }

    async down(queryRunner) {
        await queryRunner.dropTable('videos');
    }
}
