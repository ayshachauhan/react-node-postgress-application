import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateCalendarEntity1719481239557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'calendars',
      'surgeryConfigurationId',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add the surgeryTypeId column
    await queryRunner.addColumn(
      'calendars',
      new TableColumn({
        name: 'surgeryTypeId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add the foreign key for surgeryTypeId
    await queryRunner.createForeignKey(
      'calendars',
      new TableForeignKey({
        columnNames: ['surgeryTypeId'],
        referencedTableName: 'surgery_types',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'surgery_types',
      new TableColumn({
        name: 'color',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('calendars', 'surgeryTypeId');

    await queryRunner.dropColumn('surgery_types', 'color');

    await queryRunner.changeColumn(
      'calendars',
      'surgeryConfigurationId',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
