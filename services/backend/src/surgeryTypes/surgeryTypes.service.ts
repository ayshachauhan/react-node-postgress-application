import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/*';
import {
  SurgeryChecklist,
  SurgeryOptions,
  SurgeryTypeEntity,
} from '@packages/entities/surgeryType';
import { Repository } from 'typeorm';
import { CreateSurgeryTypeDto } from './dto/createSurgery.dto';

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
    { name }: CreateSurgeryTypeDto,
    practice: PracticeEntity,
  ): Promise<SurgeryTypeEntity> {
    const newPracticeHome: SurgeryTypeEntity = new SurgeryTypeEntity();

    return await this.surgeryTypeRepository.save({
      ...newPracticeHome,
      practice,
      name,
    });
  }

  async addBodyPart(
    id: string,
    bodyPart: string,
  ): Promise<SurgeryTypeEntity | null> {
    const surgeryType: SurgeryTypeEntity | null =
      await this.surgeryTypeRepository.findOne({ where: { id: id } });

    if (!surgeryType) {
      throw new HttpException('Surgery type not found', HttpStatus.NOT_FOUND);
    }

    await this.surgeryTypeRepository.update(surgeryType.id, {
      bodyPart: [...surgeryType.bodyPart, bodyPart],
    });

    return this.surgeryTypeRepository.findOne({ where: { id: id } });
  }

  async addFacility(
    id: string,
    facility: string,
  ): Promise<SurgeryTypeEntity | null> {
    const surgeryType: SurgeryTypeEntity | null =
      await this.surgeryTypeRepository.findOne({ where: { id: id } });

    if (!surgeryType) {
      throw new HttpException('Surgery type not found', HttpStatus.NOT_FOUND);
    }

    await this.surgeryTypeRepository.update(surgeryType.id, {
      facility: [...surgeryType.facility, facility],
    });

    return this.surgeryTypeRepository.findOne({ where: { id: id } });
  }

  async addChecklist(
    id: string,
    checklist: SurgeryChecklist,
  ): Promise<SurgeryTypeEntity | null> {
    const surgeryType: SurgeryTypeEntity | null =
      await this.surgeryTypeRepository.findOne({ where: { id: id } });

    if (!surgeryType) {
      throw new HttpException('Surgery type not found', HttpStatus.NOT_FOUND);
    }

    await this.surgeryTypeRepository.update(surgeryType.id, {
      checkList: {
        ...surgeryType.checkList,
        ...checklist,
      },
    });

    return this.surgeryTypeRepository.findOne({ where: { id: id } });
  }

  async addSurgeryOption(
    id: string,
    option: SurgeryOptions,
  ): Promise<SurgeryTypeEntity | null> {
    const surgeryType: SurgeryTypeEntity | null =
      await this.surgeryTypeRepository.findOne({ where: { id: id } });

    if (!surgeryType) {
      throw new HttpException('Surgery type not found', HttpStatus.NOT_FOUND);
    }

    await this.surgeryTypeRepository.update(surgeryType.id, {
      checkList: {
        ...surgeryType.options,
        ...option,
      },
    });

    return this.surgeryTypeRepository.findOne({ where: { id: id } });
  }
}
