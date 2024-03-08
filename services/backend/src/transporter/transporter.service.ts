import { Inject, Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { compile } from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EMAIL_CONNECTION_TOKEN } from './transporter.types';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class TransporterService {
  constructor(
    @Inject(EMAIL_CONNECTION_TOKEN)
    private readonly emailTransporter: Transporter<SMTPTransport.SentMessageInfo>,
  ) {}

  async sendEmail(
    options: Mail.Options,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.emailTransporter.sendMail({
      ...options,
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
  }

  // TODO implement twillio to send sms
  sendText() {}

  compileTemplate(text: string, data: Record<string, unknown>): string {
    const template = compile(text);

    return template(data);
  }
}
