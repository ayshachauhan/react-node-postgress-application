import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CalendarEntity, HistoryEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { HistoryService } from './history.service';
import type {
  CreateHistoryParams,
  GetCalendarBySurgeryTypeIdParams,
  GetHistoryByIdParams,
  GetHistoryParams,
} from './types';

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('History')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/users/:userId/history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  getAllHistory(
    @Param()
    params: GetHistoryParams,
  ): Promise<HistoryEntity[]> {
    return this.historyService.getAllHistoryLogs(params);
  }

  @Get(':id')
  getHistoryById(
    @Param() params: GetHistoryByIdParams,
  ): Promise<HistoryEntity> {
    return this.historyService.getHistoryById(params);
  }

//   @Get('/surgery/:surgeryConfigurationId')
//   getCalendarBySurgeryType(
//     @Param() params: GetCalendarBySurgeryTypeIdParams,
//   ): Promise<CalendarEntity[]> {
//     return this.historyService.getCalendarBySurgeryConfiguration(params);
//   }

  @Post()
  createHistory(
    @Param() params: CreateHistoryParams,
    @Body(new ValidationPipe()) calendarDTO: CreateCalendarDto,
  ): Promise<CalendarEntity> {
    return this.historyService.createHistory(params, calendarDTO);
  }
}
