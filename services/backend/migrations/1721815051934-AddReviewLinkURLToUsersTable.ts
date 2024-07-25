import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReviewLinkURLToUsersTable1721815051934
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'reviewLinkURL',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {}
}
