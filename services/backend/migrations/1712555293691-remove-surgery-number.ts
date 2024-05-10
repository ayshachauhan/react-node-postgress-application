import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveSurgeryNumber1712555293691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('templates', 'surgeryNumber');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'templates',
      new TableColumn({
        name: 'surgeryNumber',
        type: 'integer',
        isNullable: false,
      }),
    );
  }
}
