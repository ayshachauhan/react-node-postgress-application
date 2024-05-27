import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity, IEmailLog } from '@packages/entities';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { TemplatesService } from 'src/templates/templates.service';
import { Repository } from 'typeorm';

@Injectable()
export class EmailHandlerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private emailLogRepository: Repository<EmailLogEntity>,
    @Inject(forwardRef(() => TemplatesService))
    private templateService: TemplatesService,
    private readonly configService: ConfigService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async checkAndMakeEmailContent(
    surgeryConfigurationId: string,
    surgeryId: string,
    date: Date,
    templateId?: string,
    fromEval?: boolean,
  ): Promise<void> {
    const surgeryTemplates = await this.templateService.getFilteredTemplates({
      surgeryConfigurationId,
    });
    await this.emailLogRepository.find();
    const emailLogsEntries: Partial<IEmailLog>[] = [];
    console.log(templateId, fromEval, surgeryId);

    if (surgeryTemplates.length) {
      surgeryTemplates.forEach((template) => {
        const today = new Date();
        const entry = {
          surgeryId,
          expectedDate: date,
          status: 'pending',
          template,
          isEval: true,
        };

        const surgeryDate = new Date(date);
        if (template.messageType === 'preop') {
          surgeryDate.setDate(surgeryDate.getDate() - template.dateOffset);
          (entry.expectedDate = surgeryDate),
            (entry.status = surgeryDate > today ? 'completed' : 'pending');
          emailLogsEntries.push(entry);
        } else if (template.messageType === 'postop') {
          surgeryDate.setDate(surgeryDate.getDate() + template.dateOffset);
          (entry.expectedDate = surgeryDate),
            (entry.status = surgeryDate > today ? 'completed' : 'pending');
          emailLogsEntries.push(entry);
        }
      });

      await this.emailLogRepository.save(emailLogsEntries);
    }
  }
}
