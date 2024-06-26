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
import { reviewRequestDto } from './dtos/review.sendrequest';
import { updateReviewDto } from './dtos/review.updateDto';
import { ReviewService } from './review.service';

@ApiTags('Review')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/review')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('send')
  @UseInterceptors(practiceNotFoundInterceptor)
  sendReview(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) reviewBody: reviewRequestDto,
  ) {
    const { id } = reviewBody;
    return this.reviewService.sendReviewRequest(practiceId, id ?? '');
  }

  @Delete('/:id')
  deleteReviewById(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }

  @Patch(':id')
  updateReviewById(
    @Param('id') id: string,
    @Body(new ValidationPipe()) reviewData: updateReviewDto,
  ) {
    return this.reviewService.updateReview(id, reviewData);
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
