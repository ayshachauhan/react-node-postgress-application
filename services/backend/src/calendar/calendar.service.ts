import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@packages/entities/*';
import { CalendarEntity } from '@packages/entities/calendar';
import { Repository } from 'typeorm';
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
  UpdateCalendarParams,
} from './types';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private calendarRepo: Repository<CalendarEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
    @Inject(forwardRef(() => SurgeryConfigurationsService))
    private surgeryConfifurationService: SurgeryConfigurationsService,
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
  async updateCalendar(
    { id }: UpdateCalendarParams,
    { maxSlots, bookedSlots }: UpdateCalendarDto,
  ): Promise<CalendarEntity | null> {
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
}
