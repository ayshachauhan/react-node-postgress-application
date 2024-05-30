import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { TransporterService } from 'src/transporter';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private readonly emailLogRepository: Repository<EmailLogEntity>,
    private configService: ConfigService,
    private transporterService: TransporterService,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Cron('*/2 * * * *') // This runs the task every 10 minutes
  async handleCron() {
    const today = this.getFormattedDate();

    const data = await this.emailLogRepository.find({
      where: { expectedDate: LessThanOrEqual(today), status: 'pending' },
      take: this.getMailLimit(),
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
      await this.emailLogRepository.update(mailData.id, {
        response,
        status: response.message.includes('250 2.0.0 OK')
          ? 'completed'
          : 'rejected',
      });
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
