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
import { UsersService } from 'src/users/users.service';
import { getFullYearDateConditions, getStartEndDate } from 'src/utils';
import {
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
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
    const practiceEntity = await this.practiceService.findOne(practiceId);

    const userEntity = practiceEntity?.users.find(
      (user: UserEntity) => user.id === userId,
    );

    const surgeryTypeEntity = await this.surgeryTypesService.getSurgeryTypeById(
      dto.surgeryTypeId,
      practiceId,
    );

    //TODO: need to check why we need to add the ! operator here, giving typeerror whithout them about DeepPartialEntity
    const calendar = this.calendarRepo.create({
      ...dto,
      bookedSlots: dto.bookedSlots ?? 0,
      practice: practiceEntity!,
      surgeryType: surgeryTypeEntity!,
      user: userEntity!,
    });

    return this.calendarRepo.save(calendar);
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
    id,
  }: UpdateCalendarDto & { id: string }): Promise<CalendarEntity | null> {
    if (maxSlots && bookedSlots) {
      if (maxSlots < bookedSlots) {
        throw new HttpException(
          'MaxSlots should be greater than or equal to booked slots',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    await this.calendarRepo.update(id, {
      maxSlots,
      bookedSlots,
    });

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
        const { id, maxSlots, bookedSlots, surgeryTypeId } = data;

        if (maxSlots && bookedSlots && maxSlots < bookedSlots) {
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
        }

        await this.calendarRepo.update(id, {
          maxSlots,
          bookedSlots,
          ...(surgeryTypeEntity ? { surgeryType: surgeryTypeEntity } : {}),
        });

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
    }

    const whereClause: WhereClause = {
      practice: { id: practiceId },
      user: { id: userId },
    };
    if (option?.toLowerCase() === 'past') {
      whereClause.date = LessThanOrEqual(new Date());
    }

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

    if (
      months.length > 0 ||
      (months.length === 0 && option?.toLowerCase() !== 'past')
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
