import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import { Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { CreateInsuranceTypeDto } from './dto/createInsuranceType.dto';

@Injectable()
export class InsuranceTypesService {
  constructor(
    @InjectRepository(InsuranceTypeEntity)
    private insuranceTypeRepository: Repository<InsuranceTypeEntity>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
  ) {}

  async getInsuranceTypeByPractice(
    practiceId: string,
  ): Promise<InsuranceTypeEntity[]> {
    return this.insuranceTypeRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getInsuranceTypeById(
    id: string,
    practiceId: string,
  ): Promise<InsuranceTypeEntity | null> {
    return this.insuranceTypeRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async remove(id: string, practiceId: string): Promise<void> {
    await this.insuranceTypeRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async create(
    { name }: CreateInsuranceTypeDto,
    practiceId: string,
  ): Promise<InsuranceTypeEntity> {
    const newInsuranceType: InsuranceTypeEntity = new InsuranceTypeEntity();

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    return await this.insuranceTypeRepository.save({
      ...newInsuranceType,
      practice: practiceEntity,
      name,
    });
  }
}
