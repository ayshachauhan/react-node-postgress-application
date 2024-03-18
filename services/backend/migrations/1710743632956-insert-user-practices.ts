import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserPractices1710743632956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query('SELECT id, "practiceId" FROM users');

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO user_practices ("userId", "practiceId") VALUES ('${user.id}', '${user.practiceId}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM user_practices');
  }
}
