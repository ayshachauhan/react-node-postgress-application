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
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateReferrerDto } from './dtos/referrer.createDto';
import { updateReferrerDto } from './dtos/referrer.updateDto';
import { ReferrersService } from './referrers.service';

@ApiTags('Referrers')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/referrer')
@UseGuards(AuthGuard)
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
  getReferrer(
    @Param('practiceId') practiceId: string,
    /* commenting this code to be implemented in future
    @Query('limit') limit: string,
    @Query('page') page: string,
    */
  ) {
    // return this.referrerService.getReferrer(practiceId, page, limit); //commenting this code to be implemented in future
    return this.referrerService.getReferrer(practiceId);
  }

  @Get('search')
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
}
