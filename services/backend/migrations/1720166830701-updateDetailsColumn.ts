import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateDetailsColumn1720166830701 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add Notes column to Surgeries table
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.dropColumn('patients', 'details');
  }

  public async down(): Promise<void> {
    //ignore
  }
}
