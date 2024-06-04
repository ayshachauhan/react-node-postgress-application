import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ChangeSurgerytypeSurgeryConfig1716289562691
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('templates', 'surgeryTypeId');
    await queryRunner.addColumn(
      'templates',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.dropColumn('videos', 'surgeryTypeId');
    await queryRunner.addColumn(
      'videos',
      new TableColumn({
        name: 'surgeryConfigurationId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'templates',
      new TableForeignKey({
        columnNames: ['surgeryConfigurationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surgery_configurations', // Assuming this is the correct table name
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'videos',
      new TableForeignKey({
        columnNames: ['surgeryConfigurationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surgery_configurations', // Assuming this is the correct table name
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /// Get foreign keys
    const templatesTable = await queryRunner.getTable('templates');
    const videosTable = await queryRunner.getTable('videos');

    if (templatesTable) {
      const templatesForeignKey = templatesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('surgeryConfigurationId') !== -1,
      );
      if (templatesForeignKey) {
        await queryRunner.dropForeignKey('templates', templatesForeignKey);
      }
    }
    if (videosTable) {
      const videosForeignKey = videosTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('surgeryConfigurationId') !== -1,
      );
      if (videosForeignKey) {
        await queryRunner.dropForeignKey('videos', videosForeignKey);
      }
    }

    await queryRunner.dropColumn('templates', 'surgeryConfigurationId');
    await queryRunner.addColumn(
      'templates',
      new TableColumn({
        name: 'surgeryTypeId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.dropColumn('videos', 'surgeryConfigurationId');
    await queryRunner.addColumn(
      'videos',
      new TableColumn({
        name: 'surgeryTypeId',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
