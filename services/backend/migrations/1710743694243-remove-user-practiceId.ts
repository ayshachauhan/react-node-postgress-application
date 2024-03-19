import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class RemoveUserPracticeId1710743694243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
            SELECT constraint_name
            FROM information_schema.constraint_column_usage
            WHERE table_name = 'users' AND constraint_name LIKE 'FK_%_practices'
        `);

    const foreignKeyName = result[0]?.constraint_name;
    if (foreignKeyName) {
      await queryRunner.dropForeignKey('users', foreignKeyName);
    }

    await queryRunner.dropColumn('users', 'practiceId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ADD COLUMN practiceId INT');

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['practiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'practices',
        onDelete: 'CASCADE',
      }),
    );
  }
}
