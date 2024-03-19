import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateMessageType } from 'src/enums/templateMessageType.enum';
import { PracticesService } from 'src/practices/practices.service';
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
  ) {}

  async findAll(): Promise<TemplateEntity[]> {
    return await this.templateRepository.find();
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
    return await this.templateRepository.save({
      ...newTemplate,
      ...templateCreateDto,
      practice: practiceEntity,
      surgeon: surgeonEntity,
      messageType: TemplateMessageType[templateCreateDto.messageType],
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
}
