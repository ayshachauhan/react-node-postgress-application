import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurgeryTypeEntity } from '@packages/entities/surgeryType';
import { Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { CreateSurgeryTypeDto } from './dto/createSurgery.dto';

@Injectable()
export class SurgeryTypesService {
  constructor(
    @InjectRepository(SurgeryTypeEntity)
    private surgeryTypeRepository: Repository<SurgeryTypeEntity>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
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
    practiceId: string,
  ): Promise<SurgeryTypeEntity> {
    const newPracticeHome: SurgeryTypeEntity = new SurgeryTypeEntity();

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    return await this.surgeryTypeRepository.save({
      ...newPracticeHome,
      practice: practiceEntity,
      name,
    });
  }
}
