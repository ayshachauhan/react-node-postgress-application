import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HistoryEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { HistoryService } from './history.service';
import type { GetHistoryByIdParams, GetHistoryParams } from './types';

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
}
