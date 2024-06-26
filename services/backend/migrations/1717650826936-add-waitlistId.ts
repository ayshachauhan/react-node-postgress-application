import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddWaitlistId1717650826936 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'waitlistId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'waitlistId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'surgeries',
      new TableForeignKey({
        columnNames: ['waitlistId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'waitlist',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'evals',
      new TableForeignKey({
        columnNames: ['waitlistId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'waitlist',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
