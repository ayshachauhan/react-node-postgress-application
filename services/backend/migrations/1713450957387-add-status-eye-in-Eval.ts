import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusEyeInEval1713450957387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'eye',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'doctorId',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }

  public async down(): Promise<void> {}
}
