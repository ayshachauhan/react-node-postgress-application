import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitlistEntity } from '@packages/entities';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { MediaModule } from 'src/media/media.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaitlistEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => SurgeryTypesModule),
  ],
  providers: [WaitlistService, practiceNotFoundInterceptor],
  controllers: [WaitlistController],
  exports: [WaitlistService],
})
export class WaitlistModule {}
