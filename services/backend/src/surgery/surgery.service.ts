import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVariables,
  HistoryAction,
  HistoryType,
  ICalendar,
  SelectedSurgeryOption,
  SurgeryEntity,
} from '@packages/entities';
import { PatientEntity } from '@packages/entities/patient';
import moment from 'moment';
import { SanitizedUser } from 'src/auth/types';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import {
  SurgeryChangesKeyValues,
  findChangedValues,
  transformSurgeryObject,
  transformUpdateSurgeryDTO,
} from 'src/history/utils';
import { InsuranceTypesService } from 'src/insuranceTypes/insuranceTypes.service';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeHomesService } from 'src/practiceHomes/practiceHomes.service';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryConfigurationsService } from 'src/surgeryConfiguration/surgeryConfiguration.service';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { HistoryService } from '../history/history.service';

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
    @Inject(forwardRef(() => SurgeryConfigurationsService))
    private surgeryConfigurationService: SurgeryConfigurationsService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => CalendarService))
    private calendarService: CalendarService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => HistoryService))
    private historyService: HistoryService,
    @Inject(forwardRef(() => EmailHandlerService))
    private emailHandlerService: EmailHandlerService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async findAll(
    practiceId: string,
    includeDelete: boolean = false,
  ): Promise<SurgeryEntity[]> {
    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const dbSurgeryByPractice = await this.surgeryRepository.find({
      where: {
        practiceHome: {
          id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
        },
      },
      withDeleted: includeDelete,
      relations: [
        'practiceHome',
        'surgeryConfiguration',
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
    return await this.surgeryRepository.findOne({
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

  async create(
    { practiceId, createSurgeryDto },
    request: Request & { user: SanitizedUser },
  ): Promise<SurgeryEntity> {
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

    const surgeryConfigurationEntity =
      await this.surgeryConfigurationService.getSurgeryConfigurationById(
        createSurgeryDto.surgeryConfigurationId,
      );
    const optionsArr: SelectedSurgeryOption[] = Object.values(
      createSurgeryDto.selectedSurgeryOptions,
    );
    optionsArr.forEach((option) => {
      createSurgeryDto.totalHospitalPricing += +option.hospitalPricing;
      createSurgeryDto.totalProfessionalPricing += +option.professionalPricing;
    });

    const resultSurgery = await this.surgeryRepository.save({
      ...newSurgery,
      ...createSurgeryDto,
      practice: practiceEntity,
      patient: newPatient,
      surgeryType: surgeryTypeEntity,
      practiceHome: practiceHomeEntity,
      insuranceType: insuranceTypeEntity,
      doctor: doctorEntity,
      surgeryConfiguration: surgeryConfigurationEntity,
    });

    // upsert calendar after creating surgery
    if (surgeryConfigurationEntity && practiceEntity && doctorEntity) {
      const calendars = await this.calendarService.getAllCalendars({
        practiceId: practiceEntity?.id,
        userId: doctorEntity?.id,
      });

      const selectedCalendar = calendars.find(
        (calendar: ICalendar) =>
          moment(calendar.date).format('YYYY-MM-DD') ===
          moment(createSurgeryDto.date).format('YYYY-MM-DD'),
      );

      if (selectedCalendar) {
        await this.calendarService.updateCalendar({
          id: selectedCalendar.id,
          bookedSlots: selectedCalendar.bookedSlots + 1,
        });
      } else {
        await this.calendarService.createCalendar(
          {
            practiceId: practiceEntity.id,
            userId: doctorEntity.id,
          },
          {
            date: createSurgeryDto.date,
            bookedSlots: 1,
            maxSlots: 14,
            surgeryConfigurationId: surgeryConfigurationEntity.id,
          },
        );
      }
    }

    // create history entry after creating surgery
    await this.historyService.createHistory({
      practiceId,
      userId: request?.user.id,
      entityId: resultSurgery.id,
      entityType: HistoryType.SURGERY,
      action: HistoryAction.CREATE,
      ipAddress: createSurgeryDto.ipAddress,
    });

    const mailVariables: EmailVariables = {
      surgery_type: surgeryConfigurationEntity
        ? surgeryConfigurationEntity.name
        : '',
      fname: newPatient.firstName,
      lname: newPatient.lastName,
      mrn: String(newPatient.mrn),
      pt_email_address: newPatient.email,
      surgery_date: String(resultSurgery.date),
      pt_email_notify: '',
      laterality: createSurgeryDto.bodyPart,
      Laterality: createSurgeryDto.bodyPart,
      pod1_location: '',
      cataract_variable: '',
      all_cases: surgeryConfigurationEntity?.name + ' ' + createSurgeryDto.date,
      all_cataract_dates:
        surgeryConfigurationEntity?.name + ' ' + createSurgeryDto.date,
      all_case_type:
        surgeryConfigurationEntity?.name + ' ' + createSurgeryDto.date,
    };

    const systemGeneratedMailData = {
      subject: 'Eval/ Surgery registered',
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    await this.emailHandlerService.checkAndMakeEmailContent(
      createSurgeryDto.surgeryConfigurationId,
      resultSurgery,
      mailVariables,
      systemGeneratedMailData,
      false,
    );

    return resultSurgery;
  }

  async update(
    { createSurgeryDto, id, practiceId },
    request: Request & { user: SanitizedUser },
  ): Promise<SurgeryEntity | null> {
    const surgeryToUpdate = await this.getSurgeryById(id);

    if (createSurgeryDto.insuranceTypeId) {
      const insuranceTypeEntity =
        await this.insuranceTypesService.getInsuranceTypeById(
          createSurgeryDto.insuranceTypeId,
          practiceId,
        );

      delete createSurgeryDto.insuranceTypeId;
      createSurgeryDto.insuranceType = insuranceTypeEntity;
    }

    if (surgeryToUpdate) {
      await this.patientService.update({
        id: surgeryToUpdate.patient.id,
        practiceId,
        data: createSurgeryDto,
      });
    }
    const dataToUpdate = {
      insuranceType: createSurgeryDto.insuranceType
        ? createSurgeryDto.insuranceType
        : null,
      date: createSurgeryDto.date,
      selectedSurgeryOptions: createSurgeryDto.selectedSurgeryOptions,
      totalHospitalPricing: createSurgeryDto.totalHospitalPricing,
      totalProfessionalPricing: createSurgeryDto.totalProfessionalPricing,
      selectedCheckListOptions: createSurgeryDto.selectedCheckListOptions,
      bodyPart: createSurgeryDto.bodyPart,
    };

    await this.surgeryRepository.update(id, {
      ...surgeryToUpdate,
      ...dataToUpdate,
    });

    // depends on dto values, make sure to update the obj values if dot changes
    const transformedCurrentSurgeryValues: SurgeryChangesKeyValues =
      transformSurgeryObject(surgeryToUpdate!);
    const transformedUpdatedDTOValues: SurgeryChangesKeyValues =
      transformUpdateSurgeryDTO(createSurgeryDto);

    await this.historyService.createHistory({
      practiceId,
      userId: request?.user.id,
      action: HistoryAction.UPDATE,
      entityId: id,
      entityType: HistoryType.SURGERY,
      // this depends on dto values, make sure to update this function object if dto updates
      changes: findChangedValues(
        transformedCurrentSurgeryValues,
        transformedUpdatedDTOValues,
      ),
      ipAddress: createSurgeryDto.ipAddress,
    });

    return await this.surgeryRepository.findOne({
      where: { id },
    });
  }

  async remove(
    id: string,
    practiceId: string,
    request: Request & { user: SanitizedUser },
    ipAddress: string,
  ): Promise<void> {
    await this.surgeryRepository.softDelete(id);

    await this.historyService.createHistory({
      practiceId,
      userId: request?.user?.id,
      entityId: id,
      entityType: HistoryType.SURGERY,
      action: HistoryAction.DELETE,
      ipAddress,
    });
  }
}
