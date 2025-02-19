import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SurgeryConfigurationEntity,
  SurgeryTypeEntity,
} from '@packages/entities';
import logger from 'src/logger';
import { ILike, Repository } from 'typeorm';
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
      relations: ['surgeryType'],
    });
  }

  async remove(id: string, surgeryTypeId: string): Promise<void> {
    logger.info(`Deleting surgery configuration record with ID: ${id}`);
    await this.surgeryConfigurationRepository.softDelete({
      id,
      surgeryType: { id: surgeryTypeId },
    });
    logger.info(
      `Surgery configuration record with ID: ${id} deleted successfully`,
    );
  }

  async create(
    dto: AddSurgeryConfigurationDto,
    surgeryType: SurgeryTypeEntity,
  ): Promise<SurgeryConfigurationEntity> {
    logger.info(
      `Creating new surgery configuration record with name ${dto?.name} under surgery type ${surgeryType?.name}`,
    );
    const sameSurgeryTypeCheck =
      await this.surgeryConfigurationRepository.findOne({
        where: {
          surgeryType: { id: surgeryType.id },
          name: ILike(dto.name),
        },
      });
    if (sameSurgeryTypeCheck) {
      throw new HttpException(
        'Surgery Name already exists for this type',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const savedSurgeryConfiguration =
      await this.surgeryConfigurationRepository.save({
        surgeryType,
        ...dto,
      });
    logger.info(
      `New surgery configuration record added with ID ${savedSurgeryConfiguration?.id}`,
    );
    return savedSurgeryConfiguration;
  }

  async update(
    id: string,
    dto: UpdateSurgeryConfigurationDto,
    surgeryTypeEntity: SurgeryTypeEntity,
  ): Promise<SurgeryConfigurationEntity | null> {
    logger.info(`Updating surgery configuration with ID ${id}`);
    await this.surgeryConfigurationRepository.update(id, {
      ...dto,
      surgeryType: surgeryTypeEntity,
    });
    logger.info(`Surgery configuration with ID ${id} updated successfully`);

    return await this.surgeryConfigurationRepository.findOne({
      where: { id },
      relations: ['surgeryType'],
    });
  }
}
