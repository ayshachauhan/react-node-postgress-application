import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateCalendarEntity1719481239557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key for surgeryConfigurationId
    await queryRunner.dropForeignKey(
      'calendars',
      'FK_7921d3a503299cefc92084b51bb',
    );

    // Drop the surgeryConfigurationId column
    await queryRunner.dropColumn('calendars', 'surgeryConfigurationId');

    // Add the surgeryTypeId column
    await queryRunner.addColumn(
      'calendars',
      new TableColumn({
        name: 'surgeryTypeId',
        type: 'uuid',
        isNullable: false,
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

    await queryRunner.addColumn(
      'calendars',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'calendars',
      new TableForeignKey({
        columnNames: ['surgeryConfigurationId'],
        referencedTableName: 'surgery_configurations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.dropColumn('surgery_types', 'color');
  }
}
