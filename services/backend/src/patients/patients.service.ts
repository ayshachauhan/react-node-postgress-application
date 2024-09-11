import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PracticeEntity } from '@packages/entities/practice';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { CreatePatientDto } from 'src/patients/dto/createPatient.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @Inject(forwardRef(() => EmailHandlerService))
    private emailHandlerService: EmailHandlerService,
    private dataSource: DataSource,
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

    const mrnCheck = await this.getPatientsByMrn(
      practiceEntity.id,
      createPatientDto.mrn,
    );

    if (mrnCheck) {
      const hasChanges =
        mrnCheck.firstName !== createPatientDto.firstName ||
        mrnCheck.lastName !== createPatientDto.lastName ||
        mrnCheck.email !== createPatientDto.email ||
        mrnCheck.phoneNumber !== createPatientDto.phoneNumber ||
        mrnCheck.countryCode !== createPatientDto.countryCode;

      if (hasChanges) {
        await this.patientRepository.update(mrnCheck.id, {
          firstName: createPatientDto.firstName,
          lastName: createPatientDto.lastName,
          email: createPatientDto.email,
          phoneNumber: createPatientDto.phoneNumber,
          countryCode: createPatientDto.countryCode,
        });
      }
      return mrnCheck;
    } else {
      const newPatient = this.patientRepository.create({
        practice: practiceEntity,
        ...createPatientDto,
      });
      return await this.patientRepository.save(newPatient);
    }
  }

  async update({ id, practiceId, data }): Promise<PatientEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const patientEntity = await this.patientRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });

      if (patientEntity) {
        await this.patientRepository.update(id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
          mrn: data.mrn,
        });

        await this.emailHandlerService.updateEmailLogsByPatientMrn(
          patientEntity?.mrn,
          data,
        );
      }
      await queryRunner.commitTransaction();
      return await this.patientRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPatientsByPractice(practiceId: string): Promise<PatientEntity[]> {
    return this.patientRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getPatientsByMrn(
    practiceId: string,
    mrn: number,
  ): Promise<PatientEntity | null> {
    return this.patientRepository.findOne({
      where: { practice: { id: practiceId }, mrn },
      relations: ['surgeries', 'evals', 'surgeries.surgeryConfiguration'],
    });
  }
}
