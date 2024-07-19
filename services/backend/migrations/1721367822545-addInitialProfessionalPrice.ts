import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInitialProfessionalPrice1721367822545
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'inititalProfPrice',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
