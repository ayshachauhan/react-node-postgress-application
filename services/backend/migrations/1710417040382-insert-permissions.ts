import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertPermissions1710417040382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO permissions (name) VALUES
            ('view_future_cases'),
            ('view_past_cases'),
            ('view_billing'),
            ('view_analytics'),
            ('view_rep'),
            ('view_msg'),
            ('view_hx'),
            ('view_nurture'),
            ('view_referrers'),
            ('view_calls'),
            ('view_templates'),
            ('view_videos'),
            ('add_case'),
            ('edit_case'),
            ('edit_lens'),
            ('edit_dates'),
            ('edit_templates'),
            ('edit_dates_rebuild'),
            ('delete_case'),
            ('leaderboard_display')
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE permissions`);
  }
}
