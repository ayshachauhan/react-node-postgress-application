import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import logger from 'src/logger';
import { SurgeryService } from 'src/surgery/surgery.service';
import { TransporterService } from 'src/transporter';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private readonly emailLogRepository: Repository<EmailLogEntity>,
    private configService: ConfigService,
    private transporterService: TransporterService,
    private readonly surgeryService: SurgeryService,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Interval(5000) // This runs the task every 10 minutes
  async handleCron() {
    logger.info('starting to send emails');
    const today = this.getFormattedDate();

    const data = await this.emailLogRepository.find({
      where: { expectedDate: LessThanOrEqual(today), status: 'pending' },
      take: this.getMailLimit(),
    });

    logger.info(`Found ${data.length} emails to send`);

    const promises = data.map(async (mailData: EmailLogEntity) => {
      const { subject, text, body, to } = mailData.data;
      const mailOptions: Mail.Options = {
        subject,
        to,
        text,
        html: body,
        attachments: mailData.attachment ? [{ path: mailData.attachment }] : [],
      };

      // sending mail here
      const response = await this.transporterService.sendEmail(
        mailOptions,
        mailData.data,
      );

      //updating status in the parent table
      await this.emailLogRepository.update(mailData.id, {
        response,
        status:
          'status' in response && response.status == 'rejected'
            ? 'rejected'
            : 'completed',
      });
    });

    await Promise.allSettled(promises);
    logger.info('Processed emails');
  }

  @Cron('0 0 * * *') // every 24 hours
  async autoCompleteSurgeries() {
    logger.info('STARTED AUTO APPROVING SURGERIES');
    await this.surgeryService.autoCompleteSurgeries();
    logger.info('FINISHED AUTO APPROVING SURGERIES');
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
