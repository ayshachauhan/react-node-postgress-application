import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ConvertReferrerToFk1713424850181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'referrerId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('patients', 'referrer');
  }

  public async down(): Promise<void> {}
}
