import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CalendarEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { PracticeGuard } from 'src/practices/practice.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarDto,
  UpdateCalendarDto,
  UpdateCalendarsDto,
} from './dto/calendar.dto';
import type {
  CreateCalendarParams,
  GetCalendarByIdParams,
  GetCalendarBySurgeryTypeIdParams,
  GetCalendarsParams,
  UpdateCalendarParams,
} from './types';

interface CalendarSearchResult {
  calendars: CalendarEntity[];
  restricted: boolean;
  calendarsWithoutPermission: CalendarEntity[];
}

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('Calendar')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/users/:userId/calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get()
  @UseGuards(PracticeGuard)
  getCalendars(
    @Param()
    params: GetCalendarsParams,
  ): Promise<CalendarEntity[]> {
    return this.calendarService.getAllCalendars(params);
  }

  @Get('search')
  @UseGuards(PracticeGuard)
  async getFilteredCalendars(
    @Param() params: GetCalendarsParams,
    @Query('month') monthQueryParam: string,
    @Query('option') option?: string,
    @Query('loggedInUserId') loggedInUserId?: string,
  ): Promise<CalendarSearchResult> {
    let months: string[] = [];
    if (monthQueryParam && monthQueryParam.trim() !== '') {
      months = monthQueryParam.split(',');
    }
    const calendars = await this.calendarService.getFilteredCalendars({
      practiceId: params.practiceId,
      userId: params.userId,
      months,
      option,
      loggedInUserId,
    });
    return calendars;
  }

  @Get(':id')
  @UseGuards(PracticeGuard)
  getCalendarById(
    @Param() params: GetCalendarByIdParams,
  ): Promise<CalendarEntity> {
    return this.calendarService.getCalendarById(params);
  }

  @Get('/surgery/:surgeryTypeId')
  @UseGuards(PracticeGuard)
  getCalendarBySurgeryType(
    @Param() params: GetCalendarBySurgeryTypeIdParams,
  ): Promise<CalendarEntity[]> {
    return this.calendarService.getCalendarBySurgeryTypes(params);
  }

  @Post()
  @UseGuards(PracticeGuard)
  createCalendar(
    @Param() params: CreateCalendarParams,
    @Body(new ValidationPipe()) calendarDTO: CreateCalendarDto,
  ): Promise<CalendarEntity> {
    return this.calendarService.createCalendar(params, calendarDTO);
  }

  @Patch(':id')
  @UseGuards(PracticeGuard)
  updateCalendarByPracticeId(
    @Param() params: UpdateCalendarParams,
    @Body(new ValidationPipe()) updateDTO: UpdateCalendarDto,
  ): Promise<CalendarEntity | null> {
    return this.calendarService.updateCalendar({ id: params.id, ...updateDTO });
  }

  @Patch('')
  @UseGuards(PracticeGuard)
  updateCalendars(
    @Body(new ValidationPipe()) updateDTO: UpdateCalendarsDto,
    @Param() params: UpdateCalendarParams,
  ): Promise<CalendarEntity[] | null> {
    return this.calendarService.updateCalendars({
      ...updateDTO,
      practiceId: params.practiceId,
    });
  }
}
