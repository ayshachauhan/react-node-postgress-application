import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryEntity } from '@packages/entities';
import { CalendarModule } from 'src/calendar/calendar.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor as PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { EvalsModule } from '../evals/evals.module';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryModule } from '../surgery/surgery.module';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => SurgeryConfigurationsModule),
  ],
  controllers: [HistoryController],
  providers: [PracticeNotFoundInterceptor, HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
