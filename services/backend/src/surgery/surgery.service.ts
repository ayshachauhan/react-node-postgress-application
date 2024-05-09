import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { SurgeryEntity } from '@packages/entities';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { InsuranceTypesService } from 'src/insuranceTypes/insuranceTypes.service';
import { UsersService } from 'src/users/users.service';
import { PatientMailData } from './types';

@Injectable()
export class SurgeryService {
  constructor(
    @InjectRepository(SurgeryEntity)
    private surgeryRepository: Repository<SurgeryEntity>,
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
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private readonly configService: ConfigService,
    private readonly transporterService: TransporterService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async findAll(practiceId: string): Promise<SurgeryEntity[]> {
    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const dbSurgeryByPractice = await this.surgeryRepository.find({
      where: {
        practiceHome: {
          id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
        },
      },
      relations: [
        'practiceHome',
        'surgeryType',
        'patient',
        'insuranceType',
        'patient.referrer',
        'doctor',
      ],
    });

    dbSurgeryByPractice.forEach((ele) => (ele.doctor.password = ''));

    return dbSurgeryByPractice;
  }

  async getSurgeryById(id: string): Promise<SurgeryEntity | null> {
    return await this.surgeryRepository.findOneBy({ id });
  }

  async create({ practiceId, createSurgeryDto }): Promise<SurgeryEntity> {
    const newSurgery: SurgeryEntity = new SurgeryEntity();
    const practiceEntity = await this.practiceService.findOne(practiceId);
    const newPatient: PatientEntity = await this.patientService.create(
      createSurgeryDto,
      practiceEntity,
    );
    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      createSurgeryDto.surgeryTypeId,
      practiceId,
    );

    const insuranceTypeEntity =
      await this.insuranceTypesService.getInsuranceTypeById(
        createSurgeryDto.insuranceTypeId,
        practiceId,
      );

    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createSurgeryDto.practiceHomeId,
        practiceId,
      );

    const doctorEntity = await this.userService.getUserById(
      createSurgeryDto.doctorId,
    );

    const resultSurgery = await this.surgeryRepository.save({
      ...newSurgery,
      ...createSurgeryDto,
      practice: practiceEntity,
      patient: newPatient,
      surgeryType: surgeryTypeEntity,
      practiceHome: practiceHomeEntity,
      insuranceType: insuranceTypeEntity,
      doctor: doctorEntity,
    });

    await this.userService.updateUserSurgeries({
      id: doctorEntity?.id,
      surgeryEntity: resultSurgery,
    });

    // Read the HTML file content
    const htmlFilePath = path.join(
      __dirname,
      '../emailTemplates/notifyPatient.html',
    );
    const htmlFileContent = fs.readFileSync(htmlFilePath, 'utf8');
    const mailOptions: Mail.Options = {
      to: createSurgeryDto.email,
      subject: 'Eval/surgery registered',
      html: htmlFileContent,
      text: 'text message',
    };

    const mailData: PatientMailData = {
      practiceName: practiceEntity?.name,
      firstName: createSurgeryDto.firstName,
      lastName: createSurgeryDto.lastName,
      mrn: createSurgeryDto.mrn,
      email: createSurgeryDto.email,
      phoneNumber: createSurgeryDto.phoneNumber,
      date: createSurgeryDto.date,
      surgeryType: surgeryTypeEntity?.name,
      practiceHome: practiceHomeEntity?.name,
      insuranceType: insuranceTypeEntity?.name,
      insuranceDetails: createSurgeryDto.insuranceDetails,
    };

    await this.transporterService.sendEmail(mailOptions, mailData);

    return resultSurgery;
  }

  async update({ createSurgeryDto, id }): Promise<SurgeryEntity | null> {
    const surgeryToUpdate = await this.getSurgeryById(id);

    await this.surgeryRepository.update(id, {
      ...surgeryToUpdate,
      ...createSurgeryDto,
    });

    return await this.surgeryRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.surgeryRepository.softDelete(id);
  }
}
