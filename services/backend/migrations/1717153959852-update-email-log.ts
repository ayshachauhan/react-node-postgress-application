import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateEmailLog1717153959852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email_logs',
      new TableColumn({
        name: 'practiceId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'email_logs',
      new TableForeignKey({
        columnNames: ['practiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'practices',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
