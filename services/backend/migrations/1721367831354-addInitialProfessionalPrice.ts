import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInitialProfessionalPrice1721367831354
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'inititalHospitalPrice',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
