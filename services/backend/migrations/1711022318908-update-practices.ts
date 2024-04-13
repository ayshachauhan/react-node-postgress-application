import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatePractices1711022318908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('practices', [
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'pending'],
        isNullable: false,
        default: "'active'",
      }),
      new TableColumn({
        name: 'photoUrl',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['code', 'status', 'photoUrl']);
  }
}
