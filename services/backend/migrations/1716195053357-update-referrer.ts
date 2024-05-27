import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateReferrer1716195053357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'referrers',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'referrers',
      'firstName',
      new TableColumn({
        name: 'firstName',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );

    await queryRunner.changeColumn(
      'referrers',
      'lastName',
      new TableColumn({
        name: 'lastName',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'referrers',
      new TableColumn({
        name: 'verified',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(): Promise<void> {}
}
