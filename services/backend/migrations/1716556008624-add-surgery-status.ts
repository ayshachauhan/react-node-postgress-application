import { SurgeryStatus } from '@packages/entities/surgery';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSurgeryStatus1716556008624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new column
    await queryRunner.addColumn(
      'surgeries',
      new TableColumn({
        name: 'surgeryStatus',
        type: 'enum',
        enum: Object.values(SurgeryStatus),
      }),
    );
  }

  public async down(): Promise<void> {}
}
