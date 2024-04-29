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
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { CreateReviewDto } from './dtos/review.createDto';
//import { updateReviewDto } from './dtos/review.updateDto';
import { ReviewService } from './review.service';

@ApiTags('review')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/review')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  createReview(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) referrerData: CreateReviewDto,
  ) {
    return this.reviewService.createReferrer(practiceId, referrerData);
  }

  @Delete('/:id')
  deleteReviewById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.reviewService.deleteReview(practiceId, id);
  }

  @Patch(':id')
  updateReviewById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) referrerData: string, //updateReferrerDto,
  ) {
    console.log(practiceId, '', id, '', referrerData);
    //return this.reviewService.updateReferrer(practiceId, id, referrerData);
  }

  @Get()
  getReview(@Param('practiceId') practiceId: string) {
    return this.reviewService.getReferrer(practiceId);
  }

  @Get('search')
  async searchReviews(
    @Param('practiceId') practiceId: string,
    @Query('keyword') keyword: string,
  ) {
    if (!keyword) {
      throw new NotFoundException('Keyword must be provided for search.');
    }
    try {
      const referrers = await this.reviewService.getReviewByName(practiceId);
      return referrers;
    } catch (error) {
      throw new NotFoundException('No referrers found.');
    }
  }
}
