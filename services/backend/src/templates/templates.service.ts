import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TemplateEntity,
  TemplateMessageType,
} from '@packages/entities/template';
import { Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { SurgeryConfigurationsService } from '../surgeryConfiguration/surgeryConfiguration.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templateRepository: Repository<TemplateEntity>,
    private practiceService: PracticesService,
    private userService: UsersService,
    private surgeryConfigurationsService: SurgeryConfigurationsService,
  ) {}

  async findAll(practiceId: string, userId: string): Promise<TemplateEntity[]> {
    await this.practiceService.findOne(practiceId);
    return await this.templateRepository.find({
      where: { practice: { id: practiceId }, surgeon: { id: userId } },
      relations: ['surgeryConfiguration'],
    });
  }

  async getTemplateById(id: string): Promise<TemplateEntity | null> {
    return await this.templateRepository.findOneBy({ id });
  }

  async create({
    surgeonId,
    practiceId,
    templateCreateDto,
  }): Promise<TemplateEntity> {
    const newTemplate: TemplateEntity = new TemplateEntity();

    const surgeonEntity = await this.userService.getUserById(surgeonId);
    if (!surgeonEntity) {
      throw new HttpException('Surgeon not found', HttpStatus.NOT_FOUND);
    }

    const practiceEntity = await this.practiceService.findOne(practiceId);

    const surgeryConfigurationEntity =
      await this.surgeryConfigurationsService.getSurgeryConfigurationById(
        templateCreateDto.surgeryConfigurationId,
      );

    if (!surgeryConfigurationEntity) {
      throw new HttpException(
        'Surgery configuration not found',
        HttpStatus.NOT_FOUND,
      );
    }

    templateCreateDto.messageType =
      TemplateMessageType[templateCreateDto.messageType];

    return await this.templateRepository.save({
      ...newTemplate,
      ...templateCreateDto,
      practice: practiceEntity,
      surgeon: surgeonEntity,
      surgeryConfiguration: surgeryConfigurationEntity,
      version: await this.createVersion(templateCreateDto),
    });
  }

  async update({
    surgeonId,
    practiceId,
    templatePatchDto,
    id,
  }): Promise<TemplateEntity | null> {
    const templateToUpdate = await this.getTemplateById(id);

    const surgeonEntity = await this.userService.getUserById(surgeonId);
    if (!surgeonEntity) {
      throw new HttpException('Surgeon not found', HttpStatus.NOT_FOUND);
    }

    const practiceEntity = await this.practiceService.findOne(practiceId);

    if (templatePatchDto.messageType) {
      templatePatchDto.messageType =
        TemplateMessageType[templatePatchDto.messageType];
    }

    await this.templateRepository.update(id, {
      ...templateToUpdate,
      ...templatePatchDto,
      practice: practiceEntity,
      surgeon: surgeonEntity,
    });

    return await this.templateRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.templateRepository.softDelete(id);
  }

  async createVersion({
    messageType,
    surgeryConfigurationId,
  }): Promise<string> {
    const dbTemplates = await this.templateRepository.find({
      where: {
        messageType,
        surgeryConfiguration: { id: surgeryConfigurationId },
      },
      order: { dateCreated: 'DESC' },
      relations: ['surgeryConfiguration'],
    });

    // if combination exists then increment the version and return V1 if new entry
    if (dbTemplates.length) {
      const { version: lastTemplateVersion }: TemplateEntity = dbTemplates[0];
      return `V${parseInt(lastTemplateVersion.replace('V', ''), 10) + 1}`;
    } else {
      return 'V1';
    }
  }
}
