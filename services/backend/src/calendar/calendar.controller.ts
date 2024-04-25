import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CalendarEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto, UpdateCalendarDto } from './dto/calendar.dto';
import type {
  CreateCalendarParams,
  GetCalendarByIdParams,
  GetCalendarsParams,
  UpdateCalendarParams,
} from './types';

@ApiTags('Calendar')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/users/:userId/:surgeryTypeId/calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get()
  @UseInterceptors(practiceNotFoundInterceptor)
  getCalendars(
    @Param()
    params: GetCalendarsParams,
  ): Promise<CalendarEntity[]> {
    return this.calendarService.getAllCalendars(params);
  }

  @Get(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  getCalendarById(
    @Param() params: GetCalendarByIdParams,
  ): Promise<CalendarEntity> {
    return this.calendarService.getCalendarById(params);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  createCalendar(
    @Param() params: CreateCalendarParams,
    @Body(new ValidationPipe()) calendarDTO: CreateCalendarDto,
  ) {
    return this.calendarService.createCalendar(params, calendarDTO);
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  updateCalendarByPracticeId(
    @Param() params: UpdateCalendarParams,
    @Body(new ValidationPipe()) updateDTO: UpdateCalendarDto,
  ): Promise<CalendarEntity | null> {
    return this.calendarService.updateCalendar(params, updateDTO);
  }
}
