import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SurgeryTypeMedia1712056465574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('videos', [
      new TableColumn({
        name: 'surgeryType',
        type: 'enum',
        enum: ['CATARACT', 'YAG', 'LASIK'],
        default: "'CATARACT'",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('videos', ['surgeryType']);
  }
}
