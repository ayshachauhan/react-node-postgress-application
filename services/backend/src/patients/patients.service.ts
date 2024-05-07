import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferrerType, ReferrersEntity } from '@packages/entities';
import { PatientEntity } from '@packages/entities/patient';
import { PracticeEntity } from '@packages/entities/practice';
import { CreatePatientDto } from 'src/patients/dto/createPatient.dto';
import { ReferrersService } from 'src/referrers/referrers.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @Inject(forwardRef(() => ReferrersService))
    private referrerService: ReferrersService,
  ) {}

  async remove(patientId: string): Promise<void> {
    await this.patientRepository.softDelete(patientId);
  }

  async create(
    createPatientDto: CreatePatientDto,
    practiceEntity: PracticeEntity | null,
  ): Promise<PatientEntity> {
    const newPatient: PatientEntity = new PatientEntity();

    if (!practiceEntity) {
      throw new HttpException('practice not found', HttpStatus.NOT_FOUND);
    }

    let referrerEntity = new ReferrersEntity();
    if (createPatientDto.referrerId) {
      try {
        uuidv4(createPatientDto.referrerId);
        referrerEntity = await this.referrerService.getReferrerById(
          practiceEntity.id,
          createPatientDto.referrerId,
        );
      } catch (error) {
        referrerEntity = await this.referrerService.createReferrer(
          practiceEntity.id,
          {
            email: createPatientDto.referrerId,
            referrerType: ReferrerType.PCP,
          },
        );
      }
    }

    return await this.patientRepository.save({
      ...newPatient,
      practice: practiceEntity,
      referrer: referrerEntity,
      ...createPatientDto,
    });
  }

  async updatePatientSurgeries({
    id,
    practiceId,
    surgeryEntity,
  }): Promise<PatientEntity | null> {
    const existingPatient = await this.patientRepository.findOne({
      where: { id, practice: { id: practiceId } },
      relations: ['surgeries'],
    });

    if (existingPatient) {
      existingPatient.surgeries.push(surgeryEntity);
      await this.patientRepository.save(existingPatient);
    }
    return await this.patientRepository.findOne({
      where: { id, practice: { id: practiceId } },
      relations: ['surgeries'],
    });
  }

  async getUsersByPractice(practiceId: string): Promise<PatientEntity[]> {
    return this.patientRepository.find({
      where: { practice: { id: practiceId } },
    });
  }
}
