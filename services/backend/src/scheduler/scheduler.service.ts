import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailLogEntity,
  EmailResponse,
  IEmailLog,
  SMSResponse,
} from '@packages/entities';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import logger from 'src/logger';
import { SurgeryService } from 'src/surgery/surgery.service';
import { CustomError, TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { formatHeaderDate } from 'src/utils';
import { EntityManager, Repository } from 'typeorm';

type EmailLogResponse = {
  id: string;
  response: EmailResponse | CustomError;
};

type SMSLogResponse = {
  id: string;
  response: SMSResponse | CustomError;
};

@Injectable()
export class SchedulerService {
  private isEmailLogCronRunning: boolean = false;
  constructor(
    @InjectRepository(EmailLogEntity)
    private readonly emailLogRepository: Repository<EmailLogEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private transporterService: TransporterService,
    private readonly surgeryService: SurgeryService,
  ) {}

  getMailLimit() {
    return this.configService.get(ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT);
  }

  @Interval(20000)
  async handleCron() {
    if (this.isEmailLogCronRunning) {
      logger.info('Exiting early to avoid cron duplication');
      return;
    }
    this.isEmailLogCronRunning = true;
    try {
      logger.info(`Starting scheduler to processing pending emails`);
      await this.emailLogRepository.manager.transaction(
        async (manager: EntityManager) => {
          const currentTime = new Date();
          const emailsToSend: EmailLogEntity[] = await manager.query(
            `SELECT * FROM email_logs WHERE "expectedDate" <= $1  AND (status = 'pending' OR "smsStatus" = 'queued') FOR UPDATE LIMIT $2`,
            [currentTime, this.getMailLimit()],
          );

          if (!emailsToSend.length) {
            logger.info(`No emails found to be sent.`);
            return;
          }

          logger.info(`Found ${emailsToSend.length} emails/SMS to send`);

          const promises = emailsToSend.map(
            async (mailData: EmailLogEntity) => {
              try {
                const { subject, text, body, to, cc } = mailData.data;
                const mailOptions: Mail.Options = {
                  subject,
                  to,
                  text,
                  html:
                    this.addImgForReadCheck(
                      body,
                      mailData?.practiceId,
                      mailData.id,
                    ) ?? '',
                  attachments: mailData.attachment
                    ? [{ path: mailData.attachment }]
                    : [],
                  cc: cc ?? '',
                };
                mailOptions && mailOptions;

                const emailResponse =
                  mailData.status === 'pending'
                    ? await this.transporterService.sendEmail(
                        mailOptions,
                        Object.assign(mailData.data, {
                          emailAttempts: mailData.emailAttempts,
                        }),
                      )
                    : {};
                return {
                  id: mailData.id,
                  response: Object.assign(
                    mailData.response ?? {},
                    emailResponse,
                  ),
                };
              } catch (ex) {
                logger.error(`Error in scheduler to send emails: ${ex}`);
                if (mailData?.emailAttempts < 1) {
                  this.emailLogRepository.update(
                    { id: mailData.id },
                    {
                      emailAttempts: () => 'emailAttempts + 1',
                      status: 'pending',
                    },
                  );
                } else {
                  this.emailLogRepository.update(
                    { id: mailData.id },
                    {
                      status: 'rejected',
                    },
                  );
                }
                throw ex;
              }
            },
          );

          const smtpEmailResponses: PromiseSettledResult<EmailLogResponse>[] =
            await Promise.allSettled(promises);

          const filteredSuccessfullPromises = smtpEmailResponses
            .filter((item) => item.status === 'fulfilled')
            .map(
              (item) =>
                (item as PromiseFulfilledResult<EmailLogResponse>).value,
            );

          await Promise.all(
            filteredSuccessfullPromises.map((log) => {
              const { id, response } = log;
              console.log(
                'email log: ',
                'status' in response && response.status == 'rejected',
              );
              const status =
                'status' in response && response.status == 'rejected'
                  ? 'rejected'
                  : 'completed';
              return manager.query(
                `UPDATE email_logs SET status=$1, response=$2 WHERE id=$3`,
                [status, response, id],
              );
            }),
          );
          logger.info('Processed emails');

          const smsPromises = emailsToSend.map(
            async (smsLog: EmailLogEntity) => {
              try {
                const { countryCode, phoneNumber, text } = smsLog.data;
                const sms =
                  smsLog.smsStatus === 'queued'
                    ? await this.transporterService.sendText(
                        `${countryCode ? countryCode : ''}${phoneNumber}`,
                        text,
                        smsLog.id,
                      )
                    : {};
                logger.info(
                  `SMS sending response status: ${JSON.stringify(sms)}`,
                );

                return {
                  id: smsLog.id,
                  response: Object.assign(smsLog.smsResponse ?? {}, sms),
                };
              } catch (ex) {
                console.log(ex);
                logger.error(`Error in scheduler to send SMS: ${ex}`);
                if (smsLog?.smsAttempts < 1) {
                  this.emailLogRepository.update(
                    { id: smsLog.id },
                    {
                      smsAttempts: () => 'smsAttempts + 1',
                      smsStatus: 'queued',
                    },
                  );
                } else {
                  this.emailLogRepository.update(
                    { id: smsLog.id },
                    {
                      smsStatus: 'failed',
                    },
                  );
                }
                throw ex;
              }
            },
          );

          const smsResponses: PromiseSettledResult<SMSLogResponse>[] =
            await Promise.allSettled(smsPromises);

          const smsSuccessfulPromises = smsResponses
            .filter((item) => item.status === 'fulfilled')
            .map(
              (item) => (item as PromiseFulfilledResult<SMSLogResponse>).value,
            );

          await Promise.all(
            smsSuccessfulPromises.map((log) => {
              const { id, response } = log;
              const status =
                'status' in response && response.status == 'rejected'
                  ? 'failed'
                  : 'enqueued';
              return manager.query(
                `UPDATE email_logs SET "smsStatus"=$1, "smsResponse"=$2 WHERE id=$3`,
                [status, response, id],
              );
            }),
          );
          logger.info('Processed SMS');
        },
      );
    } catch (error) {
      logger.error(`Error processing scheduler: ${error}`);
    } finally {
      this.isEmailLogCronRunning = false;
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
    logger.info(`Starting summary email scheduler`);
    const dateMinus15Minutes = new Date(
      new Date().setMinutes(new Date().getMinutes() - 10),
    );
    const today = this.getFormattedDate(dateMinus15Minutes);

    logger.info(`Current Date and Time: ${today}`);
    const dailySummaryByPractice = {};

    const data = await this.emailLogRepository.find({
      where: { status: 'completed' },
      relations: ['practice', 'practice.users'],
    });

    const filteredData = data.filter((emailLog) => {
      const emailLogDate = this.getFormattedDate(emailLog.expectedDate);
      return emailLogDate.getTime() === today.getTime();
    });

    logger.info(
      `Processing ${filteredData.length} records in summary email scheduler`,
    );
    const emailLogEntries: Partial<IEmailLog>[] = [];

    try {
      // filtering data on the basis of separate practices
      filteredData.forEach((ele) => {
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
              messageType: 'Daily Summary',
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
              const filteredLinks = String(mailData.data)
                .split(',')
                .filter((link) => link.trim() !== ''); // Filters out empty or whitespace links
              emailLogEntries.push({
                ...entry,
                data: {
                  ...entry.data,
                  body: this.transporterService.compileTemplate(
                    entry.data?.body || '',
                    {
                      mailDate,
                      links: filteredLinks,
                      textCount: String(mailData.textCount),
                      emailCount: String(mailData.emailCount),
                    },
                  ),
                  mailDate,
                  links: filteredLinks.join(','),
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
        logger.info(
          `${emailLogEntries.length} summary email(s) to be processed`,
        );
        await this.emailLogRepository.save(emailLogEntries);
      }
    } catch (ex) {
      logger.error(ex);
    }
    logger.info(`Summary email scheduler ended`);
  }

  private getFormattedDate(_inputDate: Date) {
    let today = new Date();
    if (_inputDate) {
      today = new Date(_inputDate);
    }
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
