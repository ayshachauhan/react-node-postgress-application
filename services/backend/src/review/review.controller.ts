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
import { updateReviewDto } from './dtos/review.updateDto';
import { ReviewService } from './review.service';

@ApiTags('Review')
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
    return this.reviewService.createReview(practiceId, referrerData);
  }

  @Post('send')
  @UseInterceptors(practiceNotFoundInterceptor)
  sendReview(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) reviewId: string,
  ) {
    return this.reviewService.sendReviewRequest(practiceId, reviewId);
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
    @Body(new ValidationPipe()) reviewData: updateReviewDto,
  ) {
    console.log(practiceId, '', id, '', reviewData);
    return this.reviewService.updateReview(practiceId, id, reviewData);
  }

  @Get()
  getReviews(@Param('practiceId') practiceId: string) {
    return this.reviewService.getReviews(practiceId);
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
      const reviews = await this.reviewService.getReviewByName(practiceId);
      return reviews;
    } catch (error) {
      throw new NotFoundException('No referrers found.');
    }
  }
}
