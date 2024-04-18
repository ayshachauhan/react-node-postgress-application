import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvalEntity } from '@packages/entities/eval';
import { PatientEntity } from '@packages/entities/patient';
import * as fs from 'fs';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeHomesService } from 'src/practiceHomes/practiceHomes.service';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';
import { TransporterService } from 'src/transporter';
import { In, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { InsuranceTypesService } from 'src/insuranceTypes/insuranceTypes.service';
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
    @Inject(forwardRef(() => SurgeryTypesService))
    private surgeryTypeService: SurgeryTypesService,
    @Inject(forwardRef(() => PracticeHomesService))
    private practiceHomesService: PracticeHomesService,
    @Inject(forwardRef(() => InsuranceTypesService))
    private insuranceTypesService: InsuranceTypesService,
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
      relations: ['practiceHome', 'surgeryType', 'patient', 'insuranceType'],
    });

    return dbEvalsByPractice;
  }

  async getEvalById(id: string): Promise<EvalEntity | null> {
    return await this.evalRepository.findOneBy({ id });
  }

  async create({ practiceId, createEvalDto }): Promise<EvalEntity> {
    const newEval: EvalEntity = new EvalEntity();
    const practiceEntity = await this.practiceService.findOne(practiceId);
    const newPatient: PatientEntity = await this.patientService.create(
      createEvalDto,
      practiceEntity,
    );
    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      createEvalDto.surgeryTypeId,
      practiceId,
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

    const resultEval = await this.evalRepository.save({
      ...newEval,
      ...createEvalDto,
      practice: practiceEntity,
      patient: newPatient,
      surgeryType: surgeryTypeEntity,
      practiceHome: practiceHomeEntity,
      insuranceType: insuranceTypeEntity,
    });

    // Read the HTML file content
    const htmlFilePath = path.join(
      __dirname,
      '../emailTemplates/notifyPatient.html',
    );
    const htmlFileContent = fs.readFileSync(htmlFilePath, 'utf8');
    const mailOptions: Mail.Options = {
      to: createEvalDto.email,
      subject: 'Subject: Eval/surgery registered',
      html: htmlFileContent,
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
      surgeryType: surgeryTypeEntity?.name,
      practiceHome: practiceHomeEntity?.name,
      insuranceType: insuranceTypeEntity?.name,
      insuranceDetails: createEvalDto.insuranceDetails,
    };

    await this.transporterService.sendEmail(mailOptions, mailData);

    return resultEval;
  }

  async update({ createEvalDto, id }): Promise<EvalEntity | null> {
    const evalToUpdate = await this.getEvalById(id);

    await this.evalRepository.update(id, {
      ...evalToUpdate,
      ...createEvalDto,
    });

    return await this.evalRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.evalRepository.softDelete(id);
  }
}
