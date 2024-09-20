import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, SurgeryTypeEntity } from '@packages/entities';
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
    await this.surgeryTypeRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async create(
    { name, color }: CreateSurgeryTypeDto,
    practice: PracticeEntity,
  ): Promise<SurgeryTypeEntity> {
    const newPracticeHome: SurgeryTypeEntity = new SurgeryTypeEntity();

    return await this.surgeryTypeRepository.save({
      ...newPracticeHome,
      practice,
      name,
      color,
    });
  }

  async update(
    updateDto: UpdateSurgeryTypeDto,
    id: string,
  ): Promise<SurgeryTypeEntity | null> {
    await this.surgeryTypeRepository.update(id, updateDto);

    return await this.surgeryTypeRepository.findOne({
      where: { id },
    });
  }
}
