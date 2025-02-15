import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReferrersEntity } from '@packages/entities/*';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticeGuard } from 'src/practices/practice.guard';
import { CreateReferrerDto } from './dtos/referrer.createDto';
import { updateReferrerDto } from './dtos/referrer.updateDto';
import { ReferrersService } from './referrers.service';

@ApiTags('referrers')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/referrer')
@UseGuards(AuthGuard, PracticeGuard)
export class ReferrersController {
  constructor(private referrerService: ReferrersService) {}

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  createReferrer(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) referrerData: CreateReferrerDto,
  ) {
    return this.referrerService.createReferrer(practiceId, referrerData);
  }

  @Delete('/:id')
  deleteReferrerById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.referrerService.deleteReferrer(practiceId, id);
  }

  @Patch(':id')
  updateReferrerById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) referrerData: updateReferrerDto,
  ) {
    return this.referrerService.updateReferrer(practiceId, id, referrerData);
  }

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_REFERRERS))
  getReferrer(@Param('practiceId') practiceId: string) {
    return this.referrerService.getReferrer(practiceId);
  }

  @Get('search')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_REFERRERS))
  async searchReferrers(
    @Param('practiceId') practiceId: string,
    @Query('keyword') keyword: string,
  ) {
    if (!keyword) {
      throw new NotFoundException('Keyword must be provided for search.');
    }
    try {
      const referrers = await this.referrerService.getReferrerByName(
        practiceId,
        keyword,
      );
      return referrers;
    } catch (error) {
      throw new NotFoundException('No referrers found.');
    }
  }

  @Get(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_REFERRERS))
  async getReferrerById(
    @Param()
    { practiceId, id }: { practiceId: string; id: string },
  ): Promise<ReferrersEntity | null> {
    const referrerInfo = await this.referrerService.getReferrerById(
      practiceId,
      id,
    );
    return referrerInfo;
  }
}
