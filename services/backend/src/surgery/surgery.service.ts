import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HistoryAction,
  HistoryType,
  ICalendar,
  PermissionEntity,
  SelectedSurgeryOption,
  SurgeryEntity,
  UserEntity,
} from '@packages/entities';
import { PatientEntity } from '@packages/entities/patient';
import moment from 'moment';
import Mail from 'nodemailer/lib/mailer';
import { SanitizedUser } from 'src/auth/types';
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
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UsersService } from 'src/users/users.service';
import { getFullYearDateConditions, getStartEndDate } from 'src/utils';
import {
  Equal,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { HistoryService } from '../history/history.service';
import { PatientMailData } from './types';

type WhereClause = {
  practiceHome: {
    id: ReturnType<typeof In>;
  };
  date?: Date | FindOperator<Date>;
  patient?: FindOptionsWhere<PatientEntity> | FindOptionsWhere<PatientEntity>[];
};

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
    private readonly transporterService: TransporterService,
    @Inject(forwardRef(() => HistoryService))
    private historyService: HistoryService,
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

  async findSelected(
    practiceId: string,
    includeDelete: boolean = false,
    months: string[] = [],
    searchMRNName?: string,
    option?: string,
    loggedInUserId?: string,
  ): Promise<SurgeryEntity[]> {
    let userPermissions: PermissionEntity[] = [];

    if (loggedInUserId) {
      const userInfo: UserEntity | null =
        await this.userService.getUserById(loggedInUserId);
      userPermissions = userInfo ? userInfo.permissions || [] : [];
    }

    const dbPracticeHomesByPractice =
      await this.practiceHomesService.getPracticeHomesByPractice(practiceId);

    const whereClause: WhereClause = {
      practiceHome: {
        id: In(dbPracticeHomesByPractice.map((ele) => ele.id)),
      },
    };

    const searchConditions: FindManyOptions<SurgeryEntity> = {
      where: whereClause,
      withDeleted: includeDelete,
      relations: [
        'practiceHome',
        'surgeryConfiguration',
        'patient',
        'insuranceType',
        'patient.referrer',
        'doctor',
      ],
    };

    if (option?.toLowerCase() === 'past') {
      const today = new Date();
      whereClause.date = LessThanOrEqual(today);
    }

    const dateConditions =
      months.length > 0
        ? getStartEndDate(months, userPermissions)
        : getFullYearDateConditions(userPermissions);

    if (months.length > 0) {
      if (searchMRNName) {
        updateWhereClauseWithSearchName(whereClause, searchMRNName);
      }

      searchConditions.where = dateConditions.map((condition) => ({
        ...whereClause,
        ...condition,
      }));
    } else if (searchMRNName) {
      updateWhereClauseWithSearchName(whereClause, searchMRNName);
    } else if (months.length === 0 && option?.toLowerCase() !== 'past') {
      searchConditions.where = dateConditions.map((condition) => ({
        ...whereClause,
        ...condition,
      }));
    }

    const dbSurgeryByPractice =
      await this.surgeryRepository.find(searchConditions);
    dbSurgeryByPractice.forEach((ele) => {
      ele.doctor.password = '';
    });

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

    const mailOptions: Mail.Options = {
      to: createSurgeryDto.email,
      subject: 'Eval/surgery registered',
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

    await this.transporterService.sendSystemEmails(
      mailOptions,
      mailData,
      SystemTemplates.NOTIFY_PATIENT,
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
      selectedCheckListOptions: createSurgeryDto.selectedCheckListOption,
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

function updateWhereClauseWithSearchName(
  whereClause: WhereClause,
  searchMRNName: string,
): void {
  const mrnNumber = parseInt(searchMRNName, 10);
  if (!isNaN(mrnNumber)) {
    whereClause.patient = { mrn: Equal(mrnNumber) };
  } else {
    whereClause.patient = [
      { firstName: ILike(`%${searchMRNName}%`) },
      { lastName: ILike(`%${searchMRNName}%`) },
    ];
  }
}
