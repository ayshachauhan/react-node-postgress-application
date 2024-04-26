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
import { PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateReviewDto } from './dtos/review.createDto';
//import { updateReviewDto } from './dtos/review.updateDto';
import { ReferrersService } from './review.service';

@ApiTags('review')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/review')
@UseGuards(AuthGuard)
export class ReferrersController {
  constructor(private referrerService: ReferrersService) {}

  @Post()
  @UseInterceptors(PracticeNotFoundInterceptor)
  createReferrer(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) referrerData: CreateReviewDto,
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
    @Body(new ValidationPipe()) referrerData: string, //updateReferrerDto,
  ) {
    console.log(practiceId, '', id, '', referrerData);
    //return this.referrerService.updateReferrer(practiceId, id, referrerData);
  }

  @Get()
  getReferrer(@Param('practiceId') practiceId: string) {
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
