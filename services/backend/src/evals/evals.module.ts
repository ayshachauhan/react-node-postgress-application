import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvalEntity } from '@packages/entities/eval';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { EvalsController } from 'src/evals/evals.controller';
import { EvalsService } from 'src/evals/evals.service';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { HistoryModule } from '../history/history.module';
import { ReferrersModule } from '../referrers/referrers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvalEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => MediaModule),
    forwardRef(() => SurgeryTypesModule),
  ],
  providers: [
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
    EvalsService,
  ],
  controllers: [EvalsController],
  exports: [EvalsService],
})
export class EvalsModule {}
