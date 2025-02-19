import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import logger from 'src/logger';
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
    if (id) {
      return this.insuranceTypeRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    }
    return null;
  }

  async remove(id: string, practiceId: string): Promise<void> {
    logger.info(`Deleting insurance type with ID: ${id}`);
    await this.insuranceTypeRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
    logger.info(`Insurance type with ID: ${id} deleted successfully`);
  }

  async create(
    { name }: CreateInsuranceTypeDto,
    practiceId: string,
  ): Promise<InsuranceTypeEntity> {
    logger.info(`Starting creation of new insurance type with name ${name}`);
    const newInsuranceType: InsuranceTypeEntity = new InsuranceTypeEntity();

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }
    logger.info(`Creating new insurance type with name ${name}`);
    const savedInsuranceType = await this.insuranceTypeRepository.save({
      ...newInsuranceType,
      practice: practiceEntity,
      name,
    });
    logger.info(
      `New insurance type created successfully with ID: ${savedInsuranceType?.id}`,
    );
    return savedInsuranceType;
  }
}
