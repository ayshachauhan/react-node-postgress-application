import { SurgeryStatus } from "@packages/entities/surgery";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateSurgeryStatus1718020408406 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('surgeries', 'surgeryStatus');

        await queryRunner.addColumn(
            'surgeries',
            new TableColumn({
                name: 'surgeryStatus',
                type: 'enum',
                enum: Object.values(SurgeryStatus),
                isNullable: false,
                default: "'PENDING'",
            }),
        );
    }

    public async down(): Promise<void> {
    }

}
