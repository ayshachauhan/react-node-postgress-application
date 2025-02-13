import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';

import { CalendarEntity } from '@packages/entities';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryTypesModule } from '../surgeryTypes/surgeryTypes.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
  ],
  controllers: [CalendarController],
  providers: [practiceNotFoundInterceptor, CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
