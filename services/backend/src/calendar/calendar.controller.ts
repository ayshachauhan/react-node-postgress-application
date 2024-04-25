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
import { PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/calendar.dto';
import type {
  CreateCalendarParams,
  GetCalendarByIdParams,
  GetCalendarsParams,
} from './types';

@ApiTags('Calendar')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/users/:userId/:surgeryTypeId/calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get()
  @UseInterceptors(PracticeNotFoundInterceptor)
  getCalendars(
    @Param()
    params: GetCalendarsParams,
  ): Promise<CalendarEntity[]> {
    return this.calendarService.getAllCalendars(params);
  }

  @Get(':id')
  @UseInterceptors(PracticeNotFoundInterceptor)
  getCalendarById(
    @Param() params: GetCalendarByIdParams,
  ): Promise<CalendarEntity> {
    return this.calendarService.getCalendarById(params);
  }

  @Post()
  @UseInterceptors(PracticeNotFoundInterceptor)
  createCalendar(
    @Param() params: CreateCalendarParams,
    @Body(new ValidationPipe()) calendarDTO: CreateCalendarDto,
  ) {
    return this.calendarService.createCalendar(params, calendarDTO);
  }

  // @Patch(':id')
  // @UseInterceptors(PracticeNotFoundInterceptor)
  // updateCalendarByPracticeId(
  //   @Param('practiceId') practiceId: string,
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe()) videoData: UpdateVideoDto,
  // ) {
  //   return this.calendarService.updateCalendar(practiceId, id, videoData);
  // }
}
