import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HistoryEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  Permission,
  UserPermissionsGuard,
} from 'src/auth/userPermissions.guard';
import { SanitizedUser } from '../auth/types';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { HistoryService } from './history.service';
import type { GetHistoryByIdParams, GetHistoryParams } from './types';

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('History')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  @UseGuards(UserPermissionsGuard)
  @Permission('view_hx')
  getAllHistory(
    @Param()
    params: GetHistoryParams,
    @Req() request: Request & { user: SanitizedUser },
  ): Promise<HistoryEntity[]> {
    return this.historyService.getAllHistoryLogs({
      practiceId: params.practiceId,
      userId: request.user.id,
    });
  }

  @Get(':id')
  @UseGuards(UserPermissionsGuard)
  @Permission('view_hx')
  getHistoryById(
    @Param() params: GetHistoryByIdParams,
  ): Promise<HistoryEntity> {
    return this.historyService.getHistoryById(params);
  }
}
