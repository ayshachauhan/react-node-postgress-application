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
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { CreatePatientDto } from 'src/patients/dto/createPatient.dto';
import { ReferrersService } from 'src/referrers/referrers.service';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @Inject(forwardRef(() => ReferrersService))
    private referrerService: ReferrersService,
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

    let referrerEntity = new ReferrersEntity();
    let pcpReferrerEntity = new ReferrersEntity();
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

    if (createPatientDto.pcp) {
      try {
        uuidv4(createPatientDto.pcp); // Validate the pcp
        pcpReferrerEntity = await this.referrerService.getReferrerById(
          practiceEntity.id,
          createPatientDto.pcp,
        );
      } catch (error) {
        pcpReferrerEntity = await this.referrerService.createReferrer(
          practiceEntity.id,
          {
            firstName: createPatientDto.pcp,
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
      const hasChanges =
        mrnCheck.firstName !== createPatientDto.firstName ||
        mrnCheck.lastName !== createPatientDto.lastName ||
        mrnCheck.email !== createPatientDto.email ||
        mrnCheck.phoneNumber !== createPatientDto.phoneNumber;

      if (hasChanges) {
        await this.patientRepository.update(mrnCheck.id, {
          firstName: createPatientDto.firstName,
          lastName: createPatientDto.lastName,
          email: createPatientDto.email,
          phoneNumber: createPatientDto.phoneNumber,
        });
      }

      if (referrerEntity.dateCreated || pcpReferrerEntity.dateCreated) {
        const updateData: Partial<PatientEntity> = {};

        if (pcpReferrerEntity && pcpReferrerEntity.dateCreated) {
          updateData.pcp = pcpReferrerEntity;
        }

        if (referrerEntity && referrerEntity.dateCreated) {
          updateData.referrer = referrerEntity;
        }

        await this.patientRepository.update(mrnCheck.id, updateData);

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
        referrer: referrerEntity.dateCreated ? referrerEntity : undefined,
        pcp: pcpReferrerEntity.dateCreated ? pcpReferrerEntity : undefined,
      });
      return await this.patientRepository.save(newPatient);
    }
  }

  async update({ id, practiceId, data }): Promise<PatientEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (data.referrerId) {
        const refererEntity = await this.referrerService.getReferrerById(
          practiceId,
          data.referrerId,
        );

        delete data.referrerId;
        data.referrer = refererEntity;
      }

      if (data.pcp) {
        const refererEntity = await this.referrerService.getReferrerById(
          practiceId,
          data.pcp,
        );

        delete data.pcp;
        data.pcp = refererEntity;
      }
      const patientEntity = await this.patientRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });

      if (patientEntity) {
        await this.patientRepository.update(id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          mrn: data.mrn,
          referrer: data.referrer ? data.referrer : null,
          pcp: data.pcp ? data.pcp : null,
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
      relations: ['referrer', 'pcp'],
    });
  }

  async getPatientsByMrn(
    practiceId: string,
    mrn: number,
  ): Promise<PatientEntity | null> {
    return this.patientRepository.findOne({
      where: { practice: { id: practiceId }, mrn },
      relations: [
        'referrer',
        'surgeries',
        'evals',
        'surgeries.surgeryConfiguration',
      ],
    });
  }
}
