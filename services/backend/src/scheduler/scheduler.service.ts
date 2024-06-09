import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { HealthService } from 'src/healthz/health.service';
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
    @InjectPinoLogger(HealthService.name)
    private readonly logger: PinoLogger,
    private readonly surgeryService: SurgeryService,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Interval(5000) // This runs the task every 10 minutes
  async handleCron() {
    this.logger.info('starting to send emails');
    const today = this.getFormattedDate();

    const data = await this.emailLogRepository.find({
      where: { expectedDate: LessThanOrEqual(today), status: 'pending' },
      take: this.getMailLimit(),
    });

    this.logger.info(`Found ${data.length} emails to send`);

    const promises = data.map(async (mailData: EmailLogEntity) => {
      const { subject, pt_email_address, text, body } = mailData.data;
      const mailOptions: Mail.Options = {
        subject,
        to: pt_email_address,
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
        status: response.message.includes('250 2.0.0 OK')
          ? 'completed'
          : 'rejected',
      });
    });

    await Promise.allSettled(promises);
    this.logger.info('Processed emails');
  }

  @Cron('0 0 * * *') // every 24 hours
  async autoCompleteSurgeries() {
    this.logger.info('STARTED AUTO APPROVING SURGERIES');
    await this.surgeryService.autoCompleteSurgeries();
    this.logger.info('FINISHED AUTO APPROVING SURGERIES');
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
