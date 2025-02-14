import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PracticeEntity } from '@packages/entities/practice';
import { ReviewEntity } from '@packages/entities/review';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { PublicReviewController } from './public.review.controller';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, PracticeEntity, PatientEntity]),
    forwardRef(() => PatientsModule),
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => SurgeryConfigurationsModule),
  ],
  controllers: [ReviewController, PublicReviewController],
  providers: [ReviewService, practiceNotFoundInterceptor],
  exports: [ReviewService],
})
export class ReviewsModule {}
