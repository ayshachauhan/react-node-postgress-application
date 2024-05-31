import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { EmailResponse } from '@packages/entities';
import { compile } from 'handlebars';
import type { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { EMAIL_CONNECTION_TOKEN, SystemTemplates } from './transporter.types';

@Injectable()
export class TransporterService {
  constructor(
    @Inject(EMAIL_CONNECTION_TOKEN)
    private readonly emailTransporter: Transporter<SMTPTransport.SentMessageInfo>,
    private readonly configService: ConfigService,
  ) {}

  getSmtpEmail(): string | undefined {
    return this.configService.get(ENVIRONMENT_VARIABLES.SMTP_EMAIL);
  }

  async sendEmail(
    options: Mail.Options,
    data: Record<string, unknown>,
  ): Promise<EmailResponse> {
    const smtpEmail: string | undefined = this.getSmtpEmail();

    const result = await this.emailTransporter.sendMail({
      ...options,
      from: smtpEmail,
      text: options.text
        ? this.compileTemplate(options.text.toString(), data)
        : undefined,
      html: options.html
        ? this.compileTemplate(options.html.toString(), data)
        : undefined,
      subject: options.subject
        ? this.compileTemplate(options.subject, data)
        : undefined,
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
  sendText() {}

  compileTemplate(text: string, data: Record<string, unknown>): string {
    const template = compile(text);

    return template(data);
  }
}
