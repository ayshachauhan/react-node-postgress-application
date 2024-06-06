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
            firstName: createPatientDto.referrerId,
            referrerType: ReferrerType.PCP,
            verified: false,
          },
        );
      }
    }
    const mrnCheck = await this.getPatientsByMrn(
      practiceEntity.id,
      createPatientDto.mrn,
    );

    if (mrnCheck) {
      if (referrerEntity.dateCreated) {
        await this.patientRepository.update(mrnCheck.id, {
          referrer: referrerEntity,
        });

        const updatedPatient = await this.getPatientsByMrn(
          practiceEntity.id,
          createPatientDto.mrn,
        );

        if (updatedPatient) {
          return updatedPatient;
        } else {
          return mrnCheck;
        }
      } else {
        return mrnCheck;
      }
    } else {
      const newPatient = this.patientRepository.create({
        practice: practiceEntity,
        ...createPatientDto,
        referrer: referrerEntity,
      });
      return await this.patientRepository.save(newPatient);
    }
  }

  async update({ id, practiceId, data }): Promise<PatientEntity | null> {
    await this.patientRepository.update(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      mrn: data.mrn,
      details: data.details,
    });

    return await this.patientRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async getPatientsByPractice(practiceId: string): Promise<PatientEntity[]> {
    return this.patientRepository.find({
      where: { practice: { id: practiceId } },
      relations: ['referrer'],
    });
  }

  async getPatientsByMrn(
    practiceId: string,
    mrn: number,
  ): Promise<PatientEntity | null> {
    return this.patientRepository.findOne({
      where: { practice: { id: practiceId }, mrn },
      relations: ['referrer'],
    });
  }
}
