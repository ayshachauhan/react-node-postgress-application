import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PermissionEntity,
  SurgeryTypeEntity,
  UserEntity,
} from '@packages/entities';
import { CalendarEntity } from '@packages/entities/calendar';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import logger from 'src/logger';
import { UsersService } from 'src/users/users.service';
import {
  getDateDiffInDays,
  getFullYearDateConditions,
  getStartEndDate,
} from 'src/utils';
import {
  Between,
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { SurgeryTypesService } from '../surgeryTypes/surgeryTypes.service';
import {
  CreateCalendarDto,
  UpdateCalendarDto,
  UpdateCalendarsDto,
} from './dto/calendar.dto';
import {
  CreateCalendarParams,
  GetCalendarByIdParams,
  GetCalendarBySurgeryTypeIdParams,
  GetCalendarsParams,
} from './types';

type WhereClause = {
  practice: {
    id: string;
  };
  date?: Date | FindOperator<Date>;
  user: {
    id: string;
  };
};

interface CalendarSearchResult {
  calendars: CalendarEntity[];
  restricted: boolean;
  calendarsWithoutPermission: CalendarEntity[];
}

type DateCondition = {
  date: FindOperator<Date>;
};

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private calendarRepo: Repository<CalendarEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
    @Inject(forwardRef(() => SurgeryTypesService))
    private surgeryTypesService: SurgeryTypesService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  /**
   * Get all calendars for a specific practice > user > surgerytype
   * @param param0
   * @returns CalendarEntity[]
   */
  async getAllCalendars({
    practiceId,
    userId,
  }: GetCalendarsParams): Promise<CalendarEntity[]> {
    return await this.calendarRepo.find({
      where: {
        practice: { id: practiceId },
        user: {
          id: userId,
        },
      },
      relations: ['practice', 'surgeryType', 'user'],
    });
  }

  /**
   * Get calendar by calendarid
   * @param params
   * @returns CalendarEntity
   */
  async getCalendarById(
    params: GetCalendarByIdParams,
  ): Promise<CalendarEntity> {
    const response: CalendarEntity | null = await this.calendarRepo.findOne({
      where: { id: params.id },
      relations: ['practice', 'surgeryType', 'user'],
    });
    if (!response) {
      throw new NotFoundException('Calendar does not exists');
    }
    return response;
  }

  /**
   * Get calendar by calendarid
   * @param params
   * @returns CalendarEntity
   */
  async getCalendarBySurgeryTypes(
    params: GetCalendarBySurgeryTypeIdParams,
  ): Promise<CalendarEntity[]> {
    const response: CalendarEntity[] | null = await this.calendarRepo.find({
      where: {
        surgeryType: {
          id: params.surgeryTypeId,
        },
      },
      relations: ['practice', 'surgeryType', 'user'],
    });
    if (!response) {
      throw new NotFoundException(
        'Calendar does not exists for this surgerytype',
      );
    }
    return response;
  }

  /**
   * Create Calendar
   * @param param0
   * @param dto
   * @returns
   */
  async createCalendar(
    { practiceId, userId }: CreateCalendarParams,
    dto: CreateCalendarDto,
  ): Promise<CalendarEntity> {
    logger.info(
      `Creating new calendar entry for practice ID: ${practiceId}, user ID: ${userId} with details ${dto}`,
    );
    const practiceEntity = await this.practiceService.findOne(practiceId);

    const userEntity = practiceEntity?.users.find(
      (user: UserEntity) => user.id === userId,
    );

    const surgeryTypeEntity = await this.surgeryTypesService.getSurgeryTypeById(
      dto.surgeryTypeId,
      practiceId,
    );

    if (!surgeryTypeEntity) {
      throw new HttpException('Surgery Type Not found', HttpStatus.NOT_FOUND);
    }

    const existingSurgeryTypeRecords = await this.getCalendarBySurgeryTypes({
      surgeryTypeId: dto.surgeryTypeId,
      practiceId: practiceId,
      userId: userId,
    });

    if (existingSurgeryTypeRecords) {
      const existingRecords = existingSurgeryTypeRecords.find(
        (s) =>
          s.practice?.id === practiceId &&
          s.user?.id === userId &&
          getDateDiffInDays(new Date(s.date), new Date(dto.date)) === 0,
      );
      if (existingRecords) {
        throw new HttpException(
          `Calendar slot found for this surgery type on the same date ${dto.date}`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
    }

    //TODO: need to check why we need to add the ! operator here, giving typeerror whithout them about DeepPartialEntity
    const calendar = this.calendarRepo.create({
      ...dto,
      bookedSlots: dto.bookedSlots ?? 0,
      bookedHours: dto.bookedHours ?? 0,
      practice: practiceEntity!,
      surgeryType: surgeryTypeEntity,
      user: userEntity!,
    });

    const savedCalendar = await this.calendarRepo.save(calendar);
    logger.info(`Calendar created successfully with ID: ${savedCalendar?.id}`);
    return savedCalendar;
  }

  /**
   * Update the calendar's available and maximum slots
   * @param param0
   * @param param1
   * @returns CalendarEntity | null
   */
  async updateCalendar({
    maxSlots,
    bookedSlots,
    bookedHours,
    id,
  }: UpdateCalendarDto & { id: string }): Promise<CalendarEntity | null> {
    logger.info(`Updating calendar with ID: ${id}`);
    if (maxSlots && bookedHours) {
      if (maxSlots < parseFloat(bookedHours)) {
        throw new HttpException(
          'MaxSlots should be greater than or equal to booked slots',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    await this.calendarRepo.update(id, {
      maxSlots,
      bookedSlots,
      bookedHours,
    });

    logger.info(`Calendar with ID: ${id} updated successfully`);

    return await this.calendarRepo.findOne({
      where: { id },
      relations: ['practice', 'surgeryType', 'user'],
    });
  }

  /**
   * Update bulk calendars
   * @param param0
   * @param param1
   * @returns
   */
  async updateCalendars({
    data,
    practiceId,
  }: UpdateCalendarsDto & { practiceId: string }): Promise<
    CalendarEntity[] | null
  > {
    const updatedCalendars: CalendarEntity[] = [];
    let surgeryTypeEntity: SurgeryTypeEntity | null;

    await Promise.all(
      data.map(async (data) => {
        const { id, maxSlots, bookedSlots, surgeryTypeId, bookedHours } = data;

        if (maxSlots && bookedHours && maxSlots < parseFloat(bookedHours)) {
          throw new HttpException(
            'MaxSlots should be greater than or equal to booked slots',
            HttpStatus.FORBIDDEN,
          );
        }

        if (surgeryTypeId) {
          surgeryTypeEntity = await this.surgeryTypesService.getSurgeryTypeById(
            surgeryTypeId,
            practiceId,
          );

          const existingSurgeryTypeRecords =
            await this.getCalendarBySurgeryTypes({
              surgeryTypeId: surgeryTypeId,
              practiceId: practiceId,
              userId: '',
            });

          if (existingSurgeryTypeRecords) {
            const existingCalendarRecord = (await this.calendarRepo.findOne({
              where: { id },
              relations: ['practice', 'surgeryType', 'user'],
            })) as CalendarEntity;

            const existingRecords = existingSurgeryTypeRecords.find(
              (s) =>
                s.practice?.id === practiceId &&
                s.user?.id === existingCalendarRecord?.user?.id &&
                getDateDiffInDays(
                  new Date(s.date),
                  new Date(existingCalendarRecord.date),
                ) === 0 &&
                s.maxSlots === maxSlots,
            );
            if (existingRecords) {
              logger.info(
                `Calendar slot found for this surgery type on the same date ${existingCalendarRecord.date}`,
              );
              return;
            }
          }
        }

        logger.info(`Updating calendar with ID: ${id}`);
        await this.calendarRepo.update(id, {
          maxSlots,
          bookedSlots,
          bookedHours,
          ...(surgeryTypeEntity ? { surgeryType: surgeryTypeEntity } : {}),
        });
        logger.info(`Calendar with ID: ${id} updated successfully`);

        const updatedCalendar = (await this.calendarRepo.findOne({
          where: { id },
          relations: ['practice', 'surgeryType', 'user'],
        })) as CalendarEntity;

        updatedCalendars.push(updatedCalendar);
      }),
    );

    return updatedCalendars;
  }

  /**
   * Get filered calendars based on search on dashboard for a specific practice > user > surgerytype
   * @param params
   * @returns CalendarSearchResult
   */
  async getFilteredCalendars({
    practiceId,
    userId,
    months = [],
    option,
    loggedInUserId,
  }: {
    practiceId: string;
    userId: string;
    months: string[];
    option?: string;
    loggedInUserId?: string;
  }): Promise<CalendarSearchResult> {
    let userPermissions: PermissionEntity[] = [];

    if (loggedInUserId) {
      const userInfo = await this.userService.getUserById(loggedInUserId);
      userPermissions = userInfo?.permissions || [];
      const viewFutureCases = userPermissions.some(
        (p) => p.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
      );

      if (!option && viewFutureCases) {
        option = 'Upcoming View';
      }
    }

    const whereClause: WhereClause = {
      practice: { id: practiceId },
      user: { id: userId },
    };

    const searchConditions: FindManyOptions<CalendarEntity> = {
      where: whereClause,
      relations: ['practice', 'surgeryType', 'user'],
    };

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
        const currentMonth = today.getUTCMonth();
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
          } else if (monthIndex > currentMonth) {
            const startDate = new Date(Date.UTC(9999, 0, 1)); // Far future date
            const endDate = new Date(Date.UTC(9999, 0, 2)); // Just one day after
            return Between(startDate, endDate);
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
        whereClause.date = LessThanOrEqual(today);
      }
    } else if (option?.toLowerCase() === 'upcoming view') {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set to beginning of today
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1); // Set to yesterday
      if (months.length > 0) {
        const currentYear = today.getFullYear();
        const currentMonth = today.getUTCMonth();

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
          } else if (monthIndex < currentMonth) {
            // Set startDate and endDate to an impossible range to ensure no data is returned
            const startDate = new Date(Date.UTC(9999, 0, 1)); // Far future date
            const endDate = new Date(Date.UTC(9999, 0, 2)); // Just one day after
            return Between(startDate, endDate);
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
    } else {
      if (
        months.length > 0 ||
        (months.length === 0 &&
          option?.toLowerCase() !== 'past view' &&
          option?.toLowerCase() !== 'upcoming view')
      ) {
        const conditionsWithPermissions = mapDateConditions(
          dateConditionsWithPermissions,
          whereClause,
        );
        const conditionsWithoutPermissions = mapDateConditions(
          dateConditionsWithoutPermissions,
          whereClause,
        );

        searchConditions.where = conditionsWithPermissions;
        searchConditionsWithoutPermissions.where = conditionsWithoutPermissions;
      }
    }

    const [dbCalendars, dbCalendarsWithoutPermission] = await Promise.all([
      this.calendarRepo.find(searchConditions),
      this.calendarRepo.find(searchConditionsWithoutPermissions),
    ]);

    const restricted =
      dbCalendarsWithoutPermission.length > 0 &&
      ((!userPermissions.some(
        (p) => p.name === USER_PERMISSIONS.VIEW_PAST_CASES,
      ) &&
        dbCalendarsWithoutPermission.some((s) => s.date < new Date())) ||
        (!userPermissions.some(
          (p) => p.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
        ) &&
          dbCalendarsWithoutPermission.some((s) => s.date > new Date())));

    return {
      calendars: dbCalendars,
      restricted,
      calendarsWithoutPermission: dbCalendarsWithoutPermission,
    };
  }
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

function getConditions(
  months: string[],
  permissions: PermissionEntity[],
): DateCondition[] {
  return months.length > 0
    ? getStartEndDate(months, permissions)
    : getFullYearDateConditions(permissions);
}
