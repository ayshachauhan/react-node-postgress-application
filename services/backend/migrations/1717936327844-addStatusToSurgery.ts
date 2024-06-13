import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToSurgery1717936327844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'surgeryStatus',
        type: 'varchar',
        isNullable: false,
        default: "'PENDING'",
      }),
    );
  }

  public async down(): Promise<void> {}
}
