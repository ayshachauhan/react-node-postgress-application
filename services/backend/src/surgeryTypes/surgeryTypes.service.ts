import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, SurgeryTypeEntity } from '@packages/entities';
import logger from 'src/logger';
import { Repository } from 'typeorm';
import {
  CreateSurgeryTypeDto,
  UpdateSurgeryTypeDto,
} from './dto/createSurgery.dto';

@Injectable()
export class SurgeryTypesService {
  constructor(
    @InjectRepository(SurgeryTypeEntity)
    private surgeryTypeRepository: Repository<SurgeryTypeEntity>,
  ) {}

  async getSurgeryTypeByPractice(
    practiceId: string,
  ): Promise<SurgeryTypeEntity[]> {
    return this.surgeryTypeRepository.find({
      where: { practice: { id: practiceId } },
      order: { dateCreated: 'DESC' },
    });
  }

  async getSurgeryTypeById(
    id: string,
    practiceId: string,
  ): Promise<SurgeryTypeEntity | null> {
    return this.surgeryTypeRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async remove(id: string, practiceId: string): Promise<void> {
    logger.info(`Deleting surgery type with ID ${id}`);
    await this.surgeryTypeRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
    logger.info(`Surgery type with ID ${id} deleted successfully`);
  }

  async create(
    { name, color }: CreateSurgeryTypeDto,
    practice: PracticeEntity,
  ): Promise<SurgeryTypeEntity> {
    logger.info(`Creating new surgery type with name ${name}`);
    const newPracticeHome: SurgeryTypeEntity = new SurgeryTypeEntity();

    const savedSurgerType = await this.surgeryTypeRepository.save({
      ...newPracticeHome,
      practice,
      name,
      color,
    });
    logger.info(
      `New surgery type created successfully with ID ${savedSurgerType?.id}`,
    );
    return savedSurgerType;
  }

  async update(
    updateDto: UpdateSurgeryTypeDto,
    id: string,
  ): Promise<SurgeryTypeEntity | null> {
    logger.info(`Updating surgery type with ID: ${id}`);
    await this.surgeryTypeRepository.update(id, updateDto);
    logger.info(`Surgery type with ID: ${id} updated successfully`);

    return await this.surgeryTypeRepository.findOne({
      where: { id },
    });
  }
}
