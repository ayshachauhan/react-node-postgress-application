import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateMessageType } from 'src/enums/templateMessageType.enum';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { TemplateEntity } from '../entities/templates.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templateRepository: Repository<TemplateEntity>,
    private practiceService: PracticesService,
    private userService: UsersService,
    private surgeryTypeService: SurgeryTypesService,
  ) {}

  async findAll(practiceId: string, userId: string): Promise<TemplateEntity[]> {
    return await this.templateRepository.find({
      where: { practice: { id: practiceId }, surgeon: { id: userId } },
      relations: ['surgeryType'],
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
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      templateCreateDto.surgeryTypeId,
      practiceId,
    );

    if (!surgeryTypeEntity) {
      throw new HttpException('Surgery type not found', HttpStatus.NOT_FOUND);
    }

    templateCreateDto.messageType =
      TemplateMessageType[templateCreateDto.messageType];

    return await this.templateRepository.save({
      ...newTemplate,
      ...templateCreateDto,
      practice: practiceEntity,
      surgeon: surgeonEntity,
      surgeryType: surgeryTypeEntity, // Ensure surgeryType is included
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
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }
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

  async createVersion({ messageType, surgeryType }): Promise<string> {
    const dbTemplates = await this.templateRepository.find({
      where: { messageType, surgeryType },
      order: { dateCreated: 'DESC' },
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
