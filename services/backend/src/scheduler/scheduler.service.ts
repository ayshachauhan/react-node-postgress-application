import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { EmailLogEntity } from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { TransporterService } from 'src/transporter';
import { DataSource, LessThanOrEqual } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    private configService: ConfigService,
    private transporterService: TransporterService,
    private readonly dataSource: DataSource,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Cron('*/2 * * * *') // This runs the task every 10 minutes
  async handleCron() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const today = this.getFormattedDate();

      const data = await queryRunner.manager.find(EmailLogEntity, {
        where: { expectedDate: LessThanOrEqual(today), status: 'pending' },
        take: this.getMailLimit(),
        lock: { mode: 'pessimistic_write' }, // Lock the rows for update
      });

      for (let i = 0; i < data.length; i++) {
        const mailData = data[i];
        const { subject, pt_email_address, text, body } = mailData.data;
        const mailOptions: Mail.Options = {
          subject,
          to: pt_email_address,
          text,
          html: body,
        };

        // sending mail here
        const response = await this.transporterService.sendEmail(
          mailOptions,
          mailData.data,
        );

        //updating status in the parent table
        await queryRunner.manager.update(EmailLogEntity, mailData.id, {
          response,
          status: response.message.includes('250 2.0.0 OK')
            ? 'completed'
            : 'rejected',
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDateString = `${year}-${month}-${day}`;

    return new Date(formattedDateString);
  }
}
