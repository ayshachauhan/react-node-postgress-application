import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SurgeryConfigurationEntity,
  SurgeryTypeEntity,
} from '@packages/entities';
import { Repository } from 'typeorm';
import {
  AddSurgeryConfigurationDto,
  UpdateSurgeryConfigurationDto,
} from './dto/createSurgery.dto';

@Injectable()
export class SurgeryConfigurationsService {
  constructor(
    @InjectRepository(SurgeryConfigurationEntity)
    private surgeryConfigurationRepository: Repository<SurgeryConfigurationEntity>,
  ) {}

  async getSurgeryConfigurationByPractice(
    practiceId: string,
  ): Promise<SurgeryConfigurationEntity[]> {
    return this.surgeryConfigurationRepository.find({
      where: { surgeryType: { practice: { id: practiceId } } },
      relations: ['surgeryType'],
    });
  }

  async getSurgeryConfigurationById(
    id: string,
  ): Promise<SurgeryConfigurationEntity | null> {
    return this.surgeryConfigurationRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string, surgeryTypeId: string): Promise<void> {
    await this.surgeryConfigurationRepository.softDelete({
      id,
      surgeryType: { id: surgeryTypeId },
    });
  }

  async create(
    dto: AddSurgeryConfigurationDto,
    surgeryType: SurgeryTypeEntity,
  ): Promise<SurgeryConfigurationEntity> {
    const sameSurgeryTypeCheck =
      await this.surgeryConfigurationRepository.findOne({
        where: {
          surgeryType: { id: surgeryType.id },
          name: dto.name,
        },
      });
    if (sameSurgeryTypeCheck) {
      throw new HttpException(
        'Surgery Name already exists for this type',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.surgeryConfigurationRepository.save({
      surgeryType,
      ...dto,
    });
  }

  async update(
    id: string,
    dto: UpdateSurgeryConfigurationDto,
    surgeryTypeEntity: SurgeryTypeEntity,
  ): Promise<SurgeryConfigurationEntity | null> {
    await this.surgeryConfigurationRepository.update(id, {
      ...dto,
      surgeryType: surgeryTypeEntity,
    });

    return await this.surgeryConfigurationRepository.findOne({
      where: { id },
      relations: ['surgeryType'],
    });
  }
}
