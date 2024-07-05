import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPracticeIdColumnToSurgeriesEvals1720080483791
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'practiceId',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'evals',
      new TableColumn({
        name: 'practiceId',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {
    //Ignore
  }
}
