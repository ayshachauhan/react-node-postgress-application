import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { Review } from '@packages/entities/review';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, PracticeEntity]),
    PracticesModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, practiceNotFoundInterceptor],
})
export class ReferrersModule {}
