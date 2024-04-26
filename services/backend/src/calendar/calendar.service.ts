import {
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
import { SurgeryTypesService } from '../surgeryTypes/surgeryTypes.service';
import { CreateCalendarDto, UpdateCalendarDto } from './dto/calendar.dto';
import {
  CreateCalendarParams,
  GetCalendarByIdParams,
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
    @Inject(forwardRef(() => SurgeryTypesService))
    private surgeryTypeService: SurgeryTypesService,
  ) {}

  /**
   * Get all calendars for a specific practice > user > surgerytype
   * @param param0
   * @returns CalendarEntity[]
   */
  async getAllCalendars({
    practiceId,
    userId,
    surgeryTypeId,
  }: GetCalendarsParams): Promise<CalendarEntity[]> {
    return await this.calendarRepo.find({
      where: {
        practice: { id: practiceId },
        user: {
          id: userId,
        },
        surgeryType: {
          id: surgeryTypeId,
        },
      },
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
    });
    if (!response) {
      throw new NotFoundException('Calendar does not exists');
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
    { practiceId, userId, surgeryTypeId }: CreateCalendarParams,
    dto: CreateCalendarDto,
  ): Promise<CalendarEntity> {
    const practiceEntity = await this.practiceService.findOne(practiceId);

    const userEntity = practiceEntity?.users.find(
      (user: UserEntity) => user.id === userId,
    );

    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      surgeryTypeId,
      practiceId,
    );

    //TODO: need to check why we need to add the ! operator here, giving typeerror whithout them
    const calendar = this.calendarRepo.create({
      ...dto,
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
  async updateCalendar(
    { id }: UpdateCalendarParams,
    { maxSlots, availableSlots }: UpdateCalendarDto,
  ): Promise<CalendarEntity | null> {
    await this.calendarRepo.update(id, {
      maxSlots,
      availableSlots,
    });

    return await this.calendarRepo.findOne({ where: { id } });
  }
}
