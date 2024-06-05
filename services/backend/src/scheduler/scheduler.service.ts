import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { TransporterService } from 'src/transporter';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private emailLogRepository: Repository<EmailLogEntity>,
    private configService: ConfigService,
    private transporterService: TransporterService,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Cron('*/2 * * * *') // This runs the task every 10 minutes
  async handleCron() {
    console.log('templates cron started');

    await this.emailLogRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const emailLimit = this.getMailLimit();
        const query: string = `SELECT * FROM email_logs WHERE status = 'pending' and "expectedDate" <= CURRENT_DATE LIMIT $1 FOR UPDATE`;

        const data = await transactionalEntityManager.query(query, [
          emailLimit,
        ]);

        for (const mailData of data) {
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

          // updating status in the parent table
          await transactionalEntityManager.update(EmailLogEntity, mailData.id, {
            response,
            status: response.message.includes('250 2.0.0 OK')
              ? 'completed'
              : 'rejected',
          });
        }
      },
    );

    console.log('cron completed');
  }
}
