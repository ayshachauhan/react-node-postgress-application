import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDesignationUsers1717654091181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the designation column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'designation',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Change the url column to be nullable
    await queryRunner.changeColumn(
      'users',
      'url',
      new TableColumn({
        name: 'url',
        type: 'varchar',
        isNullable: true, // This removes the NOT NULL constraint
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the designation column
    await queryRunner.dropColumn('users', 'designation');

    // Change the url column back to be NOT NULL
    await queryRunner.changeColumn(
      'users',
      'url',
      new TableColumn({
        name: 'url',
        type: 'varchar',
        isNullable: false, // This re-adds the NOT NULL constraint
      }),
    );
  }
}
