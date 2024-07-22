import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInitialProfessionalPrice1721367822545
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'initialProfPrice',
        type: 'varchar',
        isNullable: true,
        default: '0',
      }),
    );
  }

  public async down(): Promise<void> {}
}
