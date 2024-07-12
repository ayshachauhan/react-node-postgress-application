import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity, IEmailLog } from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import logger from 'src/logger';
import { SurgeryService } from 'src/surgery/surgery.service';
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { formatHeaderDate } from 'src/utils';
import { Equal, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private readonly emailLogRepository: Repository<EmailLogEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private transporterService: TransporterService,
    private readonly surgeryService: SurgeryService,
    // private dataSource: DataSource,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Interval(15000) // This runs the task every 10 seconds
  async handleCron() {
    // const lockKey = 123456; // Unique key for the advisory lock

    logger.info('starting to send emails');

    // Acquire advisory lock
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      // await queryRunner.manager.query('SELECT pg_advisory_lock($1)', [lockKey]);
      // logger.info(`Advisory lock acquired with lockKey: ${lockKey}`);

      const today = this.getFormattedDate();

      const data = await this.emailLogRepository.find({
        where: { expectedDate: LessThanOrEqual(today), status: 'pending' },
        take: this.getMailLimit(),
        relations: ['practice'],
      });

      logger.info(`Found ${data.length} emails to send`);

      const promises = data.map(async (mailData: EmailLogEntity) => {
        const { subject, text, body, to, cc } = mailData.data;
        const mailOptions: Mail.Options = {
          subject,
          to,
          text,
          html:
            this.addImgForReadCheck(body, mailData.practice.id, mailData.id) ??
            '',
          attachments: mailData.attachment
            ? [{ path: mailData.attachment }]
            : [],
          cc: cc ?? '',
        };

        // sending mail here
        const response = await this.transporterService.sendEmail(
          mailOptions,
          mailData.data,
        );

        // updating status in the parent table
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

      // Commit the transaction
      // await queryRunner.commitTransaction();
    } catch (error) {
      logger.error('Error processing emails:', error);
      // Rollback the transaction in case of error
      // await queryRunner.rollbackTransaction();
    } finally {
      // Release advisory lock
      // await queryRunner.manager.query('SELECT pg_advisory_unlock($1)', [
      //   lockKey,
      // ]);
      // logger.info('Advisory lock released');
      // await queryRunner.release();
    }
  }

  @Cron('0 0 * * *') // every 24 hours
  async autoCompleteSurgeries() {
    logger.info('STARTED AUTO APPROVING SURGERIES');
    await this.surgeryService.autoCompleteSurgeries();
    logger.info('FINISHED AUTO APPROVING SURGERIES');
  }

  @Cron('0 0 * * *') // every 24 hours
  async createDailySummary() {
    const today = this.getFormattedDate();

    const dailySummaryByPractice = {};

    const data = await this.emailLogRepository.find({
      where: { expectedDate: Equal(today), status: 'completed' },
      relations: ['practice', 'practice.users'],
    });

    const emailLogEntries: Partial<IEmailLog>[] = [];

    // filtering data on the basis of separate practices
    data.forEach((ele) => {
      if (dailySummaryByPractice[ele.practice.id]) {
        if (
          ele.data.pt_email_address &&
          ele.data.pt_email_address == ele.data.to
        ) {
          dailySummaryByPractice[ele.practice.id].push(ele);
        }
      } else {
        if (
          ele.data.pt_email_address &&
          ele.data.pt_email_address == ele.data.to
        ) {
          dailySummaryByPractice[ele.practice.id] = [ele];
        }
      }
    });

    const practiceArray: string[] = Object.keys(dailySummaryByPractice);

    // making entries to send daily summary to all cell admin in a particular practice.
    if (practiceArray.length) {
      practiceArray.forEach((practice) => {
        const mailDate = formatHeaderDate(String(new Date()));
        const dailyDataArray: IEmailLog[] = dailySummaryByPractice[practice];
        const currentPractice = dailyDataArray[0].practice;

        // fetching the admin cell emails of a practice
        const to: string[] = currentPractice.emailData.adminEmails;
        const phoneNumbers: string[] =
          currentPractice.emailData.adminCellEmails;
        const entry: Partial<IEmailLog> = {
          practice: currentPractice,
          expectedDate: new Date(),
          status: 'pending',
          data: {
            body: this.transporterService.readTemplates(
              SystemTemplates.DAILY_SUMMARY,
            ),
            subject: `Daily Summary Data: ${currentPractice.name}`,
            text: '',
            practiceName: currentPractice.name,
          },
        };

        let textToSend: string = '';

        const mailData = {
          emailCount: 0,
          textCount: 0,
          data: [''],
          mailDate,
        };

        dailyDataArray.forEach((dailyData: IEmailLog) => {
          if (dailyData && dailyData.data) {
            const { fname, surgery_type, text, body } = dailyData.data;
            const treasureData: string = `${fname} (${surgery_type})`;
            if (text) mailData.textCount++;
            if (body) mailData.emailCount++;
            mailData.data.push(treasureData);

            if (textToSend == '') {
              textToSend = treasureData;
            } else {
              textToSend = text + '\n' + treasureData;
            }
          }
        });

        if (textToSend) {
          textToSend =
            formatHeaderDate(String(new Date())) +
            `\n${mailData.emailCount} emails, ${mailData.textCount} Texts sent. \n\n` +
            textToSend;
        }

        phoneNumbers.forEach((phoneNumber) => {
          emailLogEntries.push({
            ...entry,
            data: { ...entry.data, phoneNumber, text: textToSend, body: '' },
          });
        });

        if (to.length) {
          // entries for email log table
          to.forEach((email: string) => {
            emailLogEntries.push({
              ...entry,
              data: {
                ...entry.data,
                mailDate,
                links: String(mailData.data),
                textCount: String(mailData.textCount),
                emailCount: String(mailData.emailCount),
                to: email,
              },
            });
          });
        }
      });
    }

    if (emailLogEntries.length) {
      await this.emailLogRepository.save(emailLogEntries);
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

  addImgForReadCheck(
    htmlString: string | undefined,
    practiceId: string,
    emailLogId: string,
  ): string {
    const { backendUrl } = this.transporterService.getEnvVariables();
    const token: string = this.jwtService.sign({
      practiceId: practiceId,
      emailLogId,
    });
    const imgTagString: string = `<img src="${backendUrl}/practices/${practiceId}/emailLog/${emailLogId}?token=${token}" width="1" height="1" style="display:none;" />`;

    if (htmlString) {
      if (htmlString.includes('<body>')) {
        const htmlSplitArray = htmlString.split('<body>');
        htmlSplitArray[0] = '<body>\n' + '  ' + imgTagString + '<br/>';
        return htmlSplitArray.join('');
      } else {
        return imgTagString + htmlString + '<br/>';
      }
    }

    return '';
  }
}
