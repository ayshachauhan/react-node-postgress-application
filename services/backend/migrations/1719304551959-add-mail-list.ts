import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMailList1719304551959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'practices',
      new TableColumn({
        name: 'emailData',
        type: 'jsonb',
        isNullable: true,
        default: `'{ 
                "staffEmails": [], 
                "operatingRoomEmails": [], 
                "adminEmails": [], 
                "adminCellEmails": [] 
            }'`,
      }),
    );
  }

  public async down(): Promise<void> {
    //ignore
  }
}
