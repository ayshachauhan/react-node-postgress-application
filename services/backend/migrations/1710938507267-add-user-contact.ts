import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserContact1710938507267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'contactNumber',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['contactNumber']);
  }
}
