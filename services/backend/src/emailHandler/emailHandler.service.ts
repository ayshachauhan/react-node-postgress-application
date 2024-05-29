import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity, EmailVariables, IEmailLog } from '@packages/entities';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { TemplatesService } from 'src/templates/templates.service';
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { Repository } from 'typeorm';

export type SystemGeneratedMailData = {
  subject: string;
  text: string;
  systemTemplate: SystemTemplates;
};

@Injectable()
export class EmailHandlerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private emailLogRepository: Repository<EmailLogEntity>,
    @Inject(forwardRef(() => TemplatesService))
    private templateService: TemplatesService,
    @Inject(forwardRef(() => TransporterService))
    private transporterService: TransporterService,
    private readonly configService: ConfigService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async checkAndMakeEmailContent(
    surgeryConfigurationId: string,
    surgeryId: string,
    date: Date,
    mailVariable: EmailVariables,
    systemGeneratedMailData?: SystemGeneratedMailData,
    fromEval?: boolean,
  ): Promise<void> {
    let bookingTemplateFound: boolean = false;
    const surgeryTemplates = await this.templateService.getFilteredTemplates({
      surgeryConfigurationId,
    });

    const emailLogsEntries: Partial<IEmailLog>[] = [];

    if (surgeryTemplates.length) {
      surgeryTemplates.forEach((template) => {
        const today = new Date();
        const entry = {
          surgeryId,
          expectedDate: date,
          status: 'pending',
          template,
          isEval: fromEval,
          data: {
            subject: template.emailSubject
              ? this.mailVariableManipulator(template.emailSubject)
              : '',
            body: template.emailBody
              ? this.mailVariableManipulator(template.emailBody)
              : '',
            attachment: template.emailAttachment
              ? template.emailAttachment
              : '',
            text: template.messageText
              ? this.mailVariableManipulator(template.messageText)
              : '',
            ...mailVariable,
            '1stCataract': template.email1stCataract
              ? this.mailVariableManipulator(template.email1stCataract)
              : '',
            '2ndCataract': template.email2ndCataract
              ? this.mailVariableManipulator(template.email2ndCataract)
              : '',
          },
        };

        const surgeryDate = new Date(date);
        if (template.messageType === 'preop') {
          surgeryDate.setDate(surgeryDate.getDate() - template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status = surgeryDate < today ? 'completed' : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'postop') {
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          entry.status = surgeryDate < today ? 'completed' : 'pending';
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'booking') {
          bookingTemplateFound = true;
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          entry.expectedDate = surgeryDate;
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'referrer') {
          //
        } else if (template.messageType === 'pcp') {
          //
        }
      });
    }

    if (!bookingTemplateFound && systemGeneratedMailData) {
      const systemTemplateName = systemGeneratedMailData.systemTemplate;
      const entry = {
        surgeryId,
        expectedDate: date,
        status: 'pending',
        isEval: fromEval,
        data: {
          body: this.transporterService.readTemplates(systemTemplateName),
          ...mailVariable,
          subject: systemGeneratedMailData.subject,
          text: systemGeneratedMailData.text,
        },
      };
      emailLogsEntries.push(entry);
    }
    await this.emailLogRepository.save(emailLogsEntries);
  }
  mailVariableManipulator(str: string): string {
    return str.replaceAll('[', '{{').replaceAll(']', '}}');
  }
}
