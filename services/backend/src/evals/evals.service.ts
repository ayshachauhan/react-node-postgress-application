import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVariables,
  EvalEntity,
  HistoryAction,
  HistoryType,
  InsuranceTypeEntity,
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
import { In, Repository } from 'typeorm';
import {
  EvalChangesKeyValues,
  findChangedValues,
  transformEvalObject,
  transformUpdateEvalDTO,
} from '../history/utils';

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

    let insuranceTypeEntity: InsuranceTypeEntity | null =
      new InsuranceTypeEntity();
    if (createEvalDto.insuranceTypeId) {
      insuranceTypeEntity =
        await this.insuranceTypesService.getInsuranceTypeById(
          createEvalDto.insuranceTypeId,
          practiceId,
        );
    }

    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createEvalDto.practiceHomeId,
        practiceId,
      );

    const doctorEntity = await this.userService.getUserById(
      createEvalDto.doctorId,
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

    const mailVariables: EmailVariables = {
      surgery_type: surgeryConfigurationEntity
        ? surgeryConfigurationEntity.name
        : '',
      fname: newPatient.firstName,
      lname: newPatient.lastName,
      mrn: String(newPatient.mrn),
      pt_email_address: newPatient.email,
      surgery_date: String(resultEval.date),
      pt_email_notify: '',
      laterality: createEvalDto.bodyPart,
      Laterality: createEvalDto.bodyPart,
      pod1_location: '',
      cataract_variable: '',
      all_cases: surgeryConfigurationEntity?.name + ' ' + createEvalDto.date,
      all_cataract_dates:
        surgeryConfigurationEntity?.name + ' ' + createEvalDto.date,
      all_case_type:
        surgeryConfigurationEntity?.name + ' ' + createEvalDto.date,
      phoneNumber: createEvalDto.phoneNumber,
    };

    const systemGeneratedMailData = {
      subject: 'Eval/ Surgery registered',
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    if (practiceEntity) {
      await this.emailHandlerService.checkAndMakeEmailContent(
        practiceEntity,
        createEvalDto.surgeryConfigurationId,
        resultEval,
        mailVariables,
        systemGeneratedMailData,
        true,
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

    let insuranceTypeEntity: InsuranceTypeEntity | null =
      new InsuranceTypeEntity();

    if (createEvalDto.insuranceTypeId) {
      insuranceTypeEntity =
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

    delete createEvalDto.practiceId;
    delete createEvalDto.insuranceTypeId;

    await this.evalRepository.update(id, {
      ...evalToUpdate,
      insuranceType: insuranceTypeEntity ? insuranceTypeEntity : undefined,
      patient: newPatient ? newPatient : evalToUpdate?.patient,
      status: createEvalDto.status,
      bodyPart: createEvalDto.bodyPart,
      date: createEvalDto.date,
      insuranceDetails: createEvalDto.insuranceDetails,
    });

    if (evalToUpdate) {
      // depends on dto values, make sure to update the obj values if dto changes
      const transformedCurrentEvalValues: EvalChangesKeyValues =
        transformEvalObject(evalToUpdate);
      const transformedUpdatedDTOValues: EvalChangesKeyValues =
        transformUpdateEvalDTO({
          ...createEvalDto,
          insuranceName: insuranceTypeEntity?.name,
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
}
