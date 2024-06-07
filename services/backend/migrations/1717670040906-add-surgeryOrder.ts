import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSurgeryOrder1717670040906 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'surgeryOrder',
        type: 'integer',
        isNullable: false,
        default: 0,
      }),
    );
  }

  public async down(): Promise<void> {
    // ignore
  }
}
