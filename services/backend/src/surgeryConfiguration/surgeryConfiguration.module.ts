import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryConfigurationEntity } from '@packages/entities';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { surgeryTypeNotFoundInterceptor } from 'src/interceptors/surgeryTypeInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryConfigurationsController } from './surgeryConfiguration.controller';
import { SurgeryConfigurationsService } from './surgeryConfiguration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurgeryConfigurationEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => InsuranceTypesModule),
  ],
  providers: [
    SurgeryConfigurationsService,
    practiceNotFoundInterceptor,
    surgeryTypeNotFoundInterceptor,
  ],
  controllers: [SurgeryConfigurationsController],
  exports: [SurgeryConfigurationsService],
})
export class SurgeryConfigurationsModule {}
