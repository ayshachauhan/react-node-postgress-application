import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryConfigurationEntity, SurgeryEntity } from '@packages/entities';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { EvalsModule } from 'src/evals/evals.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { ReviewsModule } from 'src/review/review.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { CalendarModule } from '../calendar/calendar.module';
import { HistoryModule } from '../history/history.module';
import { ReferrersModule } from '../referrers/referrers.module';
import { SurgeryController } from './surgery.controller';
import { SurgeryService } from './surgery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurgeryEntity, SurgeryConfigurationEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => EvalsModule),
  ],
  providers: [
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
    SurgeryService,
  ],
  controllers: [SurgeryController],
  exports: [SurgeryService],
})
export class SurgeryModule {}
