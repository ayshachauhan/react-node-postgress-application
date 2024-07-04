import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSurgeryIdcolumn1719830665275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'review',
      new TableColumn({
        name: 'surgeryId',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
