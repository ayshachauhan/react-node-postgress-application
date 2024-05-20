import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ChangeEvalColumns1716199593831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evals" RENAME COLUMN "eye" TO "bodyPart"`,
    );
    await queryRunner.query(`ALTER TABLE "evals" DROP COLUMN "surgeryTypeId"`);

    // Add the new column
    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Add the foreign key constraint
    await queryRunner.createForeignKey(
      'evals',
      new TableForeignKey({
        columnNames: ['surgeryConfigurationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surgery_configurations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
