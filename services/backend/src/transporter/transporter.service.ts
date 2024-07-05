import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { EmailResponse } from '@packages/entities';
import { compile } from 'handlebars';
import type { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import logger from 'src/logger';
import { formatHeaderDate } from 'src/utils';
import { Twilio } from 'twilio';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { EMAIL_CONNECTION_TOKEN, SystemTemplates } from './transporter.types';

export type CustomError = {
  status: string;
  message: string;
};

@Injectable()
export class TransporterService {
  private twilioClient: Twilio;
  constructor(
    @Inject(EMAIL_CONNECTION_TOKEN)
    private readonly emailTransporter: Transporter<SMTPTransport.SentMessageInfo>,
    private readonly configService: ConfigService,
  ) {
    const { twilioSID, twilioToken } = this.getEnvVariables();
    if (typeof twilioSID == 'string' && typeof twilioToken == 'string') {
      this.twilioClient = new Twilio(twilioSID, twilioToken);
    }
  }

  getEnvVariables(): Record<string, string | boolean> {
    return {
      sendTextMessages:
        this.configService.get(ENVIRONMENT_VARIABLES.ENABLE_TWILIO_MSGS) ??
        false,
      smtpEmail: this.configService.get(ENVIRONMENT_VARIABLES.SMTP_EMAIL) ?? '',
      twilioSID:
        this.configService.get(ENVIRONMENT_VARIABLES.TWILIO_ACCOUNT_SID) ?? '',
      twilioToken:
        this.configService.get(ENVIRONMENT_VARIABLES.TWILIO_AUTH_TOKEN) ?? '',
      twilioPhoneNumber:
        this.configService.get(ENVIRONMENT_VARIABLES.TWILIO_PHONE_NUMBER) ?? '',
    };
  }

  async sendEmail(
    options: Mail.Options,
    data: Record<string, unknown>,
  ): Promise<EmailResponse | CustomError> {
    const { smtpEmail } = this.getEnvVariables();

    const text: string = options.text
      ? this.compileTemplate(options.text.toString(), data)
      : '';
    await this.sendText(data.phoneNumber, text);

    if (data.links && typeof data.links == 'string') {
      data.links = data.links.split(',');
    }

    // compile check
    const error = this.compileCheck(options, data);
    if (error) return error;
    const result = await this.emailTransporter.sendMail({
      ...options,
      from: typeof smtpEmail == 'string' ? smtpEmail : '',
      html: options.html ?? undefined,
      subject: options.subject ?? undefined,
    });

    return {
      message: result.response,
    };
  }

  async sendSystemEmails(
    options: Mail.Options,
    data: Record<string, unknown>,
    template: SystemTemplates,
  ) {
    const templateString = this.readTemplates(template);

    return this.sendEmail(
      {
        ...options,
        html: templateString,
      },
      data,
    );
  }

  readTemplates(template: SystemTemplates): string {
    // Read the HTML file content
    const htmlFilePath = path.join(
      __dirname,
      `/emailTemplates/${template}.html`,
    );
    return fs.readFileSync(htmlFilePath, 'utf8');
  }

  // TODO implement twillio to send sms
  async sendText(to, message: string) {
    const { twilioPhoneNumber, sendTextMessages } = this.getEnvVariables();

    if (sendTextMessages && message) {
      const cleanMessage = message.replace(/<\/?p[^>]*>/g, '\n');
      try {
        await this.twilioClient.messages.create({
          body: cleanMessage,
          to,
          from: typeof twilioPhoneNumber == 'string' ? twilioPhoneNumber : '',
        });
        console.log('SMS sent successfully!');
      } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
      }
    }
  }

  compileTemplate(text: string, data: Record<string, unknown>): string {
    try {
      const template = compile(text);
      if (data.surgery_date) {
        data.surgery_date = formatHeaderDate(String(data.surgery_date));
      }
      return template(data);
    } catch (error) {
      logger.info('@compileTemplate', { error, text, data });
      return 'This is a failed html template';
    }
  }

  compileCheck(
    options: Mail.Options,
    data: Record<string, unknown>,
  ): void | CustomError {
    const errorString: string = 'This is a failed html template';
    let errorExists: boolean = false;

    if (options.html) {
      options.html = this.compileTemplate(options.html.toString(), data);
      if (options.html === errorString) errorExists = true;
    }

    if (options.subject) {
      options.subject = this.compileTemplate(options.subject.toString(), data);
      if (options.subject === errorString) errorExists = true;
    }

    if (errorExists) {
      return { message: errorString, status: 'rejected' };
    }
  }
}
