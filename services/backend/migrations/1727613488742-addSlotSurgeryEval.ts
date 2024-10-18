import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSlotSurgeryEval1727613488742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'slot',
        type: 'decimal',
        precision: 3,
        scale: 1,
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(): Promise<void> {}
}
