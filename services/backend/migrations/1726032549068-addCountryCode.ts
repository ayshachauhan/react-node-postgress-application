import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCountryCode1726032549068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'countryCode',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'countryCode',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
