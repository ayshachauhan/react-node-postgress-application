import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PracticeEntity } from '@packages/entities/practice';
import { ReviewEntity } from '@packages/entities/review';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticesModule } from 'src/practices/practices.module';
import { TransporterModule } from 'src/transporter';
import { UsersModule } from 'src/users/users.module';
import { PublicReviewController } from './public.review.controller';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, PracticeEntity, PatientEntity]),
    forwardRef(() => PatientsModule),
    PracticesModule,
    TransporterModule,
    UsersModule,
  ],
  controllers: [ReviewController, PublicReviewController],
  providers: [ReviewService, practiceNotFoundInterceptor],
  exports: [ReviewService],
})
export class ReviewsModule {}
