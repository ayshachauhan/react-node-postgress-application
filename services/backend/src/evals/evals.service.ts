import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EvalEntity,
  HistoryAction,
  HistoryType,
  IEval,
  IPractice,
  PatientEntity,
} from '@packages/entities';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { DeleteEvalData } from 'src/evals/types';
import { HistoryService } from 'src/history/history.service';
import { InsuranceTypesService } from 'src/insuranceTypes/insuranceTypes.service';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeHomesService } from 'src/practiceHomes/practiceHomes.service';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryConfigurationsService } from 'src/surgeryConfiguration/surgeryConfiguration.service';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UsersService } from 'src/users/users.service';
import { formatHeaderDate } from 'src/utils';
import { In, MoreThan, Repository } from 'typeorm';
import {
  EvalChangesKeyValues,
  findChangedValues,
  transformEvalObject,
  transformUpdateEvalDTO,
} from '../history/utils';
import { WaitlistService } from '../waitlist/waitlist.service';

@Injectable()
export class EvalsService {
  constructor(
    @InjectRepository(EvalEntity)
    private evalRepository: Repository<EvalEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => PracticeHomesService))
    private practiceHomesService: PracticeHomesService,
    @Inject(forwardRef(() => InsuranceTypesService))
    private insuranceTypesService: InsuranceTypesService,
    @Inject(forwardRef(() => WaitlistService))
    private waitlistService: WaitlistService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => SurgeryConfigurationsService))
    private surgeryConfigurationService: SurgeryConfigurationsService,
    @Inject(forwardRef(() => EmailHandlerService))
    private emailHandlerService: EmailHandlerService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => HistoryService))
    private historyService: HistoryService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async findAll(
    practiceId: string,
    includeDeleted: boolean = false,
    doctorId?: string,
  ): Promise<EvalEntity[]> {
    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const dbEvalsByPractice = await this.evalRepository.find({
      where: {
        practiceHome: {
          id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
        },
        practice: { id: practiceId }, //TO DO: make practice id not null in future
        doctor: { id: doctorId },
      },
      withDeleted: includeDeleted,
      relations: [
        'practiceHome',
        'surgeryConfiguration',
        'patient',
        'insuranceType',
        'patient.referrer',
        'doctor',
        'waitlist',
        'practice', //TO DO: make practice id not null in future
      ],
      order: {
        date: 'DESC',
      },
    });
    dbEvalsByPractice.forEach((ele) => (ele.doctor.password = ''));
    const statusOrder = {
      'future evaluation': 1,
      book: 2,
      cancel: 3,
      return: 4,
      'no show': 5,
    };

    dbEvalsByPractice.sort((eval1, eval2) => {
      const status1 = eval1.status.toLowerCase();
      const status2 = eval2.status.toLowerCase();
      return statusOrder[status1] - statusOrder[status2];
    });
    return dbEvalsByPractice;
  }

  async getEvalById(id: string): Promise<EvalEntity | null> {
    return await this.evalRepository.findOne({
      where: { id },
      relations: [
        'practiceHome',
        'surgeryConfiguration',
        'patient',
        'insuranceType',
        'patient.referrer',
        'doctor',
        'waitlist',
        'practice', //TO DO: make practice id not null in future
      ],
    });
  }

  async create({ practiceId, createEvalDto, user }): Promise<EvalEntity> {
    const newEval: EvalEntity = new EvalEntity();

    const practiceEntity = await this.practiceService.findOne(practiceId);
    const newPatient: PatientEntity = await this.patientService.create(
      createEvalDto,
      practiceEntity,
    );

    const surgeryConfigurationEntity =
      await this.surgeryConfigurationService.getSurgeryConfigurationById(
        createEvalDto.surgeryConfigurationId,
      );

    const insuranceTypeEntity =
      await this.insuranceTypesService.getInsuranceTypeById(
        createEvalDto.insuranceTypeId,
        practiceId,
      );

    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createEvalDto.practiceHomeId,
        practiceId,
      );

    const doctorEntity = await this.userService.getUserById(
      createEvalDto.doctorId,
    );

    const waitlistEntity = await this.waitlistService.getWaitlistById(
      createEvalDto.waitlistId,
      practiceId,
    );

    const resultEval = await this.evalRepository.save({
      ...newEval,
      ...createEvalDto,
      practice: practiceEntity,
      patient: newPatient,
      surgeryConfiguration: surgeryConfigurationEntity,
      practiceHome: practiceHomeEntity,
      insuranceType: insuranceTypeEntity,
      doctor: doctorEntity,
      waitlist: waitlistEntity,
    });

    // create history entry after creating eval
    await this.historyService.createHistory({
      practiceId,
      userId: user?.id,
      entityId: resultEval.id,
      entityType: HistoryType.EVAL,
      action: HistoryAction.CREATE,
      ipAddress: createEvalDto.ipAddress,
    });

    if (practiceEntity && surgeryConfigurationEntity) {
      await this.initiateSendEmail(resultEval, practiceEntity);
      await this.initiateDoctorSendEmail(resultEval, practiceEntity);
      await this.initiateReferrerSendEmail(resultEval, practiceEntity);
    }
    return resultEval;
  }

  async update({
    createEvalDto,
    id,
    user,
    practiceId,
  }): Promise<EvalEntity | null> {
    const evalToUpdate = await this.getEvalById(id);

    if (createEvalDto.insuranceTypeId) {
      createEvalDto.insuranceType =
        await this.insuranceTypesService.getInsuranceTypeById(
          createEvalDto.insuranceTypeId,
          createEvalDto.practiceId,
        );
    }

    const newPatient: PatientEntity | null = await this.patientService.update({
      id: evalToUpdate?.patient.id,
      practiceId: createEvalDto.practiceId,
      data: createEvalDto,
    });

    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createEvalDto.practiceHomeId,
        practiceId,
      );

    const waitlistEntity = await this.waitlistService.getWaitlistById(
      createEvalDto.waitlistId,
      practiceId,
    );

    delete createEvalDto.practiceId;
    delete createEvalDto.insuranceTypeId;

    await this.evalRepository.update(id, {
      ...evalToUpdate,
      insuranceType: createEvalDto.insuranceType
        ? createEvalDto.insuranceType
        : evalToUpdate?.insuranceType,
      patient: newPatient ? newPatient : evalToUpdate?.patient,
      status: createEvalDto.status,
      bodyPart: createEvalDto.bodyPart,
      notes: createEvalDto.notes,
      date: createEvalDto.date,
      insuranceDetails: createEvalDto.insuranceDetails,
      waitlist: waitlistEntity ? waitlistEntity : evalToUpdate?.waitlist,
      practiceHome: practiceHomeEntity
        ? practiceHomeEntity
        : evalToUpdate?.practiceHome,
    });

    if (evalToUpdate) {
      // depends on dto values, make sure to update the obj values if dto changes
      const transformedCurrentEvalValues: EvalChangesKeyValues =
        transformEvalObject(evalToUpdate);
      const transformedUpdatedDTOValues: EvalChangesKeyValues =
        transformUpdateEvalDTO({
          ...createEvalDto,
          insuranceName: createEvalDto?.insuranceType?.name,
        });

      // create history logs for updated values in evals
      await this.historyService.createHistory({
        practiceId,
        userId: user?.id,
        action: HistoryAction.UPDATE,
        entityId: id,
        entityType: HistoryType.EVAL,
        // this depends on dto values, make sure to update this function object if dto updates
        changes: findChangedValues(
          transformedCurrentEvalValues,
          transformedUpdatedDTOValues,
        ),
        ipAddress: createEvalDto.ipAddress,
      });
    }
    return await this.evalRepository.findOne({
      where: { id },
    });
  }

  async remove({
    id,
    practiceId,
    user,
    ipAddress,
  }: DeleteEvalData): Promise<void> {
    await this.evalRepository.softDelete(id);

    await this.historyService.createHistory({
      practiceId,
      userId: user?.id,
      entityId: id,
      entityType: HistoryType.EVAL,
      action: HistoryAction.DELETE,
      ipAddress,
    });
  }

  async initiateSendEmail(
    evalEntity: IEval,
    practice: IPractice,
  ): Promise<void> {
    const { name } = evalEntity.surgeryConfiguration;

    const systemGeneratedMailData = {
      subject: `Eval Scheduled: ${name}`,
      text: `<p>Dear ${evalEntity?.patient.firstName},<p>
        <p>Your eval has been scheduled for ${formatHeaderDate(
          String(evalEntity?.date),
        )}. If you have any questions or need to reschedule, please contact us at support@pod111.com.<p>
        <p>Thank you,</p>
        <p>${practice.name}</p>
      `,
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    await this.emailHandlerService.checkAndMakeEmailContent(
      practice,
      evalEntity,
      systemGeneratedMailData,
      true,
    );
  }

  async initiateDoctorSendEmail(
    evalEntity: IEval,
    practice: IPractice,
  ): Promise<void> {
    const name = practice.name;

    const systemGeneratedMailData = {
      subject: `A new surgery added to your practice ${name}`,
      text: `<p>An eval has been scheduled for you. Here is the summary:</p><p>${evalEntity
        ?.patient?.firstName} ${evalEntity?.patient
        ?.lastName} (${formatHeaderDate(
        String(evalEntity?.date),
      )} | ${evalEntity?.surgeryConfiguration?.name})</p>`,
      systemTemplate: SystemTemplates.NOTIFY_DOCTOR,
    };

    await this.emailHandlerService.checkAndMakeDoctorEmailContent(
      practice,
      evalEntity,
      systemGeneratedMailData,
      true,
    );
  }

  async initiateReferrerSendEmail(
    evalEntity: IEval,
    practice: IPractice,
  ): Promise<void> {
    const name = practice.name;
    const systemGeneratedMailData = {
      subject: `Thanks for sending your patient to me: ${name}`,
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_REFERRER,
    };
    await this.emailHandlerService.checkAndMakeReferrerEmailContent(
      practice,
      evalEntity,
      systemGeneratedMailData,
      true,
    );
  }

  async findEvalByPatient(patientId: string, date: Date): Promise<IEval[]> {
    return await this.evalRepository.find({
      where: { patient: { id: patientId }, date: MoreThan(date) },
      relations: ['surgeryConfiguration'],
    });
  }
}
