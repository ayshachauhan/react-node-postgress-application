import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEntity } from '@packages/entities/calendar';
import { Video } from '@packages/entities/media';
import { Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { CreateCalendarDto } from './dto/calendar.dto';
import {
  CreateCalendarParams,
  GetCalendarByIdParams,
  GetCalendarsParams,
} from './types';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private readonly calendarRepo: Repository<CalendarEntity>,
    private practiceService: PracticesService,
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
   *
   * @param params
   * @returns
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

  async createCalendar(
    { practiceId, userId, surgeryTypeId }: CreateCalendarParams,
    dto: CreateCalendarDto,
  ): Promise<Video> {
    const practiceEntity = await this.practiceService.findOne(practiceId);

    const video = this.calendarRepo.create({
      practice: practiceEntity,
      surgeryType: 
    });
    return await this.calendarRepo.save(video);
  }

  async updateCalendar(
    practiceId: string,
    videoId: string,
    videoData: Partial<Video>,
  ): Promise<Video | undefined> {
    const video = await this.getcalendarRepoById(practiceId, videoId);
    const updatedVideo = this.calendarRepo.merge(video, videoData);
    return this.calendarRepo.save(updatedVideo);
  }

  async deleteCalendar(practiceId: string, videoId: string): Promise<void> {
    await this.calendarRepo.softDelete({ id: videoId, practiceId });
  }
}
