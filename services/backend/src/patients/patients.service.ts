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
import logger from 'src/logger';
import { CreatePatientDto } from 'src/patients/dto/createPatient.dto';
import { Brackets, DataSource, Repository } from 'typeorm';

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
    logger.info(`Deleting patient with ID: ${patientId}`);
    await this.patientRepository.softDelete(patientId);
    logger.info(`Patient with ID: ${patientId} deleted successfully`);
  }

  async create(
    createPatientDto: CreatePatientDto,
    practiceEntity: PracticeEntity | null,
  ): Promise<PatientEntity> {
    logger.info(
      `Starting the creation of patient with name ${createPatientDto?.firstName} ${createPatientDto?.lastName}`,
    );
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
        logger.info(`Updating patient with ID: ${mrnCheck.id}`);
        await this.patientRepository.update(mrnCheck.id, {
          firstName: createPatientDto.firstName,
          lastName: createPatientDto.lastName,
          email: createPatientDto.email,
          phoneNumber: createPatientDto.phoneNumber,
          countryCode: createPatientDto.countryCode,
        });
        logger.info(`Updated patient with ID: ${mrnCheck.id}`);
      }
      return mrnCheck;
    } else {
      logger.info(
        `Creating new patient with name ${createPatientDto?.firstName} ${createPatientDto?.lastName}`,
      );
      const newPatient = this.patientRepository.create({
        practice: practiceEntity,
        ...createPatientDto,
      });
      const newPatientSaved = await this.patientRepository.save(newPatient);
      logger.info(
        `Created new patient successfully with ID: ${newPatientSaved.id}`,
      );
      return newPatientSaved;
    }
  }

  async update({ id, practiceId, data }): Promise<PatientEntity | null> {
    logger.info(`Starting update for patient with ID: ${id}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const patientEntity = await this.patientRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });

      if (patientEntity) {
        logger.info(`Updating patient with ID: ${id}`);
        await this.patientRepository.update(id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
          mrn: data.mrn,
        });

        logger.info(`Patient with ID: ${id} updated successfully`);

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

  async getPatientsByPhoneNumber(
    phoneNumber: string,
  ): Promise<PatientEntity[] | null> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.practice', 'practice')
      .where(
        new Brackets((qb) => {
          qb.where(
            'CONCAT(patient.countryCode, patient.phoneNumber) = :phoneNumber',
            { phoneNumber },
          );
        }),
      )
      .getMany();
  }

  async getPatientsByPhoneNumberinPractice(
    phoneNumber: string,
    practiceId: string,
  ): Promise<PatientEntity[] | null> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.practice', 'practice')
      .where(
        new Brackets((qb) => {
          qb.where(
            'CONCAT(patient.countryCode, patient.phoneNumber) = :phoneNumber',
            { phoneNumber },
          ).andWhere('practice.id = :practiceId', { practiceId });
        }),
      )
      .getMany();
  }
}
