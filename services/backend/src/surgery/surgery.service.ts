import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVariables,
  HistoryAction,
  HistoryType,
  ICalendar,
  ISurgery,
  ISurgeryConfiguration,
  PermissionEntity,
  PracticeEntity,
  ReviewEntity,
  ReviewStatus,
  SelectedSurgeryOption,
  SurgeryEntity,
  SurgeryStatus,
} from '@packages/entities';
import { PatientEntity } from '@packages/entities/patient';
import { USER_PERMISSIONS } from '@packages/entities/permission';
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
import { ReviewService } from 'src/review/review.service';
import { SurgeryConfigurationsService } from 'src/surgeryConfiguration/surgeryConfiguration.service';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { UsersService } from 'src/users/users.service';
import {
  formatHeaderDate,
  getFullYearDateConditions,
  getStartEndDate,
  toLowerCase,
  toPascalCase,
} from 'src/utils';
import { WaitlistService } from 'src/waitlist/waitlist.service';
import {
  Equal,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { HistoryService } from '../history/history.service';
import { CreateSurgeryDto } from './dto/createSurgery.dto';

type DateCondition = {
  date: FindOperator<Date>;
};

interface SurgerySearchResult {
  surgeries: SurgeryEntity[];
  restricted: boolean;
}

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
    @Inject(forwardRef(() => WaitlistService))
    private waitlistService: WaitlistService,
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
    @Inject(forwardRef(() => ReviewService))
    private reviewService: ReviewService,
  ) {}

  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async findAll(
    practiceId: string,
    includeDelete: boolean = false,
    months: string[] = [],
    searchMRNName?: string,
    option?: string,
    loggedInUserId?: string,
  ): Promise<SurgerySearchResult> {
    const [userInfo, dbPracticeHomesByPractice] = await Promise.all([
      loggedInUserId ? this.userService.getUserById(loggedInUserId) : null,
      this.practiceHomesService.getPracticeHomesByPractice(practiceId),
    ]);

    const userPermissions: PermissionEntity[] = userInfo
      ? userInfo.permissions || []
      : [];

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
        'waitlist',
      ],
    };

    const searchConditionsWithoutPermissions = { ...searchConditions };

    if (option?.toLowerCase() === 'past') {
      const today = new Date();
      whereClause.date = LessThanOrEqual(today);
    }

    const dateConditionsWithPermissions = getConditions(
      months,
      userPermissions,
    );
    const dateConditionsWithoutPermissions = getConditions(months, []);

    if (
      months.length === 0 &&
      searchMRNName &&
      option?.toLowerCase() !== 'past'
    ) {
      updateWhereClauseWithSearchName(whereClause, searchMRNName);
      searchConditions.where = mapDateConditions(
        dateConditionsWithPermissions,
        whereClause,
      );
      searchConditionsWithoutPermissions.where = mapDateConditions(
        dateConditionsWithoutPermissions,
        whereClause,
      );
    } else {
      if (searchMRNName) {
        updateWhereClauseWithSearchName(whereClause, searchMRNName);
      }

      if (
        months.length > 0 ||
        (months.length === 0 && option?.toLowerCase() !== 'past')
      ) {
        searchConditions.where = mapDateConditions(
          dateConditionsWithPermissions,
          whereClause,
        );
        searchConditionsWithoutPermissions.where = mapDateConditions(
          dateConditionsWithoutPermissions,
          whereClause,
        );
      }
    }

    const [dbSurgeryByPractice, dbSurgeryByPracticeWithoutPermission] =
      await Promise.all([
        this.surgeryRepository.find(searchConditions),
        this.surgeryRepository.find(searchConditionsWithoutPermissions),
      ]);

    dbSurgeryByPractice.forEach((ele) => {
      ele.doctor.password = '';
    });

    const restricted =
      dbSurgeryByPracticeWithoutPermission.length > 0 &&
      ((!userPermissions.some(
        (p) => p.name === USER_PERMISSIONS.VIEW_PAST_CASES,
      ) &&
        dbSurgeryByPracticeWithoutPermission.some(
          (s) => s.date < new Date(),
        )) ||
        (!userPermissions.some(
          (p) => p.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
        ) &&
          dbSurgeryByPracticeWithoutPermission.some(
            (s) => s.date > new Date(),
          )));

    return { surgeries: dbSurgeryByPractice, restricted };
  }

  async getSurgeryById(id: string): Promise<SurgeryEntity | null> {
    return await this.surgeryRepository.findOne({
      where: { id },
      relations: [
        'practiceHome',
        'practiceHome.practice',
        'surgeryConfiguration',
        'patient',
        'insuranceType',
        'patient.referrer',
        'doctor',
        'waitlist',
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

    const waitlistEntity = await this.waitlistService.getWaitlistById(
      createSurgeryDto.waitlistId,
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
      createSurgeryDto.totalHospitalPricing =
        +option.hospitalPricing + +createSurgeryDto.totalHospitalPricing;
      createSurgeryDto.totalProfessionalPricing =
        +option.professionalPricing +
        +createSurgeryDto.totalProfessionalPricing;
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
      surgeryStatus: SurgeryStatus.BOOK,
      waitlist: waitlistEntity,
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

    if (practiceEntity && surgeryConfigurationEntity) {
      await this.initiateSendEmail(
        practiceEntity,
        createSurgeryDto,
        resultSurgery,
        surgeryConfigurationEntity,
        insuranceTypeEntity?.name,
        practiceHomeEntity?.name,
      );
    }

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

    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createSurgeryDto.practiceHomeId,
        practiceId,
      );

    if (surgeryToUpdate) {
      await this.patientService.update({
        id: surgeryToUpdate.patient.id,
        practiceId,
        data: createSurgeryDto,
      });
    }

    const waitlistEntity = await this.waitlistService.getWaitlistById(
      createSurgeryDto.waitlistId,
      practiceId,
    );

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
      surgeryOrder: createSurgeryDto.surgeryOrder
        ? createSurgeryDto.surgeryOrder
        : surgeryToUpdate?.surgeryOrder,
      practiceHome: practiceHomeEntity
        ? practiceHomeEntity
        : surgeryToUpdate?.practiceHome,
      waitlist: waitlistEntity ? waitlistEntity : surgeryToUpdate?.waitlist,
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

  async autoCompleteSurgeries(surgeryId: string = '') {
    if (surgeryId) {
      const surgeryResponse = await this.surgeryRepository.update(
        {
          id: surgeryId,
        },
        {
          surgeryStatus: SurgeryStatus.COMPLETED,
        },
      );
      if (surgeryResponse.affected) {
        const surgeryData = await this.getSurgeryById(surgeryId);
        if (surgeryData && surgeryData.practiceHome.practice) {
          await this.createReviewEntity([
            {
              reviewStatus: ReviewStatus.PENDING,
              practice: surgeryData.practiceHome.practice,
              patient: surgeryData.patient,
            },
          ]);
        }
      }
    } else {
      const surgeryCompletedEntries = await this.surgeryRepository.find({
        where: {
          date: LessThan(new Date(Date.now())),
          surgeryStatus: In([SurgeryStatus.PENDING]),
        },
        relations: ['practiceHome', 'practiceHome.practice', 'patient'],
      });

      const surgeryData = await this.surgeryRepository.update(
        {
          date: LessThan(new Date(Date.now())),
          surgeryStatus: In([SurgeryStatus.PENDING]),
        },
        {
          surgeryStatus: SurgeryStatus.COMPLETED,
        },
      );

      if (surgeryData.affected && surgeryCompletedEntries.length) {
        const reviewEntries = surgeryCompletedEntries.map((entry) => ({
          reviewStatus: ReviewStatus.PENDING,
          practice: entry.practiceHome.practice,
          patient: entry.patient,
        }));

        await this.createReviewEntity(reviewEntries);
      }
    }
  }

  async createReviewEntity(reviewEntries: Partial<ReviewEntity>[]) {
    await this.reviewService.createReview(reviewEntries);
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

  async initiateSendEmail(
    practice: PracticeEntity,
    dto: CreateSurgeryDto,
    surgery: ISurgery,
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
      subject: `Surgery Scheduled: ${name}`,
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    await this.emailHandlerService.checkAndMakeEmailContent(
      practice,
      surgeryConfigId,
      surgery,
      mailVariables,
      systemGeneratedMailData,
      false,
    );
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

function getConditions(
  months: string[],
  permissions: PermissionEntity[],
): DateCondition[] {
  return months.length > 0
    ? getStartEndDate(months, permissions)
    : getFullYearDateConditions(permissions);
}

function mapDateConditions(
  dateConditions: DateCondition[],
  whereClause: WhereClause,
): WhereClause[] {
  return dateConditions.map((condition) => ({
    ...whereClause,
    ...condition,
  }));
}
