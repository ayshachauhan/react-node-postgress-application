import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBookedHoursCalendar1727782542739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'calendars',
      new TableColumn({
        name: 'bookedHours',
        type: 'decimal',
        isNullable: false,
        default: 0,
      }),
    );
  }

  public async down(): Promise<void> {}
}
