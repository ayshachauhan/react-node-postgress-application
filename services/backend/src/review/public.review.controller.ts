import {
  Body,
  Controller,
  Param,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PostUserReview } from '@packages/entities/dist/index.browser';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { ReviewService } from './review.service';

@Controller('/practices/:practiceId/review')
export class PublicReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('validate-request')
  @UseInterceptors(practiceNotFoundInterceptor)
  validateReview(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) reviewBody: { token: string },
  ) {
    console.log('reviewBody:  ', reviewBody);
    const { token } = reviewBody;
    return this.reviewService.validateReviewRequest(practiceId, token ?? '');
  }

  @Post('user-post')
  postUserReview(
    @Param('practiceId') id: string,
    @Body(new ValidationPipe()) reviewData: PostUserReview,
  ) {
    console.log('', id, '', reviewData);
    return this.reviewService.postUserReview(id, reviewData);
  }
}
