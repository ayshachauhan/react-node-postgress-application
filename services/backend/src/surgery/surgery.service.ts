import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HistoryAction,
  HistoryType,
  ICalendar,
  IPractice,
  ISurgery,
  PermissionEntity,
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
} from 'src/utils';
import { WaitlistService } from 'src/waitlist/waitlist.service';
import {
  Between,
  Equal,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { HistoryService } from '../history/history.service';

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
  practice: {
    id: string; //TO DO: make practice id not null in future
  };
  date?: Date | FindOperator<Date>;
  patient?: FindOptionsWhere<PatientEntity> | FindOptionsWhere<PatientEntity>[];
  doctor?: { id: string };
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
    doctorId?: string,
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
      practice: { id: practiceId }, //TO DO: make practice id not null in future
    };

    if (doctorId) {
      whereClause.doctor = { id: doctorId };
    }

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
        'practice', //TO DO: make practice id not null in future
      ],
      order: {},
    };

    if (option?.toLowerCase() === 'past view') {
      searchConditions.order = {
        date: 'DESC',
      };
    } else if (option?.toLowerCase() === 'upcoming view') {
      searchConditions.order = {
        date: 'ASC',
      };
    } else {
      searchConditions.order = {
        dateCreated: 'DESC',
      };
    }

    const searchConditionsWithoutPermissions = { ...searchConditions };
    const dateConditionsWithPermissions = getConditions(
      months,
      userPermissions,
    );
    const dateConditionsWithoutPermissions = getConditions(months, []);

    if (option?.toLowerCase() === 'past view') {
      const today = new Date();
      today.setUTCHours(23, 59, 59, 999); // Set to the end of today

      if (months.length > 0) {
        const currentYear = today.getFullYear();
        const dateConditions: FindOperator<Date>[] = months.map((monthName) => {
          const monthIndex = new Date(
            Date.parse(monthName + ' 1, ' + currentYear),
          ).getMonth();
          const startOfMonth = new Date(Date.UTC(currentYear, monthIndex, 1));
          const endOfMonth = new Date(
            Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999),
          );

          if (monthIndex === today.getUTCMonth()) {
            return Between(startOfMonth, today);
          } else {
            return Between(startOfMonth, endOfMonth);
          }
        });

        if (dateConditions.length > 1) {
          whereClause.date = Or(...dateConditions);
        } else {
          whereClause.date = dateConditions[0];
        }
      } else {
        whereClause.date = LessThanOrEqual(today); // Only past records
      }
      if (searchMRNName) {
        updateWhereClauseWithSearchName(whereClause, searchMRNName);
      }
      searchConditions.where = whereClause;
      searchConditionsWithoutPermissions.where = whereClause;
    } else if (option?.toLowerCase() === 'upcoming view') {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set to beginning of today
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1); // Set to yesterday
      if (months.length > 0) {
        const currentYear = today.getFullYear();
        const dateConditions: FindOperator<Date>[] = months.map((monthName) => {
          const monthIndex = new Date(
            Date.parse(monthName + ' 1, ' + currentYear),
          ).getMonth();
          const startOfMonth = new Date(Date.UTC(currentYear, monthIndex, 1));
          const endOfMonth = new Date(
            Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999),
          );

          if (monthIndex === today.getUTCMonth()) {
            return Between(yesterday, endOfMonth);
          } else {
            return Between(startOfMonth, endOfMonth);
          }
        });

        if (dateConditions.length > 1) {
          whereClause.date = Or(...dateConditions);
        } else {
          whereClause.date = dateConditions[0];
        }
      } else {
        whereClause.date = MoreThanOrEqual(yesterday);
      }
      if (searchMRNName) {
        updateWhereClauseWithSearchName(whereClause, searchMRNName);
      }
      searchConditions.where = whereClause;
      searchConditionsWithoutPermissions.where = whereClause;
    } else {
      if (
        months.length === 0 &&
        searchMRNName &&
        option?.toLowerCase() !== 'past view' &&
        option?.toLowerCase() !== 'upcoming view'
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
          (months.length === 0 &&
            option?.toLowerCase() !== 'past view' &&
            option?.toLowerCase() !== 'upcoming view')
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
    }

    let [dbSurgeryByPractice, dbSurgeryByPracticeWithoutPermission] =
      await Promise.all([
        this.surgeryRepository.find(searchConditions),
        this.surgeryRepository.find(searchConditionsWithoutPermissions),
      ]);

    if (option?.toLowerCase() === 'waitlist view') {
      const filterWaitlist = (row: SurgeryEntity) =>
        row.waitlist && row.waitlist !== null;

      dbSurgeryByPractice = dbSurgeryByPractice.filter(filterWaitlist);
      dbSurgeryByPracticeWithoutPermission =
        dbSurgeryByPracticeWithoutPermission.filter(filterWaitlist);
    }

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
        'practice', //TO DO: make practice id not null in future
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

    createSurgeryDto.initialProfPrice =
      createSurgeryDto.totalProfessionalPricing;
    createSurgeryDto.initialHospitalPrice =
      createSurgeryDto.totalHospitalPricing;

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
      SelectedConditionsOptions: {},
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
            moment(createSurgeryDto.date).format('YYYY-MM-DD') &&
          calendar.surgeryType?.id ===
            surgeryConfigurationEntity.surgeryType?.id,
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
            surgeryTypeId: surgeryConfigurationEntity.surgeryType.id,
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
      await this.initiateSendEmail(resultSurgery, practiceEntity);
      await this.initiateDoctorSendEmail(resultSurgery, practiceEntity);
      await this.initiateReferrerSendEmail(resultSurgery, practiceEntity);
    }

    return resultSurgery;
  }

  async update(
    { createSurgeryDto, id, practiceId },
    request: Request & { user: SanitizedUser },
  ): Promise<ISurgery | null> {
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
      notes: createSurgeryDto.notes,
      surgeryOrder: createSurgeryDto.surgeryOrder
        ? createSurgeryDto.surgeryOrder
        : surgeryToUpdate?.surgeryOrder,
      surgeryStatus: createSurgeryDto.surgeryStatus
        ? createSurgeryDto.surgeryStatus
        : surgeryToUpdate?.surgeryStatus,
      practiceHome: practiceHomeEntity
        ? practiceHomeEntity
        : surgeryToUpdate?.practiceHome,
      waitlist: waitlistEntity ? waitlistEntity : surgeryToUpdate?.waitlist,
      selectedConditionalOptions: createSurgeryDto.selectedConditionalOptions,
    };

    await this.surgeryRepository.update(id, {
      ...surgeryToUpdate,
      ...dataToUpdate,
    });

    // upsert calendar after updating surgery
    const surgeryConfigurationEntity =
      surgeryToUpdate &&
      (await this.surgeryConfigurationService.getSurgeryConfigurationById(
        surgeryToUpdate?.surgeryConfiguration?.id,
      ));
    if (surgeryConfigurationEntity && surgeryToUpdate) {
      const calendars = await this.calendarService.getAllCalendars({
        practiceId: surgeryToUpdate?.practice?.id,
        userId: surgeryToUpdate?.doctor?.id,
      });

      const selectedCalendar = calendars.find(
        (calendar: ICalendar) =>
          moment(calendar.date).format('YYYY-MM-DD') ===
            moment(createSurgeryDto?.date).format('YYYY-MM-DD') &&
          calendar.surgeryType?.id ===
            surgeryConfigurationEntity.surgeryType?.id,
      );

      const reomvedCalender = calendars.find(
        (calendar: ICalendar) =>
          moment(calendar.date).format('YYYY-MM-DD') ===
            moment(surgeryToUpdate?.date).format('YYYY-MM-DD') &&
          calendar.surgeryType?.id ===
            surgeryConfigurationEntity.surgeryType?.id,
      );

      if (
        reomvedCalender &&
        moment(reomvedCalender?.date).format('YYYY-MM-DD')
      ) {
        await this.calendarService.updateCalendar({
          id: reomvedCalender?.id,
          bookedSlots: reomvedCalender?.bookedSlots - 1,
        });
      }

      if (selectedCalendar) {
        await this.calendarService.updateCalendar({
          id: selectedCalendar?.id,
          bookedSlots: selectedCalendar?.bookedSlots + 1,
        });
      } else {
        await this.calendarService.createCalendar(
          {
            practiceId: surgeryToUpdate?.practice?.id,
            userId: surgeryToUpdate?.doctor?.id,
          },
          {
            date: createSurgeryDto?.date,
            bookedSlots: 1,
            maxSlots: 14,
            surgeryTypeId: surgeryConfigurationEntity.surgeryType.id,
          },
        );
      }
    }
    if (createSurgeryDto.surgeryStatus === SurgeryStatus.COMPLETED) {
      await this.autoCompleteSurgeries(id);
    }

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

    const updatedSurgery: ISurgery | null = await this.getSurgeryById(id);

    // initiating emails for updating surgeries
    if (updatedSurgery)
      await this.initiateUpdateSurgeryMail(updatedSurgery, practiceId);

    return updatedSurgery;
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
              surgeryId: surgeryData.id,
            },
          ]);
        }
      }
    } else {
      const surgeryCompletedEntries = await this.surgeryRepository.find({
        where: {
          date: LessThan(new Date(Date.now())),
          surgeryStatus: In([
            SurgeryStatus.PENDING,
            SurgeryStatus.BOOK,
            SurgeryStatus.POSTPONE,
            SurgeryStatus.DATE_CHANGE,
          ]),
        },
        relations: [
          'practiceHome',
          'practiceHome.practice',
          'patient',
          'practice', //TO DO: make practice id not null in future
        ],
      });

      const surgeryData = await this.surgeryRepository.update(
        {
          date: LessThan(new Date(Date.now())),
          surgeryStatus: In([
            SurgeryStatus.PENDING,
            SurgeryStatus.BOOK,
            SurgeryStatus.POSTPONE,
            SurgeryStatus.DATE_CHANGE,
          ]),
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
          surgeryId: entry.id,
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
    const surgeryToUpdate = await this.getSurgeryById(id);
    const surgeryConfigurationEntity =
      surgeryToUpdate &&
      (await this.surgeryConfigurationService.getSurgeryConfigurationById(
        surgeryToUpdate?.surgeryConfiguration?.id,
      ));
    if (surgeryConfigurationEntity && surgeryToUpdate) {
      const calendars = await this.calendarService.getAllCalendars({
        practiceId: surgeryToUpdate?.practice?.id,
        userId: surgeryToUpdate?.doctor?.id,
      });
      await this.surgeryRepository.softDelete(id);

      const reomvedCalender = calendars.find(
        (calendar: ICalendar) =>
          moment(calendar.date).format('YYYY-MM-DD') ===
            moment(surgeryToUpdate?.date).format('YYYY-MM-DD') &&
          calendar.surgeryType?.id ===
            surgeryConfigurationEntity.surgeryType?.id,
      );

      if (
        reomvedCalender &&
        moment(reomvedCalender?.date).format('YYYY-MM-DD')
      ) {
        await this.calendarService.updateCalendar({
          id: reomvedCalender?.id,
          bookedSlots: reomvedCalender?.bookedSlots - 1,
        });
      }

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

  async initiateSendEmail(
    surgery: ISurgery,
    practice: IPractice,
  ): Promise<void> {
    const { name } = surgery.surgeryConfiguration;

    const systemGeneratedMailData = {
      subject: `New Surgery Scheduled: ${name}`,
      text: `<p>Dear ${surgery?.patient.firstName},<p>
        <p>Your surgery has been scheduled for ${formatHeaderDate(
          String(surgery?.date),
        )}. If you have any questions or need to reschedule, please contact us at support@pod111.com.<p>
        <p>Thank you,</p>
        <p>${practice.name}</p>
      `,
      systemTemplate: SystemTemplates.NOTIFY_PATIENT,
    };

    await this.emailHandlerService.checkAndMakeEmailContent(
      practice,
      surgery,
      systemGeneratedMailData,
      false,
    );
  }

  async initiateDoctorSendEmail(
    surgery: ISurgery,
    practice: IPractice,
  ): Promise<void> {
    const name = practice.name;

    const systemGeneratedMailData = {
      subject: `A new surgery added to your practice ${name}`,
      text: `<p>A surgery has been scheduled for you. Here is the summary:</p><p>${surgery
        ?.patient?.firstName} ${surgery?.patient?.lastName} (${formatHeaderDate(
        String(surgery?.date),
      )} | ${surgery?.surgeryConfiguration?.name})</p>`,
      systemTemplate: SystemTemplates.NOTIFY_DOCTOR,
    };

    await this.emailHandlerService.checkAndMakeDoctorEmailContent(
      practice,
      surgery,
      systemGeneratedMailData,
      false,
    );
  }

  async initiateReferrerSendEmail(
    surgery: ISurgery,
    practice: IPractice,
  ): Promise<void> {
    const name = practice.name;

    const systemGeneratedMailData = {
      subject: `Thanks for sending your patient to me  ${name}`,
      text: 'text message',
      systemTemplate: SystemTemplates.NOTIFY_REFERRER,
    };

    await this.emailHandlerService.checkAndMakeReferrerEmailContent(
      practice,
      surgery,
      systemGeneratedMailData,
      false,
    );
  }

  async findSurgeryByPatient(patientId: string): Promise<ISurgery[]> {
    return await this.surgeryRepository.find({
      where: { patient: { id: patientId } },
      relations: ['surgeryConfiguration', 'patient'],
      order: { date: 'ASC' },
    });
  }

  async initiateUpdateSurgeryMail(
    surgeryEntity: ISurgery,
    practiceId: string,
  ): Promise<void> {
    const practiceEntity: IPractice | null =
      await this.practiceService.findOne(practiceId);

    if (practiceEntity) {
      await this.emailHandlerService.checkAndMakeSurgeryUpdateEmailContent(
        practiceEntity,
        surgeryEntity,
      );
    }
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
