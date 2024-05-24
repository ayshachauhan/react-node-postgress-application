import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvalEntity } from '@packages/entities/eval';
import { PatientEntity } from '@packages/entities/patient';
import Mail from 'nodemailer/lib/mailer';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeHomesService } from 'src/practiceHomes/practiceHomes.service';
import { PracticesService } from 'src/practices/practices.service';
import { TransporterService } from 'src/transporter';
import { In, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { InsuranceTypeEntity } from '@packages/entities';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { InsuranceTypesService } from 'src/insuranceTypes/insuranceTypes.service';
import { SurgeryConfigurationsService } from 'src/surgeryConfiguration/surgeryConfiguration.service';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UsersService } from 'src/users/users.service';
import { PatientMailData } from './types';

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
    private readonly configService: ConfigService,
    private readonly transporterService: TransporterService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async findAll(practiceId: string): Promise<EvalEntity[]> {
    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const dbEvalsByPractice = await this.evalRepository.find({
      where: {
        practiceHome: {
          id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
        },
      },
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

  async create({ practiceId, createEvalDto }): Promise<EvalEntity> {
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
    const mailOptions: Mail.Options = {
      to: createEvalDto.email,
      subject: 'Eval/surgery registered',
      text: 'text message',
    };

    const mailData: PatientMailData = {
      practiceName: practiceEntity?.name,
      firstName: createEvalDto.firstName,
      lastName: createEvalDto.lastName,
      mrn: createEvalDto.mrn,
      email: createEvalDto.email,
      phoneNumber: createEvalDto.phoneNumber,
      date: createEvalDto.date,
      surgeryType: surgeryConfigurationEntity?.name,
      practiceHome: practiceHomeEntity?.name,
      insuranceType: insuranceTypeEntity?.name,
      insuranceDetails: createEvalDto.insuranceDetails,
    };

    await this.transporterService.sendSystemEmails(
      mailOptions,
      mailData,
      SystemTemplates.NOTIFY_PATIENT,
    );

    return resultEval;
  }

  async update({ createEvalDto, id }): Promise<EvalEntity | null> {
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

    return await this.evalRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.evalRepository.softDelete(id);
  }
}
