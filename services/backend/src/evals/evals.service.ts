import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVariables,
  EvalEntity,
  HistoryAction,
  HistoryType,
  IEval,
  ISurgeryConfiguration,
  PatientEntity,
  PracticeEntity,
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
import { formatHeaderDate, toLowerCase, toPascalCase } from 'src/utils';
import { In, Repository } from 'typeorm';
import {
  EvalChangesKeyValues,
  findChangedValues,
  transformEvalObject,
  transformUpdateEvalDTO,
} from '../history/utils';
import { WaitlistService } from '../waitlist/waitlist.service';
import { CreateEvalDto } from './dto/createEval.dto';

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
  ): Promise<EvalEntity[]> {
    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const dbEvalsByPractice = await this.evalRepository.find({
      where: {
        practiceHome: {
          id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
        },
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
      ],
    });
    dbEvalsByPractice.forEach((ele) => (ele.doctor.password = ''));

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
      await this.initiateSendEmail(
        practiceEntity,
        createEvalDto,
        resultEval,
        surgeryConfigurationEntity,
        insuranceTypeEntity?.name,
        practiceHomeEntity?.name,
      );
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
    practice: PracticeEntity,
    dto: CreateEvalDto,
    evalEntity: IEval,
    surgeryConfig: ISurgeryConfiguration,
    insuranceType?: string,
    practiceHome?: string,
  ): Promise<void> {
    const { id: surgeryConfigId, name } = surgeryConfig;
    const formattedDate = formatHeaderDate(String(dto.date));

    const mailVariables: EmailVariables = {
      surgery_type: name,
      fname: dto.firstName,
      lname: dto.lastName,
      mrn: String(dto.mrn),
      pt_email_address: dto.email,
      surgery_date: String(dto.date),
      pt_email_notify: '',
      laterality: toLowerCase(dto.bodyPart),
      Laterality: toPascalCase(dto.bodyPart),
      pod1_location: practiceHome ?? '',
      cataract_variable: '',
      all_cases: dto.bodyPart + ' ' + name + ' | ' + formattedDate,
      all_cataract_dates: name + ' ' + formattedDate,
      all_case_type: name + ' ' + formattedDate,
      phoneNumber: dto.phoneNumber,
      practiceName: practice.name,
      insuranceType: insuranceType ?? '',
    };

    const systemGeneratedMailData = {
      subject: `Eval Scheduled: ${name}`,
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    await this.emailHandlerService.checkAndMakeEmailContent(
      practice,
      surgeryConfigId,
      evalEntity,
      mailVariables,
      systemGeneratedMailData,
      true,
    );
  }
}
