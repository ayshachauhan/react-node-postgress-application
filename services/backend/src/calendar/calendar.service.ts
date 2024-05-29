import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity, UserEntity } from '@packages/entities/*';
import { CalendarEntity } from '@packages/entities/calendar';
import { UsersService } from 'src/users/users.service';
import { getFullYearDateConditions, getStartEndDate } from 'src/utils';
import {
  FindManyOptions,
  FindOperator,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { SurgeryConfigurationsService } from '../surgeryConfiguration/surgeryConfiguration.service';
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

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private calendarRepo: Repository<CalendarEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
    @Inject(forwardRef(() => SurgeryConfigurationsService))
    private surgeryConfifurationService: SurgeryConfigurationsService,
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
      relations: ['practice', 'surgeryConfiguration', 'user'],
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
      relations: ['practice', 'surgeryConfiguration', 'user'],
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
  async getCalendarBySurgeryConfiguration(
    params: GetCalendarBySurgeryTypeIdParams,
  ): Promise<CalendarEntity[]> {
    const response: CalendarEntity[] | null = await this.calendarRepo.find({
      where: {
        surgeryConfiguration: {
          id: params.surgeryConfigurationId,
        },
      },
      relations: ['practice', 'surgeryConfiguration', 'user'],
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

    const surgeryConfigurationEntity =
      await this.surgeryConfifurationService.getSurgeryConfigurationById(
        dto.surgeryConfigurationId,
      );

    console.log(dto, 'dtocreate');

    //TODO: need to check why we need to add the ! operator here, giving typeerror whithout them about DeepPartialEntity
    const calendar = this.calendarRepo.create({
      ...dto,
      bookedSlots: dto.bookedSlots ?? 0,
      practice: practiceEntity!,
      surgeryConfiguration: surgeryConfigurationEntity!,
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
      relations: ['practice', 'surgeryConfiguration', 'user'],
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
  }: UpdateCalendarsDto): Promise<CalendarEntity[] | null> {
    const updatedCalendars: CalendarEntity[] = [];

    await Promise.all(
      data.map(async (data) => {
        const { id, maxSlots, bookedSlots } = data;

        if (maxSlots && bookedSlots && maxSlots < bookedSlots) {
          throw new HttpException(
            'MaxSlots should be greater than or equal to booked slots',
            HttpStatus.FORBIDDEN,
          );
        }

        await this.calendarRepo.update(id, { maxSlots, bookedSlots });

        const updatedCalendar = (await this.calendarRepo.findOne({
          where: { id },
          relations: ['practice', 'surgeryConfiguration', 'user'],
        })) as CalendarEntity;

        updatedCalendars.push(updatedCalendar);
      }),
    );

    return updatedCalendars;
  }

  /**
   * Get filered calendars based on search on dashboard for a specific practice > user > surgerytype
   * @param params
   * @returns CalendarEntity[]
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
  }): Promise<CalendarEntity[]> {
    let userPermissions: PermissionEntity[] = [];

    if (loggedInUserId) {
      const userInfo: UserEntity | null =
        await this.userService.getUserById(loggedInUserId);
      userPermissions = userInfo ? userInfo.permissions || [] : [];
    }

    const whereClause: WhereClause = {
      practice: { id: practiceId },
      user: { id: userId },
    };
    if (option?.toLowerCase() === 'past') {
      const today = new Date();
      whereClause.date = LessThanOrEqual(today);
    }

    const searchConditions: FindManyOptions<CalendarEntity> = {
      where: whereClause,
      relations: ['practice', 'surgeryConfiguration', 'user'],
    };

    const dateConditions =
      months.length > 0
        ? getStartEndDate(months, userPermissions)
        : getFullYearDateConditions(userPermissions);

    if (months.length > 0) {
      searchConditions.where = dateConditions.map((condition) => ({
        ...whereClause,
        ...condition,
      }));
    } else if (months.length === 0 && option?.toLowerCase() !== 'past') {
      searchConditions.where = dateConditions.map((condition) => ({
        ...whereClause,
        ...condition,
      }));
    }

    return await this.calendarRepo.find(searchConditions);
  }
}
